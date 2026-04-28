import { unstable_cache } from 'next/cache';

import { CATALOG_TAGGED_DATA_REVALIDATE } from '@/lib/catalog-cache-policy';
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

function isCatalogUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('missing mongodb_uri') ||
    message.includes('econnrefused') ||
    message.includes('querysrv') ||
    message.includes('server selection timed out')
  );
}

const PRODUCTS_LIST_TAG = 'products-list';
const productTag = (id: string) => `product-${id}`;

const getProductsCached = unstable_cache(async (limit = 100) => {
  try {
    return await getProductsRaw(limit);
  } catch (error) {
    if (isCatalogUnavailableError(error)) {
      return [];
    }
    throw error;
  }
}, ['products-list'], {
  revalidate: CATALOG_TAGGED_DATA_REVALIDATE,
  tags: [PRODUCTS_LIST_TAG],
});

export async function getProducts(limit = 100) {
  // Avoid Next.js data-cache 2MB item limit for very large product lists.
  if (limit > 200) {
    try {
      return await getProductsRaw(limit);
    } catch (error) {
      if (isCatalogUnavailableError(error)) {
        return [];
      }
      throw error;
    }
  }

  return getProductsCached(limit);
}

export function getProductById(id: string) {
  return unstable_cache(
    async () => {
      try {
        return await getProductByIdRaw(id);
      } catch (error) {
        if (isCatalogUnavailableError(error)) {
          return null;
        }
        throw error;
      }
    },
    ['product-by-id', id],
    {
      revalidate: CATALOG_TAGGED_DATA_REVALIDATE,
      tags: [productTag(id)],
    }
  )();
}

export function getProductsByCategoryId(categoryId: string, limit = 100) {
  return unstable_cache(
    async () => {
      try {
        return await getProductsByCategoryIdRaw(categoryId, limit);
      } catch (error) {
        if (isCatalogUnavailableError(error)) {
          return [];
        }
        throw error;
      }
    },
    ['products-by-category', categoryId, String(limit)],
    {
      revalidate: CATALOG_TAGGED_DATA_REVALIDATE,
      tags: [PRODUCTS_LIST_TAG, `category-${categoryId}`],
    }
  )();
}

export function getRelatedProducts(productId: string, limit = 3) {
  return unstable_cache(
    async () => {
      try {
        return await getRelatedProductsRaw(productId, limit);
      } catch (error) {
        if (isCatalogUnavailableError(error)) {
          return [];
        }
        throw error;
      }
    },
    ['related-products', productId, String(limit)],
    {
      revalidate: CATALOG_TAGGED_DATA_REVALIDATE,
      tags: [productTag(productId)],
    }
  )();
}

export const getSameDayPrinting = unstable_cache(
  async () => {
    try {
      return await getSameDayPrintingRaw();
    } catch (error) {
      if (isCatalogUnavailableError(error)) {
        return [];
      }
      throw error;
    }
  },
  ['same-day-printing'],
  {
    revalidate: CATALOG_TAGGED_DATA_REVALIDATE,
    tags: [PRODUCTS_LIST_TAG],
  }
);

export {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  getLatestProducts,
  getProductCategoryTitleMap,
  resolveCategoryIds,
  updateAdminProduct,
};
