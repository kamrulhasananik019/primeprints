import { allProducts } from '../data/products';
import type { Product } from '../data/products';

export function getProductsByCategory(categorySlug: string): Product[] {
  return allProducts.filter((product) => product.category === categorySlug);
}
