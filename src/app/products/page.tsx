import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/services/product.service';
import { getProductPath } from '@/lib/slug';
import { getPrimaryImage } from '@/lib/product-media';
import { getSafeImageSrc } from '@/lib/image-url';
import { richContentToPlainText } from '@/lib/rich-content';
import { siteUrl } from '@/lib/site';

export const revalidate = 604800;

export const metadata: Metadata = {
  title: 'All Products | Prime Prints',
  description:
    'Browse the full Prime Prints product range, from business cards and flyers to banners, posters, and custom print work.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'All Products | Prime Prints',
    description: 'Browse the full Prime Prints product range and jump into any product detail page.',
    url: '/products',
    siteName: 'Prime Prints',
    type: 'website',
  },
};

export default async function ProductsIndexPage() {
  const products = await getProducts(1000);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Products',
    url: `${siteUrl}/products`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `${siteUrl}${getProductPath(product.id, product.name, product.slug)}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

      <section className="border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Product Library</p>
            <h1 className="mt-4 font-serif text-4xl font-black leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Browse every product in the catalogue.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Use this page to jump straight to any product detail page, then compare related print options by category.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">{products.length} products</span>
              <Link href="/categories" prefetch={false} className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800">
                Browse categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const imageSrc = getSafeImageSrc(getPrimaryImage(product));
            const description = richContentToPlainText(product.shortDescription) || richContentToPlainText(product.description);
            const label = product.badges[0] || 'Product';

            return (
              <Link key={product.id} href={getProductPath(product.id, product.name, product.slug)} prefetch={false} className="group block">
                <article className="h-full overflow-hidden rounded-3xl border border-stone-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg">
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-stone-100">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-medium text-stone-500">No image</div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-[#1B3C53] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                      {label}
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="font-serif text-xl font-bold text-stone-900">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
                      {description || 'Open the product page for details, images, and quote options.'}
                    </p>
                    <div className="mt-4 text-sm font-semibold text-[#1B3C53]">View product</div>
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