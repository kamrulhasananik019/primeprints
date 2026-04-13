import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RichContent from '@/components/shared/rich-content';
import ProductHero from '@/components/product/product-hero';
import InfiniteMarquee from '@/components/shared/infinite-marquee';
import { getCategories, getCategoryBySlug, getProductWithDetailsBySlug, getProductsByCategory2 } from '@/lib/d1';
import { extractFAQsFromRichContent, isSameRichContent, richContentToPlainText } from '@/lib/rich-content';
import { siteUrl } from '@/lib/site';

export const revalidate = 300;

function getPrimaryImage(product: { images: Array<{ url: string; isPrimary?: boolean }> }): string {
  const primary = product.images.find((img) => img.isPrimary);
  return primary?.url ?? product.images[0]?.url ?? '';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductWithDetailsBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  const category = await getCategoryBySlug(product.category);
  const productName = product.title || product.name;
  const productDescription = richContentToPlainText(
    product.shortDescription || product.longDescription || product.details || product.description
  );
  const productImage = getPrimaryImage(product) || category?.image || '';

  return {
    title: productName,
    description: productDescription,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: `${productName} | Prime Prints`,
      description: productDescription,
      url: `/products/${slug}`,
      images: [{ url: productImage, alt: productName }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | Prime Prints`,
      description: productDescription,
      images: [productImage],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProductWithDetailsBySlug(slug);
  if (!product) {
    notFound();
  }

  const category = await getCategoryBySlug(product.category);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory2(category.slug, 24);
  const related = categoryProducts.filter((item) => item.id !== product.id).slice(0, 3);
  const allCategories = await getCategories();

  const otherCategoryProductsNested = await Promise.all(
    allCategories
      .filter((cat) => cat.slug !== category.slug)
      .map(async (cat) => {
        const products = await getProductsByCategory2(cat.slug, 2);
        return products.map((item) => ({ ...item, categoryTitle: cat.title }));
      })
  );
  const otherCategoryProducts = otherCategoryProductsNested.flat().slice(0, 6);

  const primaryImage = getPrimaryImage(product) || category.image;
  const productTitle = product.title || product.name;
  const productShortDescription = product.shortDescription || product.description;
  const productLongDescription = product.longDescription || product.details || product.description;
  const relatedImages = related
    .map((item) => getPrimaryImage(item))
    .filter(Boolean);
  const galleryImages = Array.from(
    new Set([primaryImage, ...product.images.map((img) => img.url), ...relatedImages])
  )
    .filter(Boolean)
    .slice(0, 6);
  const faqItems = extractFAQsFromRichContent(productLongDescription);
  const categoryTitles = allCategories.map((cat) => cat.title);
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productTitle,
    description: richContentToPlainText(productLongDescription),
    category: category.title,
    image: galleryImages.length > 0 ? galleryImages : [primaryImage],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Prime Prints',
    },
    url: `${siteUrl}/products/${product.slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/contact?category=${category.slug}&product=${product.slug}`,
    },
  };
  const faqJsonLd = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-stone-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href={`/categories/${category.slug}`}
            className="sans flex items-center gap-2 text-sm font-500 text-stone-600 transition-colors hover:text-stone-900"
          >
            Back to {category.title}
          </Link>
          <span className="rounded-lg bg-stone-100 px-3 py-1 text-xs font-600 uppercase tracking-wider text-stone-700">
            {category.title}
          </span>
        </div>
      </div>

      <div >
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <ProductHero
          product={product}
          category={{ title: category.title, slug: category.slug, image: category.image }}
          primaryImage={primaryImage}
          relatedImages={relatedImages}
          productTitle={productTitle}
          productShortDescription={productShortDescription}
        />
      </div>

        <div className="mt-10">
          <InfiniteMarquee bottomItems={categoryTitles} />
        </div>

<div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-14" >
          {!isSameRichContent(productLongDescription, productShortDescription) && (
          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
            <h2 className="serif mb-4 text-2xl font-black text-stone-900">More Details</h2>
            <RichContent
              content={productLongDescription}
              wrapperClassName="space-y-4"
              textClassName="sans text-base leading-relaxed text-stone-600"
              listClassName="list-disc pl-5 text-base leading-relaxed text-stone-600 space-y-1"
              listItemClassName="sans"
            />
          </div>
        )}

        {faqItems.length > 0 && (
          <div className="mt-16 rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
            <h2 className="serif mb-6 text-2xl font-black text-stone-900">FAQ</h2>
            <div className="space-y-3">
              {faqItems.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
                >
                  <summary className="sans cursor-pointer list-none pr-6 text-sm font-700 text-stone-900">
                    {faq.question}
                  </summary>
                  <p className="sans mt-3 text-sm leading-relaxed text-stone-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16 border-t border-stone-200 pt-12">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="serif text-3xl font-black text-stone-900">You Might Also Like</h2>
              <div className="h-px flex-1 bg-linear-to-r from-stone-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.id} href={`/products/${rel.slug}`} className="group block">
                  <div className="group cursor-pointer">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-stone-200">
                      <Image
                        src={getPrimaryImage(rel) || category.image}
                        alt={rel.name}
                        width={800}
                        height={800}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <span className="sans absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-700 backdrop-blur">
                        {category.title}
                      </span>
                    </div>
                    <h3 className="serif text-xl font-bold text-stone-900 leading-tight transition-colors group-hover:text-stone-700">
                      {rel.title || rel.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {otherCategoryProducts.length > 0 && (
          <div className="mt-16 border-t border-stone-200 pt-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
              <div>
                <p className="sans text-cyan-600 uppercase tracking-[0.2em] text-xs font-700 mb-2">
                  Discover More
                </p>
                <h2 className="serif text-3xl font-black text-slate-900">
                  Explore Products From Other Categories
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCategoryProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.slug}`} className="group block">
                  <div className="group cursor-pointer">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-stone-200">
                      <Image
                        src={getPrimaryImage(item) || category.image}
                        alt={item.name}
                        width={800}
                        height={800}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <span className="sans absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-700 backdrop-blur">
                        {item.categoryTitle}
                      </span>
                    </div>
                    <h3 className="serif text-xl font-bold text-stone-900 leading-tight transition-colors group-hover:text-stone-700">
                      {item.title || item.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
</div>
      </div>
    </div>
  );
}
