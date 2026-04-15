import { ObjectId } from 'mongodb';
import { unstable_cache } from 'next/cache';

import { toSlug } from '@/lib/slug';
import { getMongoDb } from '@/lib/mongodb';
import type { RichDescription, TipTapDoc } from '@/types/rich-content';

type RichTextDoc = {
  type: 'doc';
  content: Array<Record<string, unknown>>;
};

type SeoBlock = {
  title: string;
  description: string;
  keywords: string[];
  image: string;
};

type ImageBlock = {
  url: string;
  alt: string;
};

type CategoryDoc = {
  _id: ObjectId;
  slug: string;
  name: string;
  shortDescription?: RichTextDoc | RichDescription;
  description: RichTextDoc | RichDescription;
  image: ImageBlock;
  parentId: ObjectId | null;
  seo: SeoBlock;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type ProductDoc = {
  _id: ObjectId;
  slug: string;
  name: string;
  shortDescription: RichTextDoc | RichDescription;
  description: RichTextDoc | RichDescription;
  images: ImageBlock[];
  badges: string[];
  categoryIds: ObjectId[];
  seo: SeoBlock;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type AdminDoc = {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  // Cache index creation so repeated reads do not re-run createIndexes on every request.
  var __primeprintsIndexesPromise: Promise<void> | undefined;
}

export type CategoryRecord = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: RichDescription;
  description: RichDescription;
  image: ImageBlock;
  imageUrl: string;
  parentId: string | null;
  seo: SeoBlock;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  shortDescription: RichDescription;
  description: RichDescription;
  images: ImageBlock[];
  categoryIds: string[];
  seo: SeoBlock;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  // Backward-compatible aliases for existing UI paths.
  imageUrl: string[];
  badges: string[];
  categoryId: string[];
};

export type AdminCategoryRow = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  created_at: string;
};

export type AdminProductRow = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  short_description: string;
  badges: string;
  category_id: string;
  created_at: string;
};

function defaultRichText(text = ''): TipTapDoc {
  return {
    type: 'doc',
    content: text
      ? [
          {
            type: 'paragraph',
            content: [{ type: 'text', text }],
          },
        ]
      : [],
  };
}

function isTipTapDoc(value: unknown): value is TipTapDoc {
  return Boolean(value && typeof value === 'object' && (value as { type?: string }).type === 'doc');
}

function parseRichValue(value: string | null | undefined): RichDescription {
  if (!value) return defaultRichText();
  try {
    const parsed = JSON.parse(value) as unknown;
    if (isTipTapDoc(parsed)) return parsed;
    return defaultRichText(value);
  } catch {
    return defaultRichText(value);
  }
}

function normalizeRichContent(value: unknown): RichDescription {
  if (!value) return defaultRichText();
  if (typeof value === 'string') return parseRichValue(value);
  if (isTipTapDoc(value)) return value;
  return defaultRichText();
}

function toStoredRich(value: string): TipTapDoc {
  return normalizeRichContent(value);
}

function toObjectId(value: string): ObjectId | null {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

function idToString(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value instanceof ObjectId) return value.toHexString();

  if (typeof value === 'object') {
    const maybeObject = value as { toHexString?: () => string; $oid?: string; toString?: () => string };
    if (typeof maybeObject.toHexString === 'function') {
      return maybeObject.toHexString();
    }
    if (typeof maybeObject.$oid === 'string') {
      return maybeObject.$oid;
    }
    if (typeof maybeObject.toString === 'function') {
      const asString = maybeObject.toString();
      if (asString && asString !== '[object Object]') return asString;
    }
  }

  return '';
}

function asIsoString(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }
  if (typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }
  if (typeof value === 'object') {
    const maybeDate = value as { $date?: string | number | Date };
    if (maybeDate.$date) {
      return asIsoString(maybeDate.$date);
    }
  }
  return new Date().toISOString();
}

function seoDefaults(title: string, description: string, image: string): SeoBlock {
  return {
    title,
    description,
    keywords: [],
    image,
  };
}

async function ensureIndexes() {
  if (!globalThis.__primeprintsIndexesPromise) {
    globalThis.__primeprintsIndexesPromise = (async () => {
      const db = await getMongoDb();
      await Promise.all([
        db.collection<CategoryDoc>('categories').createIndexes([
          { key: { slug: 1 }, unique: true },
          { key: { parentId: 1 } },
        ]),
        db.collection<ProductDoc>('products').createIndexes([
          { key: { slug: 1 }, unique: true },
          { key: { categoryIds: 1 } },
          { key: { isFeatured: 1 } },
          { key: { isActive: 1 } },
        ]),
        db.collection<AdminDoc>('admins').createIndexes([{ key: { email: 1 }, unique: true }]),
      ]);
    })();
  }

  await globalThis.__primeprintsIndexesPromise;
}

function mapCategoryDoc(doc: CategoryDoc): CategoryRecord {
  const image = doc.image || { url: '', alt: '' };
  const createdAt = asIsoString(doc.createdAt);
  const updatedAt = asIsoString(doc.updatedAt);
  return {
    id: idToString(doc._id),
    slug: doc.slug,
    name: doc.name,
    shortDescription: normalizeRichContent(doc.shortDescription),
    description: normalizeRichContent(doc.description),
    image,
    imageUrl: image.url,
    parentId: doc.parentId ? idToString(doc.parentId) : null,
    seo: doc.seo || seoDefaults(doc.name, doc.name, image.url),
    isActive: doc.isActive !== false,
    sortOrder: doc.sortOrder ?? 1,
    createdAt,
    updatedAt,
  };
}

function mapProductDoc(doc: ProductDoc): ProductRecord {
  const images = Array.isArray(doc.images) ? doc.images : [];
  const categoryIds = Array.isArray(doc.categoryIds) ? doc.categoryIds.map((item) => idToString(item)).filter(Boolean) : [];
  const createdAt = asIsoString(doc.createdAt);
  const updatedAt = asIsoString(doc.updatedAt);
  return {
    id: idToString(doc._id),
    slug: doc.slug,
    name: doc.name,
    shortDescription: normalizeRichContent(doc.shortDescription),
    description: normalizeRichContent(doc.description),
    images,
    categoryIds,
    seo: doc.seo || seoDefaults(doc.name, doc.name, images[0]?.url || ''),
    isFeatured: doc.isFeatured === true,
    isActive: doc.isActive !== false,
    sortOrder: doc.sortOrder ?? 1,
    createdAt,
    updatedAt,
    imageUrl: images.map((item) => item.url).filter(Boolean),
    badges: Array.isArray(doc.badges) ? doc.badges : [],
    categoryId: categoryIds,
  };
}

const getCachedCategories = unstable_cache(
  async () => {
    await ensureIndexes();
    const db = await getMongoDb();
    const rows = await db
      .collection<CategoryDoc>('categories')
      .find(
        { isActive: { $ne: false } },
        {
          projection: {
            _id: 1,
            slug: 1,
            name: 1,
            shortDescription: 1,
            description: 1,
            image: 1,
            parentId: 1,
            seo: 1,
            isActive: 1,
            sortOrder: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        }
      )
      .sort({ sortOrder: 1, name: 1 })
      .toArray();
    return rows;
  },
  ['catalog-categories'],
  { revalidate: 300, tags: ['catalog'] }
);

const getCachedProducts = unstable_cache(
  async () => {
    await ensureIndexes();
    const db = await getMongoDb();
    const rows = await db
      .collection<ProductDoc>('products')
      .find(
        { isActive: { $ne: false } },
        {
          projection: {
            _id: 1,
            slug: 1,
            name: 1,
            shortDescription: 1,
            description: 1,
            images: 1,
            badges: 1,
            categoryIds: 1,
            seo: 1,
            isFeatured: 1,
            isActive: 1,
            sortOrder: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        }
      )
      .sort({ sortOrder: 1, name: 1 })
      .toArray();
    return rows;
  },
  ['catalog-products'],
  { revalidate: 300, tags: ['catalog'] }
);

export async function getCategories(): Promise<CategoryRecord[]> {
  const rows = await getCachedCategories();
  return rows.map(mapCategoryDoc);
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
  const rows = await getCachedCategories();
  const normalized = id.toLowerCase();
  const row = rows.find(
    (item) => idToString(item._id) === id || item.slug === normalized || item.name.toLowerCase() === normalized || toSlug(item.name) === normalized
  );
  return row ? mapCategoryDoc(row) : null;
}

export async function getProducts(limit = 100): Promise<ProductRecord[]> {
  const rows = await getCachedProducts();
  return rows.slice(0, limit).map(mapProductDoc);
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const rows = await getCachedProducts();
  const normalized = id.toLowerCase();
  const row = rows.find(
    (item) => idToString(item._id) === id || item.slug === normalized || item.name.toLowerCase() === normalized || toSlug(item.name) === normalized
  );
  return row ? mapProductDoc(row) : null;
}

export async function getProductsByCategoryId(categoryId: string, limit = 100): Promise<ProductRecord[]> {
  const products = await getProducts(1000);
  return products.filter((product) => product.categoryIds.includes(categoryId)).slice(0, limit);
}

export async function getAdminByEmail(email: string): Promise<{ email: string; password_hash: string } | null> {
  await ensureIndexes();
  const db = await getMongoDb();
  const admin = await db.collection<AdminDoc>('admins').findOne({ email: email.toLowerCase() });
  if (!admin) return null;
  return { email: admin.email, password_hash: admin.passwordHash };
}

export async function upsertAdmin(email: string, passwordHash: string): Promise<void> {
  await ensureIndexes();
  const db = await getMongoDb();
  const now = new Date();
  await db.collection<AdminDoc>('admins').updateOne(
    { email: email.toLowerCase() },
    {
      $setOnInsert: {
        _id: new ObjectId(),
        createdAt: now,
      },
      $set: {
        email: email.toLowerCase(),
        passwordHash,
        updatedAt: now,
      },
    },
    { upsert: true }
  );
}

export async function countAdminItems(): Promise<{ categories: number; products: number; admins: number }> {
  await ensureIndexes();
  const db = await getMongoDb();
  const [categories, products, admins] = await Promise.all([
    db.collection<CategoryDoc>('categories').countDocuments(),
    db.collection<ProductDoc>('products').countDocuments(),
    db.collection<AdminDoc>('admins').countDocuments(),
  ]);
  return { categories, products, admins };
}

export async function getAdminCategories(): Promise<AdminCategoryRow[]> {
  await ensureIndexes();
  const db = await getMongoDb();
  const rows = await db
    .collection<CategoryDoc>('categories')
    .find(
      {},
      {
        projection: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          parentId: 1,
          createdAt: 1,
        },
      }
    )
    .sort({ createdAt: -1 })
    .toArray();

  return rows.map((row) => ({
    id: idToString(row._id),
    name: row.name,
    description: JSON.stringify(row.description || defaultRichText()),
    image_url: row.image?.url || '',
    parent_id: row.parentId ? idToString(row.parentId) : null,
    created_at: asIsoString(row.createdAt),
  }));
}

export async function createAdminCategory(input: {
  name: string;
  imageUrl: string;
  parentId: string | null;
  description: string;
}): Promise<void> {
  await ensureIndexes();
  const db = await getMongoDb();
  const now = new Date();

  await db.collection<CategoryDoc>('categories').insertOne({
    _id: new ObjectId(),
    slug: toSlug(input.name),
    name: input.name,
    shortDescription: defaultRichText(),
    description: toStoredRich(input.description),
    image: { url: input.imageUrl, alt: `${input.name} image` },
    parentId: input.parentId ? toObjectId(input.parentId) : null,
    seo: seoDefaults(`${input.name} Printing`, input.name, input.imageUrl),
    isActive: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateAdminCategory(
  id: string,
  input: {
    name: string;
    imageUrl: string;
    parentId: string | null;
    description: string;
  }
): Promise<void> {
  const objectId = toObjectId(id);
  if (!objectId) throw new Error('Invalid category id');

  await ensureIndexes();
  const db = await getMongoDb();
  await db.collection<CategoryDoc>('categories').updateOne(
    { _id: objectId },
    {
      $set: {
        slug: toSlug(input.name),
        name: input.name,
        description: toStoredRich(input.description),
        image: { url: input.imageUrl, alt: `${input.name} image` },
        parentId: input.parentId ? toObjectId(input.parentId) : null,
        seo: seoDefaults(`${input.name} Printing`, input.name, input.imageUrl),
        updatedAt: new Date(),
      },
    }
  );
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const objectId = toObjectId(id);
  if (!objectId) throw new Error('Invalid category id');

  await ensureIndexes();
  const db = await getMongoDb();
  await db.collection<CategoryDoc>('categories').deleteOne({ _id: objectId });
}

export async function resolveCategoryIds(values: string[]): Promise<string[]> {
  if (values.length === 0) return [];

  await ensureIndexes();
  const db = await getMongoDb();
  const asIds = values.map(toObjectId).filter((item): item is ObjectId => Boolean(item));
  const byIds = asIds.length ? await db.collection<CategoryDoc>('categories').find({ _id: { $in: asIds } }).toArray() : [];
  const matchedIdSet = new Set(byIds.map((row) => idToString(row._id)).filter(Boolean));

  const unresolved = values.filter((value) => !matchedIdSet.has(value));
  if (unresolved.length > 0) {
    const byName = await db
      .collection<CategoryDoc>('categories')
      .find({ name: { $in: unresolved.map((item) => item.trim()) } })
      .toArray();
    for (const row of byName) {
      matchedIdSet.add(idToString(row._id));
    }
  }

  return Array.from(matchedIdSet);
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  await ensureIndexes();
  const db = await getMongoDb();
  const rows = await db
    .collection<ProductDoc>('products')
    .find(
      {},
      {
        projection: {
          _id: 1,
          name: 1,
          images: 1,
          description: 1,
          shortDescription: 1,
          badges: 1,
          categoryIds: 1,
          createdAt: 1,
        },
      }
    )
    .sort({ createdAt: -1 })
    .toArray();

  return rows.map((row) => ({
    id: idToString(row._id),
    name: row.name,
    image_url: JSON.stringify((row.images || []).map((item) => item.url)),
    description: JSON.stringify(row.description || defaultRichText()),
    short_description: JSON.stringify(row.shortDescription || defaultRichText()),
    badges: JSON.stringify(row.badges || []),
    category_id: JSON.stringify((row.categoryIds || []).map((item) => idToString(item)).filter(Boolean)),
    created_at: asIsoString(row.createdAt),
  }));
}

export async function createAdminProduct(input: {
  name: string;
  imageUrls: string[];
  badges: string[];
  categoryIds: string[];
  description: string;
  shortDescription: string;
}): Promise<void> {
  await ensureIndexes();
  const db = await getMongoDb();
  const now = new Date();
  const imageUrl = input.imageUrls[0] || '';

  await db.collection<ProductDoc>('products').insertOne({
    _id: new ObjectId(),
    slug: toSlug(input.name),
    name: input.name,
    shortDescription: toStoredRich(input.shortDescription),
    description: toStoredRich(input.description),
    images: input.imageUrls.map((url, index) => ({ url, alt: `${input.name} image ${index + 1}` })),
    badges: input.badges,
    categoryIds: input.categoryIds.map((id) => toObjectId(id)).filter((item): item is ObjectId => Boolean(item)),
    seo: seoDefaults(`${input.name} Printing`, input.name, imageUrl),
    isFeatured: input.badges.some((badge) => badge.toLowerCase() === 'featured'),
    isActive: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateAdminProduct(
  id: string,
  input: {
    name: string;
    imageUrls: string[];
    badges: string[];
    categoryIds: string[];
    description: string;
    shortDescription: string;
  }
): Promise<void> {
  const objectId = toObjectId(id);
  if (!objectId) throw new Error('Invalid product id');

  await ensureIndexes();
  const db = await getMongoDb();
  const imageUrl = input.imageUrls[0] || '';
  await db.collection<ProductDoc>('products').updateOne(
    { _id: objectId },
    {
      $set: {
        slug: toSlug(input.name),
        name: input.name,
        shortDescription: toStoredRich(input.shortDescription),
        description: toStoredRich(input.description),
        images: input.imageUrls.map((url, index) => ({ url, alt: `${input.name} image ${index + 1}` })),
        badges: input.badges,
        categoryIds: input.categoryIds.map((value) => toObjectId(value)).filter((item): item is ObjectId => Boolean(item)),
        seo: seoDefaults(`${input.name} Printing`, input.name, imageUrl),
        isFeatured: input.badges.some((badge) => badge.toLowerCase() === 'featured'),
        updatedAt: new Date(),
      },
    }
  );
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const objectId = toObjectId(id);
  if (!objectId) throw new Error('Invalid product id');

  await ensureIndexes();
  const db = await getMongoDb();
  await db.collection<ProductDoc>('products').deleteOne({ _id: objectId });
}