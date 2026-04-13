import { NextResponse } from 'next/server';
import { getProductWithDetailsBySlug, getProductsWithDetails, getProductsByCategory2 } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '1000', 10);

    if (slug) {
      const product = await getProductWithDetailsBySlug(slug);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    }

    if (category) {
      const products = await getProductsByCategory2(category, limit);
      return NextResponse.json(products);
    }

    const products = await getProductsWithDetails(limit);
    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
