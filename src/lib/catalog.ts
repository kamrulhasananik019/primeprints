import { getCategories, getProductsByCategory2, getProductsWithDetails } from '@/lib/d1';

export type CatalogCategory = Awaited<ReturnType<typeof getCategories>>[number];
export type CatalogProduct = Awaited<ReturnType<typeof getProductsWithDetails>>[number];

export { getPrimaryImage } from '@/lib/product-media';

export type CategoryWithProducts = CatalogCategory & {
  products: CatalogProduct[];
};

export type NavProduct = Pick<CatalogProduct, 'id' | 'slug' | 'name'>;

export type NavCategory = CatalogCategory & {
  products: NavProduct[];
};

export async function getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  const categories = await getCategories();

  return Promise.all(
    categories.map(async (category) => ({
      ...category,
      products: await getProductsByCategory2(category.slug, 1000),
    }))
  );
}

export async function getNavCategories(): Promise<NavCategory[]> {
  const categories = await getCategories();

  return Promise.all(
    categories.map(async (category) => {
      const products = await getProductsByCategory2(category.slug, 6);
      return {
        ...category,
        products: products.map((product) => ({ id: product.id, slug: product.slug, name: product.name })),
      };
    })
  );
}

export function getProductCategoryTitleMap(
  products: CatalogProduct[],
  categories: CatalogCategory[] = []
): Record<string, string> {
  const categoryTitleBySlug = new Map(categories.map((category) => [category.slug, category.title]));
  return Object.fromEntries(
    products.map((product) => [product.id, categoryTitleBySlug.get(product.category) ?? ''])
  );
}

export async function getLatestProducts(): Promise<CatalogProduct[]> {
  const products = await getProductsWithDetails(1000);
  return products.filter((product) => product.status?.toLowerCase().includes('latest'));
}

export async function getSameDayPrinting(): Promise<CatalogProduct[]> {
  const products = await getProductsWithDetails(1000);
  return products.filter((product) => product.status?.toLowerCase().includes('samedayprinting'));
}

export async function getSeasonalFavorites(): Promise<CatalogProduct[]> {
  const products = await getProductsWithDetails(1000);
  return products.filter((product) => product.status?.toLowerCase().includes('seasonal'));
}

export async function getDeliveryMarketing(): Promise<CatalogProduct[]> {
  const products = await getProductsWithDetails(1000);
  return products.filter((product) => product.status?.toLowerCase().includes('deliverymarketing'));
}

export async function getRelatedProducts(productId: string, limit = 3): Promise<CatalogProduct[]> {
  const products = await getProductsWithDetails(1000);
  const current = products.find((product) => product.id === productId);
  if (!current) {
    return [];
  }

  return products
    .filter((product) => product.category === current.category && product.id !== productId)
    .slice(0, limit);
}
