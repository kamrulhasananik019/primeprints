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

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store',
    }
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

// Products
export async function getProducts(limit = 1000) {
  return runD1Query<{
    id: string;
    slug: string;
    name: string;
    title: string | null;
    category: string;
    description: string;
    shortDescription: string | null;
    longDescription: string | null;
    details: string | null;
    images: string;
    specs: string;
    status: string | null;
  }>('SELECT * FROM products ORDER BY name ASC LIMIT ?1', [limit]);
}

export async function getProductBySlug(slug: string) {
  const results = await runD1Query<{
    id: string;
    slug: string;
    name: string;
    title: string | null;
    category: string;
    description: string;
    shortDescription: string | null;
    longDescription: string | null;
    details: string | null;
    images: string;
    specs: string;
    status: string | null;
  }>('SELECT * FROM products WHERE slug = ?1', [slug]);
  return results[0];
}

export async function getProductsByCategory(category: string, limit = 100) {
  return runD1Query<{
    id: string;
    slug: string;
    name: string;
    title: string | null;
    category: string;
    description: string;
    shortDescription: string | null;
    longDescription: string | null;
    details: string | null;
    images: string;
    specs: string;
    status: string | null;
  }>('SELECT * FROM products WHERE category = ?1 ORDER BY name ASC LIMIT ?2', [category, limit]);
}

// New normalized schema queries
export async function getProductWithDetails(productId: string) {
  const product = await runD1Query(
    'SELECT p.*, c.title as category_title FROM products p LEFT JOIN categories c ON p.category = c.slug WHERE p.id = ?1',
    [productId]
  );
  
  if (!product.length) return null;

  const productData = product[0];
  const images = await runD1Query(
    'SELECT url, alt, is_primary FROM product_images WHERE product_id = ?1 ORDER BY order_index ASC',
    [productId]
  );
  
  const specs = await runD1Query(
    'SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?1 ORDER BY spec_key ASC',
    [productId]
  );

  const descriptions = await runD1Query(
    'SELECT id, type FROM product_descriptions WHERE product_id = ?1',
    [productId]
  );

  const descriptionsWithBlocks = await Promise.all(
    descriptions.map(async (desc: any) => {
      const blocks = await runD1Query(
        'SELECT block_type, content FROM description_blocks WHERE description_id = ?1 ORDER BY order_index ASC',
        [desc.id]
      );
      return {
        type: desc.type,
        blocks: blocks.map((b: any) => ({
          type: b.block_type,
          content: JSON.parse(b.content),
        })),
      };
    })
  );

  return {
    ...productData,
    images: images.map((img: any) => ({
      url: img.url,
      alt: img.alt,
      isPrimary: Boolean(img.is_primary),
    })),
    specs: Object.fromEntries(specs.map((s: any) => [s.spec_key, s.spec_value])),
    descriptions: Object.fromEntries(descriptionsWithBlocks.map((d: any) => [d.type, d.blocks])),
  };
}

export async function getProductsWithDetails(limit = 100) {
  const products = await runD1Query<{ id: string }>(
    'SELECT id FROM products ORDER BY name ASC LIMIT ?1',
    [limit]
  );

  return Promise.all(products.map((p) => getProductWithDetails(p.id)));
}

export async function getProductsByCategory2(category: string, limit = 100) {
  const products = await runD1Query<{ id: string }>(
    'SELECT id FROM products WHERE category = ?1 ORDER BY name ASC LIMIT ?2',
    [category, limit]
  );

  return Promise.all(products.map((p) => getProductWithDetails(p.id)));
}
