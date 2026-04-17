import { unstable_cache } from 'next/cache';

import {
  createAdminFaq,
  deleteAdminFaq,
  getAdminFaqs,
  getFaqs as getFaqsRaw,
  updateAdminFaq,
} from '@/lib/mongo-catalog';

export const getFaqs = unstable_cache(async (limit = 50) => getFaqsRaw(limit), ['faqs'], {
  revalidate: 3600,
  tags: ['faqs'],
});

export {
  createAdminFaq,
  deleteAdminFaq,
  getAdminFaqs,
  updateAdminFaq,
};
