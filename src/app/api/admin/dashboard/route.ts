import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-api';
import { getAdminCategories, getAdminFaqs, getAdminProducts, getAdminReviews } from '@/lib/mongo-catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireAdminSession();
    const [categories, products, reviews, faqs] = await Promise.all([
      getAdminCategories(),
      getAdminProducts(),
      getAdminReviews(),
      getAdminFaqs(),
    ]);
    return NextResponse.json({ ok: true, categories, products, reviews, faqs }, { headers: { 'Cache-Control': 'no-store, private, max-age=0' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status, headers: { 'Cache-Control': 'no-store, private, max-age=0' } });
  }
}