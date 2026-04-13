import { NextResponse } from 'next/server';
import config from '@payload-config';
import { getPayload } from 'payload';

import { demoCategories, demoProducts } from '@/payload/demo-data';
import { seedPayloadContent } from '@/payload/seed';

export async function POST() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      ok: true,
      mode: 'demo-fallback',
      categories: demoCategories.length,
      products: demoProducts.length,
    });
  }

  const payload = await getPayload({ config });

  await seedPayloadContent(payload);

  const [categories, products] = await Promise.all([
    payload.find({ collection: 'categories', limit: 1000 }),
    payload.find({ collection: 'products', limit: 1000 }),
  ]);

  return NextResponse.json({
    ok: true,
    categories: categories.docs.length,
    products: products.docs.length,
  });
}