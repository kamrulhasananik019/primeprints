import { NextResponse } from 'next/server';
import { getCategories, getCategoryBySlug } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const category = await getCategoryBySlug(slug);
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(category);
    }

    const categories = await getCategories();
    return NextResponse.json(categories);
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
