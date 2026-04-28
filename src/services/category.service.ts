import { unstable_cache } from 'next/cache';

import { CATALOG_TAGGED_DATA_REVALIDATE } from '@/lib/catalog-cache-policy';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  getCategories as getCategoriesRaw,
  getCategoryById as getCategoryByIdRaw,
  resolveCategoryIds,
  updateAdminCategory,
} from '@/lib/mongo-catalog';

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

export const getCategories = unstable_cache(async () => {
  try {
    return await getCategoriesRaw();
  } catch (error) {
    if (isCatalogUnavailableError(error)) {
      return [];
    }
    throw error;
  }
}, ['categories-list'], {
  revalidate: CATALOG_TAGGED_DATA_REVALIDATE,
  tags: ['categories-list'],
});

export function getCategoryById(id: string) {
  return unstable_cache(
    async () => {
      try {
        return await getCategoryByIdRaw(id);
      } catch (error) {
        if (isCatalogUnavailableError(error)) {
          return null;
        }
        throw error;
      }
    },
    ['category-by-id', id],
    {
      revalidate: CATALOG_TAGGED_DATA_REVALIDATE,
      tags: [`category-${id}`],
    }
  )();
}

export {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  resolveCategoryIds,
  updateAdminCategory,
};
