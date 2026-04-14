import { getCategories, getProducts } from '@/lib/mongo-catalog';
import { unstable_cache } from 'next/cache';

export type CatalogCategory = Awaited<ReturnType<typeof getCategories>>[number];
export type CatalogProduct = Awaited<ReturnType<typeof getProducts>>[number];

export { getPrimaryImage } from '@/lib/product-media';

export type CategoryWithProducts = CatalogCategory & {
  products: CatalogProduct[];
};

export type NavProduct = Pick<CatalogProduct, 'id' | 'name'>;

export type NavCategory = CatalogCategory & {
  products: NavProduct[];
};

const getCatalogSnapshot = unstable_cache(
  async () => {
    const [categories, products] = await Promise.all([getCategories(), getProducts(1000)]);
    return { categories, products };
  },
  ['catalog-snapshot'],
  { revalidate: 300, tags: ['catalog'] }
);

function isMissingMongoUriError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Missing MONGODB_URI');
}

async function getSafeCatalogSnapshot() {
  if (!process.env.MONGODB_URI) {
    return { categories: [], products: [] };
  }

  try {
    return await getCatalogSnapshot();
  } catch (error) {
    if (isMissingMongoUriError(error)) {
      return { categories: [], products: [] };
    }
    throw error;
  }
}

export async function getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  const { categories, products } = await getSafeCatalogSnapshot();

  return categories.map((category) => ({
      ...category,
      products: products.filter((product) => product.categoryIds.includes(category.id)),
    }));
}

export async function getNavCategories(): Promise<NavCategory[]> {
  const { categories, products } = await getSafeCatalogSnapshot();

  return categories.map((category) => {
      const categoryProducts = products.filter((product) => product.categoryIds.includes(category.id)).slice(0, 6);
      return {
        ...category,
        products: categoryProducts.map((product) => ({ id: product.id, name: product.name })),
      };
    });
}

export function getProductCategoryTitleMap(
  products: CatalogProduct[],
  categories: CatalogCategory[] = []
): Record<string, string> {
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
  return Object.fromEntries(
    products.map((product) => [product.id, categoryNameById.get(product.categoryIds[0] ?? '') ?? ''])
  );
}

export async function getLatestProducts(): Promise<CatalogProduct[]> {
  const { products } = await getSafeCatalogSnapshot();
  return products.filter((product) => product.badges.some((badge) => badge.toLowerCase() === 'latest'));
}

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const { categories } = await getSafeCatalogSnapshot();
  return categories;
}

export async function getCatalogProducts(limit = 1000): Promise<CatalogProduct[]> {
  const { products } = await getSafeCatalogSnapshot();
  return products.slice(0, limit);
}

export async function getSameDayPrinting(): Promise<CatalogProduct[]> {
  const { products } = await getSafeCatalogSnapshot();
  return products.filter((product) => product.badges.some((badge) => badge.toLowerCase() === 'samedayprinting'));
}

export async function getSeasonalFavorites(): Promise<CatalogProduct[]> {
  const { products } = await getSafeCatalogSnapshot();
  return products.filter((product) => product.badges.some((badge) => badge.toLowerCase() === 'seasonal'));
}

export async function getDeliveryMarketing(): Promise<CatalogProduct[]> {
  const { products } = await getSafeCatalogSnapshot();
  return products.filter((product) => product.badges.some((badge) => badge.toLowerCase() === 'deliverymarketing'));
}

export async function getRelatedProducts(productId: string, limit = 3): Promise<CatalogProduct[]> {
  const { products } = await getSafeCatalogSnapshot();
  const current = products.find((product) => product.id === productId);
  if (!current) {
    return [];
  }

  return products
    .filter((product) => product.categoryIds.some((id) => current.categoryIds.includes(id)) && product.id !== productId)
    .slice(0, limit);
}
