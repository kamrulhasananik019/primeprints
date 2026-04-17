import { unstable_cache } from 'next/cache';

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  getProductById as getProductByIdRaw,
  getProducts as getProductsRaw,
  getProductsByCategoryId as getProductsByCategoryIdRaw,
  resolveCategoryIds,
  updateAdminProduct,
} from '@/lib/mongo-catalog';
import {
  getLatestProducts,
  getProductCategoryTitleMap,
  getRelatedProducts as getRelatedProductsRaw,
  getSameDayPrinting as getSameDayPrintingRaw,
} from '@/lib/catalog';

export const getProducts = unstable_cache(async (limit = 100) => getProductsRaw(limit), ['products'], {
  revalidate: 3600,
  tags: ['catalog'],
});

export const getProductById = unstable_cache(async (id: string) => getProductByIdRaw(id), ['product-by-id'], {
  revalidate: 3600,
  tags: ['catalog'],
});

export const getProductsByCategoryId = unstable_cache(
  async (categoryId: string, limit = 100) => getProductsByCategoryIdRaw(categoryId, limit),
  ['products-by-category'],
  { revalidate: 3600, tags: ['catalog'] }
);

export const getRelatedProducts = unstable_cache(
  async (productId: string, limit = 3) => getRelatedProductsRaw(productId, limit),
  ['related-products'],
  { revalidate: 3600, tags: ['catalog'] }
);

export const getSameDayPrinting = unstable_cache(async () => getSameDayPrintingRaw(), ['same-day-printing'], {
  revalidate: 3600,
  tags: ['catalog'],
});

export {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  getLatestProducts,
  getProductCategoryTitleMap,
  resolveCategoryIds,
  updateAdminProduct,
};
