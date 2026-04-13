import { cache } from 'react';

import config from '@payload-config';
import { getPayload } from 'payload';

import { demoCategories, demoProducts } from '@/payload/demo-data';
import type { RichDescription } from '@/types/rich-content';

type PayloadCategoryDoc = {
  id: string;
  slug: string;
  title: string;
  image: string;
  tag: string;
  description?: RichDescription;
  shortDescription?: RichDescription;
  longDescription?: RichDescription;
  accent: string;
  parentId?: string | null;
};

type PayloadProductDoc = {
  id: string;
  slug: string;
  name: string;
  title?: string;
  categoryId: string;
  description?: RichDescription;
  shortDescription?: RichDescription;
  longDescription?: RichDescription;
  details?: RichDescription;
  images?: Array<{ url: string; alt: string; isPrimary?: boolean }>;
  badges?: string[];
  specs?: Record<string, string>;
  status?: string;
};

const getPayloadClient = cache(async () => getPayload({ config }));
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const demoCategoryAccentBySlug: Record<string, string> = {
  'paper-products': '#1f6f8b',
  'large-format-printing': '#e85d04',
  'garment-printing': '#2a9d8f',
};

function mapDemoCategory(category: (typeof demoCategories)[number]) {
  return {
    id: category.id,
    slug: category.slug,
    title: category.name,
    image: category.imageUrl,
    tag: category.tag,
    description: category.description,
    shortDescription: category.description,
    longDescription: category.description,
    accent: demoCategoryAccentBySlug[category.slug] ?? '#1b3c53',
    parentId: category.parentId,
  };
}

function mapDemoProduct(product: (typeof demoProducts)[number]) {
  const categorySlug = product.categoryId[0] ?? '';

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    title: product.name,
    category: categorySlug,
    categoryId: [categorySlug],
    description: product.description,
    shortDescription: product.shortDescription,
    longDescription: product.description,
    details: product.shortDescription,
    badges: product.badges,
    status: product.badges.join(','),
    images: product.imageUrls.map((url, index) => ({
      url,
      alt: index === 0 ? product.name : `${product.name} ${index + 1}`,
      isPrimary: index === 0,
    })),
    specs: {},
  };
}

function parseJsonArray(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item && typeof item === 'object' && 'value' in item) {
          return String((item as { value?: unknown }).value ?? '');
        }

        return String(item);
      })
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.map((item) => String(item)).filter(Boolean);
    } catch {
      return [];
    }
  }

  return [];
}

function mapCategory(row: PayloadCategoryDoc) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    image: row.image,
    tag: row.tag || 'Category',
    description: row.description ?? '',
    shortDescription: row.shortDescription ?? row.description ?? '',
    longDescription: row.longDescription ?? row.description ?? '',
    accent: row.accent || '#1b3c53',
    parentId: row.parentId ?? null,
  };
}

function mapProduct(row: PayloadProductDoc) {
  const imageUrls = row.images ?? [];
  const badges = row.badges ?? [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    category: row.categoryId,
    categoryId: [row.categoryId],
    description: row.description ?? '',
    shortDescription: (row.shortDescription ?? row.description ?? '') as RichDescription,
    longDescription: (row.longDescription ?? row.details ?? row.description ?? '') as RichDescription,
    details: (row.details ?? row.longDescription ?? row.description ?? '') as RichDescription,
    badges,
    status: row.status ?? badges.join(', '),
    images: imageUrls.map((image, index) => ({
      url: image.url,
      alt: image.alt || row.name,
      isPrimary: index === 0,
    })),
    specs: row.specs ?? {},
  };
}

function normalizeCategoryDoc(doc: Record<string, unknown>): PayloadCategoryDoc {
  return {
    id: String(doc.id),
    slug: String(doc.slug ?? ''),
    title: String(doc.title ?? ''),
    image: String(doc.image ?? ''),
    tag: String(doc.tag ?? 'Category'),
    description: doc.description as RichDescription | undefined,
    shortDescription: doc.shortDescription as RichDescription | undefined,
    longDescription: doc.longDescription as RichDescription | undefined,
    accent: String(doc.accent ?? '#1b3c53'),
    parentId: (doc.parentId as string | null | undefined) ?? null,
  };
}

function normalizeProductDoc(doc: Record<string, unknown>): PayloadProductDoc {
  return {
    id: String(doc.id),
    slug: String(doc.slug ?? ''),
    name: String(doc.name ?? ''),
    title: doc.title ? String(doc.title) : undefined,
    categoryId: String(doc.categoryId ?? ''),
    description: doc.description as RichDescription | undefined,
    shortDescription: doc.shortDescription as RichDescription | undefined,
    longDescription: doc.longDescription as RichDescription | undefined,
    details: doc.details as RichDescription | undefined,
    images: Array.isArray(doc.images)
      ? doc.images.map((image) => ({
          url: String((image as { url?: string }).url ?? ''),
          alt: String((image as { alt?: string }).alt ?? String(doc.name ?? '')),
          isPrimary: (image as { isPrimary?: boolean }).isPrimary,
        }))
      : [],
    badges: parseJsonArray(doc.badges),
    specs: (doc.specs as Record<string, string> | undefined) ?? {},
    status: doc.status ? String(doc.status) : undefined,
  };
}

export async function getCategories() {
  if (!hasDatabaseUrl) {
    return demoCategories.map(mapDemoCategory);
  }

  const payload = await getPayloadClient();
  const response = await payload.find({ collection: 'categories', limit: 1000, sort: 'title' });
  return response.docs.map((doc) => mapCategory(normalizeCategoryDoc(doc as Record<string, unknown>)));
}

export async function getCategoryBySlug(slug: string) {
  if (!hasDatabaseUrl) {
    const category = demoCategories.find((item) => item.slug === slug);
    return category ? mapDemoCategory(category) : null;
  }

  const payload = await getPayloadClient();
  const response = await payload.find({ collection: 'categories', limit: 1, where: { slug: { equals: slug } } });

  if (!response.docs[0]) {
    return null;
  }

  return mapCategory(normalizeCategoryDoc(response.docs[0] as Record<string, unknown>));
}

export async function getProductsWithDetails(limit = 100) {
  if (!hasDatabaseUrl) {
    return demoProducts.map(mapDemoProduct).slice(0, limit);
  }

  const payload = await getPayloadClient();
  const response = await payload.find({ collection: 'products', limit, sort: '-createdAt' });
  return response.docs.map((doc) => mapProduct(normalizeProductDoc(doc as Record<string, unknown>)));
}

export async function getProductWithDetailsBySlug(slug: string) {
  if (!hasDatabaseUrl) {
    const product = demoProducts.find((item) => item.slug === slug);
    return product ? mapDemoProduct(product) : null;
  }

  const payload = await getPayloadClient();
  const response = await payload.find({ collection: 'products', limit: 1, where: { slug: { equals: slug } } });

  if (!response.docs[0]) {
    return null;
  }

  return mapProduct(normalizeProductDoc(response.docs[0] as Record<string, unknown>));
}

export async function getProductsByCategory2(categorySlug: string, limit = 100) {
  const products = await getProductsWithDetails(1000);
  return products.filter((product) => product.category === categorySlug).slice(0, limit);
}

export async function getTableSummary() {
  return [];
}

export async function runD1Query<T extends Record<string, unknown>>(): Promise<T[]> {
  throw new Error('D1 access has been removed. Payload CMS is the active data layer.');
}
