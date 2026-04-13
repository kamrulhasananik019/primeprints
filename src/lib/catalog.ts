import { getCategories, getProducts, getProductsByCategoryId } from '@/lib/d1';

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

export async function getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  const categories = await getCategories();

  return Promise.all(
    categories.map(async (category) => ({
      ...category,
      products: await getProductsByCategoryId(category.id, 1000),
    }))
  );
}

export async function getNavCategories(): Promise<NavCategory[]> {
  const categories = await getCategories();

  return Promise.all(
    categories.map(async (category) => {
      const products = await getProductsByCategoryId(category.id, 6);
      return {
        ...category,
        products: products.map((product) => ({ id: product.id, name: product.name })),
      };
    })
  );
}

export function getProductCategoryTitleMap(
  products: CatalogProduct[],
  categories: CatalogCategory[] = []
): Record<string, string> {
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
  return Object.fromEntries(
    products.map((product) => [product.id, categoryNameById.get(product.categoryId[0] ?? '') ?? ''])
  );
}

export async function getLatestProducts(): Promise<CatalogProduct[]> {
  const products = await getProducts(1000);
  return products.filter((product) => product.badges.some((badge) => badge.toLowerCase() === 'latest'));
}

export async function getSameDayPrinting(): Promise<CatalogProduct[]> {
  const products = await getProducts(1000);
  return products.filter((product) => product.badges.some((badge) => badge.toLowerCase() === 'samedayprinting'));
}

export async function getSeasonalFavorites(): Promise<CatalogProduct[]> {
  const products = await getProducts(1000);
  return products.filter((product) => product.badges.some((badge) => badge.toLowerCase() === 'seasonal'));
}

export async function getDeliveryMarketing(): Promise<CatalogProduct[]> {
  const products = await getProducts(1000);
  return products.filter((product) => product.badges.some((badge) => badge.toLowerCase() === 'deliverymarketing'));
}

export async function getRelatedProducts(productId: string, limit = 3): Promise<CatalogProduct[]> {
  const products = await getProducts(1000);
  const current = products.find((product) => product.id === productId);
  if (!current) {
    return [];
  }

  return products
    .filter((product) => product.categoryId.some((id) => current.categoryId.includes(id)) && product.id !== productId)
    .slice(0, limit);
}
