import { unstable_cache } from 'next/cache';

import {
  createAdminReview,
  createPublicReview,
  deleteAdminReview,
  getAdminReviews,
  getApprovedReviews as getApprovedReviewsRaw,
  setAdminReviewStatus,
  updateAdminReview,
  type ReviewStatus,
} from '@/lib/mongo-catalog';

export const getApprovedReviews = unstable_cache(async (limit = 50) => getApprovedReviewsRaw(limit), ['approved-reviews'], {
  revalidate: 3600,
  tags: ['reviews'],
});

export {
  createAdminReview,
  createPublicReview,
  deleteAdminReview,
  getAdminReviews,
  setAdminReviewStatus,
  updateAdminReview,
  type ReviewStatus,
};
