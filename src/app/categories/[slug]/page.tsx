import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RichContent from '@/components/shared/rich-content';
import { getCategories, getCategoryBySlug, getProductsByCategory2 } from '@/lib/d1';
import InfiniteMarquee from '@/components/shared/infinite-marquee';
import { isSameRichContent, richContentToPlainText } from '@/lib/rich-content';

export const revalidate = 300;

function getPrimaryImage(product: { images: Array<{ url: string; isPrimary?: boolean }> }): string {
  const primary = product.images.find((img) => img.isPrimary);
  return primary?.url ?? product.images[0]?.url ?? '';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: category.title,
    description: richContentToPlainText(category.description),
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.title} | Prime Prints`,
      description: richContentToPlainText(category.description),
      url: `/categories/${category.slug}`,
      images: [{ url: category.image, alt: category.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.title} | Prime Prints`,
      description: richContentToPlainText(category.description),
      images: [category.image],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory2(category.slug, 200);
  const categories = await getCategories();

  const categoryShortDescription = category.description;
  const categoryLongDescription = category.description;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900">
            <span>←</span> Back to Home
          </Link>
          <span className="rounded-lg bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-700">
            {category.tag}
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-stone-200/70 bg-white">
        <div className="absolute -right-28 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: `${category.accent}30` }} />
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]"
                style={{ backgroundColor: `${category.accent}20`, color: category.accent }}
              >
                {category.tag}
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
                {category.title}
              </h1>
              <RichContent
                content={categoryShortDescription}
                wrapperClassName="mt-4 max-w-xl space-y-3"
                textClassName="text-base leading-relaxed text-stone-600"
                listClassName="list-disc pl-5 text-base leading-relaxed text-stone-600 space-y-1"
              />
              <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-stone-500">
                {products.length} products available
              </p>
              <div className="mt-6">
                <Link
                  href={`/contact?category=${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Get Quote
                </Link>
              </div>
            </div>
            <div className="aspect-16/11 overflow-hidden rounded-3xl bg-stone-200 shadow-2xl shadow-stone-300/40">
              <Image
                src={category.image}
                alt={category.title}
                width={1200}
                height={825}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div >
        <InfiniteMarquee bottomItems={categories.map((cat) => cat.title)} />
      </div>

      {!isSameRichContent(categoryLongDescription, categoryShortDescription) && (
        <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">More Details</h2>
            <RichContent
              content={categoryLongDescription}
              wrapperClassName="space-y-3"
              textClassName="text-base leading-relaxed text-stone-600"
              listClassName="list-disc pl-5 text-base leading-relaxed text-stone-600 space-y-1"
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        {products.length > 0 && (
          <div>
            <h2 className="mb-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
              Products in {category.title}
            </h2>
            <p className="mb-8 text-sm text-stone-500">Click any product to view full details and image gallery.</p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <div className="group cursor-pointer rounded-3xl border border-stone-200 bg-white p-3 transition hover:border-stone-300 hover:shadow-md">
                    <div className="relative mb-4 aspect-4/5 overflow-hidden rounded-3xl bg-stone-200">
                      <Image
                        src={getPrimaryImage(product) || category.image}
                        alt={product.name}
                        width={800}
                        height={1000}
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-800 backdrop-blur">
                        {category.tag}
                      </div>
                      <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className="text-sm font-medium text-white">View Details</span>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-stone-900">{product.name}</h3>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-stone-500">View Details</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-stone-600 text-lg">
              No products available in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}