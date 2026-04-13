import type { RichDescription, RichDescriptionBlock } from '@/data/categories';

type D1Value = string | number | boolean | null;

interface D1QueryResult<T> {
  results?: T[];
  success?: boolean;
  meta?: Record<string, unknown>;
}

interface D1ApiResponse<T> {
  success: boolean;
  errors?: Array<{ message?: string }>;
  result?: Array<D1QueryResult<T>>;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function runD1Query<T extends Record<string, unknown>>(
  sql: string,
  params: D1Value[] = []
): Promise<T[]> {
  const accountId = getRequiredEnv('CF_ACCOUNT_ID');
  const databaseId =
    process.env.CF_D1_DATABASE_ID ?? 'c82ab148-68f8-4db3-8d2d-8d47f7c268be';
  const apiToken = getRequiredEnv('CF_API_TOKEN');

  const isReadQuery = /^\s*(select|pragma|with)\b/i.test(sql);

  const requestInit: RequestInit & { next?: { revalidate: number } } = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: isReadQuery ? 'force-cache' : 'no-store',
  };

  if (isReadQuery) {
    requestInit.next = { revalidate: 300 };
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    requestInit
  );

  if (!response.ok) {
    throw new Error(`D1 request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as D1ApiResponse<T>;
  if (!payload.success) {
    const apiError = payload.errors?.[0]?.message ?? 'Unknown D1 API error';
    throw new Error(`D1 query failed: ${apiError}`);
  }

  return payload.result?.[0]?.results ?? [];
}

export async function getHealthcheckRows(limit = 5) {
  return runD1Query<{
    id: number;
    status: string;
    created_at: string;
  }>('SELECT id, status, created_at FROM healthcheck ORDER BY id DESC LIMIT ?1', [limit]);
}

export async function getAllTables() {
  return runD1Query<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
}

export async function getTableInfo(tableName: string) {
  return runD1Query<{ name: string; type: string; notnull: number; dflt_value: string; pk: number }>(
    `PRAGMA table_info(${tableName})`
  );
}

export async function getTableData(tableName: string, limit = 100) {
  return runD1Query(`SELECT * FROM ${tableName} LIMIT ?1`, [limit]);
}

export async function insertHealthcheck(status = 'ok') {
  return runD1Query('INSERT INTO healthcheck (status) VALUES (?1) RETURNING id, status, created_at', [status]);
}

// Categories
export async function getCategories() {
  return runD1Query<{
    id: string;
    slug: string;
    title: string;
    image: string;
    tag: string;
    description: string;
    accent: string;
  }>('SELECT * FROM categories ORDER BY title ASC');
}

export async function getCategoryBySlug(slug: string) {
  const results = await runD1Query<{
    id: string;
    slug: string;
    title: string;
    image: string;
    tag: string;
    description: string;
    accent: string;
  }>('SELECT * FROM categories WHERE slug = ?1', [slug]);
  return results[0];
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  category: string;
  status: string | null;
  category_title?: string;
};

type DescriptionRow = {
  id: string;
  type: string;
};

type DescriptionBlockRow = {
  block_type: string;
  content: string;
};

function toRichBlock(blockType: string, rawContent: unknown): RichDescriptionBlock | null {
  const data = rawContent && typeof rawContent === 'object' ? (rawContent as Record<string, unknown>) : {};

  if (blockType === 'list') {
    const itemsValue = Array.isArray(data.items) ? data.items : [];
    const items = itemsValue.map((item) => String(item)).filter(Boolean);
    return { type: 'list', items };
  }

  if (blockType === 'header') {
    const content = String(data.content ?? data.title ?? data.text ?? '').trim();
    if (!content) {
      return null;
    }
    const level = Number(data.level);
    return {
      type: 'header',
      content,
      level: level === 3 || level === 4 ? level : 2,
    };
  }

  if (blockType === 'faq') {
    const question = String(data.question ?? '').trim();
    const answer = String(data.answer ?? '').trim();
    if (!question || !answer) {
      return null;
    }
    return { type: 'faq', question, answer };
  }

  const text = String(data.content ?? data.text ?? '').trim();
  if (!text) {
    return null;
  }
  return { type: 'text', content: text };
}

async function getDescriptionByType(productId: string, descriptionType: string): Promise<RichDescription | undefined> {
  const descriptions = await runD1Query<DescriptionRow>(
    'SELECT id, type FROM product_descriptions WHERE product_id = ?1 AND type = ?2 LIMIT 1',
    [productId, descriptionType]
  );

  const description = descriptions[0];
  if (!description) {
    return undefined;
  }

  const blocks = await runD1Query<DescriptionBlockRow>(
    'SELECT block_type, content FROM description_blocks WHERE description_id = ?1 ORDER BY order_index ASC',
    [description.id]
  );

  const richBlocks = blocks
    .map((block) => {
      try {
        return toRichBlock(block.block_type, JSON.parse(block.content));
      } catch {
        return toRichBlock(block.block_type, {});
      }
    })
    .filter((block): block is RichDescriptionBlock => block !== null);

  return richBlocks.length > 0 ? richBlocks : undefined;
}

async function assembleProduct(productRow: ProductRow) {
  const images = await runD1Query<{ url: string; alt: string; is_primary: number }>(
    'SELECT url, alt, is_primary FROM product_images WHERE product_id = ?1 ORDER BY order_index ASC',
    [productRow.id]
  );

  const specs = await runD1Query<{ spec_key: string; spec_value: string }>(
    'SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?1 ORDER BY spec_key ASC',
    [productRow.id]
  );

  const shortDescription = await getDescriptionByType(productRow.id, 'short');
  const longDescription = await getDescriptionByType(productRow.id, 'long');
  const details = await getDescriptionByType(productRow.id, 'details');

  const firstText = [shortDescription, longDescription, details]
    .flatMap((content) => (Array.isArray(content) ? content : []))
    .find((block) => block.type === 'text');

  return {
    ...productRow,
    title: productRow.title ?? undefined,
    status: productRow.status ?? undefined,
    description: firstText?.content ?? '',
    images: images.map((img) => ({
      url: img.url,
      alt: img.alt,
      isPrimary: Boolean(img.is_primary),
    })),
    specs: Object.fromEntries(specs.map((s) => [s.spec_key, s.spec_value])),
    shortDescription,
    longDescription,
    details,
  };
}

// New normalized schema queries
export async function getProductWithDetails(productId: string) {
  const product = await runD1Query<ProductRow>(
    'SELECT p.*, c.title as category_title FROM products p LEFT JOIN categories c ON p.category = c.slug WHERE p.id = ?1',
    [productId]
  );

  if (!product.length) return null;
  return assembleProduct(product[0]);
}

export async function getProductWithDetailsBySlug(slug: string) {
  const product = await runD1Query<ProductRow>(
    'SELECT p.*, c.title as category_title FROM products p LEFT JOIN categories c ON p.category = c.slug WHERE p.slug = ?1 LIMIT 1',
    [slug]
  );

  if (!product.length) return null;
  return assembleProduct(product[0]);
}

export async function getProductsWithDetails(limit = 100) {
  const products = await runD1Query<{ id: string }>(
    'SELECT id FROM products ORDER BY name ASC LIMIT ?1',
    [limit]
  );

  const detailed = await Promise.all(products.map((p) => getProductWithDetails(p.id)));
  return detailed.filter((product): product is NonNullable<typeof product> => Boolean(product));
}

export async function getProductsByCategory2(category: string, limit = 100) {
  const products = await runD1Query<{ id: string }>(
    'SELECT id FROM products WHERE category = ?1 ORDER BY name ASC LIMIT ?2',
    [category, limit]
  );

  const detailed = await Promise.all(products.map((p) => getProductWithDetails(p.id)));
  return detailed.filter((product): product is NonNullable<typeof product> => Boolean(product));
}
