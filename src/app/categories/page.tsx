import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getNavCategories } from '@/lib/catalog';
import { getCategoryPath } from '@/lib/slug';
import { getSafeImageSrc } from '@/lib/image-url';
import { richContentToPlainText } from '@/lib/rich-content';
import { siteUrl } from '@/lib/site';

export const revalidate = 604800;

export const metadata: Metadata = {
  title: 'All Categories | Prime Prints',
  description: 'Explore every print category at Prime Prints and open a category page to see the products inside it.',
  alternates: {
    canonical: '/categories',
  },
  openGraph: {
    title: 'All Categories | Prime Prints',
    description: 'Explore every print category and jump into the matching product lists.',
    url: '/categories',
    siteName: 'Prime Prints',
    type: 'website',
  },
};

export default async function CategoriesIndexPage() {
  const categories = await getNavCategories();

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Categories',
    url: `${siteUrl}/categories`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: category.name,
        url: `${siteUrl}${getCategoryPath(category.id, category.name)}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

      <section className="border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Category Library</p>
            <h1 className="mt-4 font-serif text-4xl font-black leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Browse every category in the catalogue.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Each category page shows the products inside it, so customers can jump from browsing to quoting in one step.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">{categories.length} categories</span>
              <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
                {categories.reduce((total, category) => total + category.products.length, 0)} products
              </span>
              <Link href="/products" prefetch={false} className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800">
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const imageSrc = getSafeImageSrc(category.image.url);
            const productCount = category.products.length;
            const summary = richContentToPlainText(category.shortDescription) || richContentToPlainText(category.description);

            return (
              <Link key={category.id} href={getCategoryPath(category.id, category.name)} prefetch={false} className="group block">
                <article className="h-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg">
                  <div className="relative aspect-16/11 overflow-hidden bg-stone-100">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={category.image.alt || category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-medium text-stone-500">No image</div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-serif text-2xl font-bold text-stone-900">{category.name}</h2>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone-700">
                        {productCount} items
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">
                      {summary || 'Open the category page to see the products inside this collection.'}
                    </p>

                    <div className="mt-5 text-sm font-semibold text-[#1B3C53]">View category</div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}