import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getCategoryById, getProductsByCategoryId } from '@/lib/d1';
import InfiniteMarquee from '@/components/shared/infinite-marquee';
import { getPrimaryImage } from '@/lib/product-media';
import RichContent from '@/components/shared/rich-content';
import { richContentToPlainText } from '@/lib/rich-content';
import { getCategoryPath, getProductPath } from '@/lib/slug';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryById(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: category.name,
    description: richContentToPlainText(category.description),
    alternates: {
      canonical: getCategoryPath(category.id, category.name),
    },
    openGraph: {
      title: `${category.name} | Prime Prints`,
      description: richContentToPlainText(category.description),
      url: getCategoryPath(category.id, category.name),
      images: [{ url: category.imageUrl, alt: category.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Prime Prints`,
      description: richContentToPlainText(category.description),
      images: [category.imageUrl],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryById(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategoryId(category.id, 200);
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900">
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-stone-200/70 bg-white">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-900 sm:text-5xl lg:text-6xl">{category.name}</h1>
              <RichContent
                content={category.description}
                wrapperClassName="mt-4 max-w-xl"
                textClassName="text-base leading-relaxed text-stone-600"
              />
              <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-stone-500">{products.length} products available</p>
              <div className="mt-6">
                <Link
                  href={`/contact?category=${category.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Get Quote
                </Link>
              </div>
            </div>
            <div className="aspect-16/11 overflow-hidden rounded-3xl bg-stone-200 shadow-2xl shadow-stone-300/40">
              <Image src={category.imageUrl} alt={category.name} width={1200} height={825} priority className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <InfiniteMarquee bottomItems={categories.map((cat) => cat.name)} />
      </div>

      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        {products.length > 0 && (
          <div>
            <h2 className="mb-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">Products in {category.name}</h2>
            <p className="mb-8 text-sm text-stone-500">Click any product to view full details and image gallery.</p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <Link key={product.id} href={getProductPath(product.id, product.name)} prefetch={false}>
                  <div className="group cursor-pointer rounded-3xl border border-stone-200 bg-white p-3 transition hover:border-stone-300 hover:shadow-md">
                    <div className="relative mb-4 aspect-4/5 overflow-hidden rounded-3xl bg-stone-200">
                      <Image
                        src={getPrimaryImage(product) || category.imageUrl}
                        alt={product.name}
                        width={800}
                        height={1000}
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className="text-sm font-medium text-white">View Details</span>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-stone-900">{product.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-lg text-stone-600">No products available in this category yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
