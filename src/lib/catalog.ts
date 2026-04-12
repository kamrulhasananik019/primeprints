import { categories, type Category, type Product } from '@/data/categories';
import { allProducts } from '@/data/products';

export type CategoryWithProducts = Category & {
  products: Product[];
};

export function getPrimaryImage(product: Product): string {
  const primary = product.images.find((img) => img.isPrimary);
  return primary?.url ?? product.images[0]?.url ?? '';
}

export function getCategoriesWithProducts(): CategoryWithProducts[] {
  return categories.map((category) => ({
    ...category,
    products: allProducts.filter((product) => product.category === category.slug),
  }));
}

export function getLatestProducts(): Product[] {
  return allProducts.filter((product) => product.status?.toLowerCase().includes('latest'));
}

export function getSameDayPrinting(): Product[] {
  return allProducts.filter((product) => product.status?.toLowerCase().includes('samedayprinting'));
}

export function getSeasonalFavorites(): Product[] {
  return allProducts.filter((product) => product.status?.toLowerCase().includes('seasonal'));
}

export function getRelatedProducts(productId: string, limit = 3): Product[] {
  const current = allProducts.find((product) => product.id === productId);
  if (!current) {
    return [];
  }

  return allProducts
    .filter((product) => product.category === current.category && product.id !== productId)
    .slice(0, limit);
}
