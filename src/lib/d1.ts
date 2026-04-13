import { cache } from 'react';

import config from '@payload-config';
import { getPayload } from 'payload';

import { demoCategories, demoProducts } from '@/payload/demo-data';

export type CategoryRecord = {
	id: string;
	name: string;
	description: string;
	imageUrl: string;
	parentId: string | null;
};

export type ProductRecord = {
	id: string;
	name: string;
	imageUrl: string[];
	description: string;
	shortDescription: string;
	badges: string[];
	categoryId: string[];
};

const getPayloadClient = cache(async () => getPayload({ config }));
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

function parseStringArray(value: unknown): string[] {
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

				return '';
			})
			.filter(Boolean);
	}

	return [];
}

function normalizeCategoryDoc(doc: Record<string, unknown>): CategoryRecord {
	return {
		id: String(doc.id ?? ''),
		name: String(doc.name ?? ''),
		description: String(doc.description ?? ''),
		imageUrl: String(doc.imageUrl ?? ''),
		parentId: (doc.parentId as string | null | undefined) ?? null,
	};
}

function normalizeProductDoc(doc: Record<string, unknown>): ProductRecord {
	return {
		id: String(doc.id ?? ''),
		name: String(doc.name ?? ''),
		imageUrl: parseStringArray(doc.imageUrl),
		description: String(doc.description ?? ''),
		shortDescription: String(doc.shortDescription ?? ''),
		badges: parseStringArray(doc.badges),
		categoryId: parseStringArray(doc.categoryId),
	};
}

function mapDemoProduct(product: (typeof demoProducts)[number]): ProductRecord {
	return {
		id: product.id,
		name: product.name,
		imageUrl: product.imageUrls,
		description: product.description,
		shortDescription: product.shortDescription,
		badges: product.badges,
		categoryId: product.categoryId,
	};
}

export async function getCategories(): Promise<CategoryRecord[]> {
	if (!hasDatabaseUrl) {
		return demoCategories;
	}

	const payload = await getPayloadClient();
	const response = await payload.find({ collection: 'categories', limit: 1000, sort: 'name' });
	return response.docs.map((doc) => normalizeCategoryDoc(doc as Record<string, unknown>));
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
	if (!hasDatabaseUrl) {
		return demoCategories.find((item) => item.id === id) ?? null;
	}

	const payload = await getPayloadClient();
	const response = await payload.find({ collection: 'categories', limit: 1, where: { id: { equals: id } } });
	const doc = response.docs[0] as Record<string, unknown> | undefined;
	return doc ? normalizeCategoryDoc(doc) : null;
}

export async function getProducts(limit = 100): Promise<ProductRecord[]> {
	if (!hasDatabaseUrl) {
		return demoProducts.slice(0, limit).map(mapDemoProduct);
	}

	const payload = await getPayloadClient();
	const response = await payload.find({ collection: 'products', limit, sort: 'name' });
	return response.docs.map((doc) => normalizeProductDoc(doc as Record<string, unknown>));
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
	if (!hasDatabaseUrl) {
		const product = demoProducts.find((item) => item.id === id);
		return product ? mapDemoProduct(product) : null;
	}

	const payload = await getPayloadClient();
	const response = await payload.find({ collection: 'products', limit: 1, where: { id: { equals: id } } });
	const doc = response.docs[0] as Record<string, unknown> | undefined;
	return doc ? normalizeProductDoc(doc) : null;
}

export async function getProductsByCategoryId(categoryId: string, limit = 100): Promise<ProductRecord[]> {
	const products = await getProducts(1000);
	return products.filter((product) => product.categoryId.includes(categoryId)).slice(0, limit);
}
