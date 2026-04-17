import { unstable_cache } from 'next/cache';

import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  getCategories as getCategoriesRaw,
  getCategoryById as getCategoryByIdRaw,
  resolveCategoryIds,
  updateAdminCategory,
} from '@/lib/mongo-catalog';

export const getCategories = unstable_cache(async () => getCategoriesRaw(), ['categories'], {
  revalidate: 3600,
  tags: ['catalog'],
});

export const getCategoryById = unstable_cache(async (id: string) => getCategoryByIdRaw(id), ['category-by-id'], {
  revalidate: 3600,
  tags: ['catalog'],
});

export {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  resolveCategoryIds,
  updateAdminCategory,
};
