import ReviewsPanel from '@/components/reviews/reviews-panel';
import { getApprovedReviews } from '@/lib/mongo-catalog';

export default async function Reviews() {
  const reviews = await getApprovedReviews(24);
  return <ReviewsPanel initialReviews={reviews} />;
}
