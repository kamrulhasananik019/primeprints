import { d1Query } from '@/lib/cloudflare-d1';
import { unstable_cache } from 'next/cache';
import type { RichDescription } from '@/types/rich-content';

export type CategoryRecord = {
	id: string;
	name: string;
	description: RichDescription;
	imageUrl: string;
	parentId: string | null;
};

export type ProductRecord = {
	id: string;
	name: string;
	imageUrl: string[];
	description: RichDescription;
	shortDescription: RichDescription;
	badges: string[];
	categoryId: string[];
};
type CategoryRow = {
	id: string;
	name: string;
	description: string;
	image_url: string;
	parent_id: string | null;
};

type ProductRow = {
	id: string;
	name: string;
	image_url: string;
	description: string;
	short_description: string;
	badges: string;
	category_id: string;
};

function parseJsonArray(value: string | null | undefined): string[] {
	if (!value) return [];
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.map((item) => String(item)).filter(Boolean) : [];
	} catch {
		return [];
	}
}

function parseRichValue(value: string | null | undefined): RichDescription {
	if (!value) return '';
	try {
		return JSON.parse(value) as RichDescription;
	} catch {
		return value;
	}
}

const getCachedCategories = unstable_cache(
	async () => {
		try {
			return await d1Query<CategoryRow>('SELECT id, name, description, image_url, parent_id FROM categories ORDER BY name ASC');
		} catch {
			return [];
		}
	},
	['catalog-categories'],
	{ revalidate: 300, tags: ['catalog'] }
);

const getCachedProducts = unstable_cache(
	async () => {
		try {
			return await d1Query<ProductRow>(
				'SELECT id, name, image_url, description, short_description, badges, category_id FROM products ORDER BY name ASC'
			);
		} catch {
			return [];
		}
	},
	['catalog-products'],
	{ revalidate: 300, tags: ['catalog'] }
);

export async function getCategories(): Promise<CategoryRecord[]> {
	const rows = await getCachedCategories();
	return rows.map((row) => ({
		id: row.id,
		name: row.name,
		description: parseRichValue(row.description),
		imageUrl: row.image_url,
		parentId: row.parent_id,
	}));
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
	const rows = await getCachedCategories();
	const row = rows.find((item) => item.id === id || item.name.toLowerCase() === id.toLowerCase());
	if (!row) return null;
	return {
		id: row.id,
		name: row.name,
		description: parseRichValue(row.description),
		imageUrl: row.image_url,
		parentId: row.parent_id,
	};
}

export async function getProducts(limit = 100): Promise<ProductRecord[]> {
	const rows = await getCachedProducts();
	return rows.slice(0, limit).map((row) => ({
		id: row.id,
		name: row.name,
		imageUrl: parseJsonArray(row.image_url),
		description: parseRichValue(row.description),
		shortDescription: parseRichValue(row.short_description),
		badges: parseJsonArray(row.badges),
		categoryId: parseJsonArray(row.category_id),
	}));
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
	const rows = await getCachedProducts();
	const row = rows.find((item) => item.id === id || item.name.toLowerCase() === id.toLowerCase());
	if (!row) return null;
	return {
		id: row.id,
		name: row.name,
		imageUrl: parseJsonArray(row.image_url),
		description: parseRichValue(row.description),
		shortDescription: parseRichValue(row.short_description),
		badges: parseJsonArray(row.badges),
		categoryId: parseJsonArray(row.category_id),
	};
}

export async function getProductsByCategoryId(categoryId: string, limit = 100): Promise<ProductRecord[]> {
	const products = await getProducts(1000);
	return products.filter((product) => product.categoryId.includes(categoryId)).slice(0, limit);
}
