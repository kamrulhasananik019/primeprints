import { allProducts } from '../data/products';
import type { Product } from '../data/products';

export function getProductBySlug(slug: string): Product | null {
  return allProducts.find((product) => product.slug === slug) ?? null;
}
