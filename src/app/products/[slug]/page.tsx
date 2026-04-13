import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductHero from '@/components/product/product-hero';
import InfiniteMarquee from '@/components/shared/infinite-marquee';
import { getCategories, getCategoryById, getProductById, getProductsByCategoryId } from '@/lib/d1';
import { siteUrl } from '@/lib/site';
import { getPrimaryImage } from '@/lib/product-media';
import { richContentToPlainText } from '@/lib/rich-content';
import RichContent from '@/components/shared/rich-content';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductById(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  const category = await getCategoryById(product.categoryId[0] ?? '');
  const productImage = getPrimaryImage(product) || category?.imageUrl || '';

  return {
    title: product.name,
    description: richContentToPlainText(product.shortDescription) || richContentToPlainText(product.description),
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Prime Prints`,
      description: richContentToPlainText(product.shortDescription) || richContentToPlainText(product.description),
      url: `/products/${product.id}`,
      images: [{ url: productImage, alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Prime Prints`,
      description: richContentToPlainText(product.shortDescription) || richContentToPlainText(product.description),
      images: [productImage],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProductById(slug);
  if (!product) {
    notFound();
  }

  const category = await getCategoryById(product.categoryId[0] ?? '');
  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductsByCategoryId(category.id, 24);
  const related = categoryProducts.filter((item) => item.id !== product.id).slice(0, 3);
  const allCategories = await getCategories();

  const otherCategoryProductsNested = await Promise.all(
    allCategories
      .filter((cat) => cat.id !== category.id)
      .map(async (cat) => {
        const products = await getProductsByCategoryId(cat.id, 2);
        return products.map((item) => ({ ...item, categoryName: cat.name }));
      })
  );
  const otherCategoryProducts = otherCategoryProductsNested.flat().slice(0, 6);

  const primaryImage = getPrimaryImage(product) || category.imageUrl;
  const relatedImages = related.map((item) => getPrimaryImage(item)).filter(Boolean);
  const galleryImages = Array.from(new Set([primaryImage, ...product.imageUrl, ...relatedImages])).filter(Boolean).slice(0, 6);
  const categoryNames = allCategories.map((cat) => cat.name);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: richContentToPlainText(product.shortDescription) || richContentToPlainText(product.description),
    category: category.name,
    image: galleryImages.length > 0 ? galleryImages : [primaryImage],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Prime Prints',
    },
    url: `${siteUrl}/products/${product.id}`,
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <div className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/categories/${category.id}`} className="sans flex items-center gap-2 text-sm font-500 text-stone-600 transition-colors hover:text-stone-900">
            Back to {category.name}
          </Link>
          <span className="rounded-lg bg-stone-100 px-3 py-1 text-xs font-600 uppercase tracking-wider text-stone-700">{category.name}</span>
        </div>
      </div>

      <div>
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <ProductHero
            product={product}
            category={{ id: category.id, name: category.name, imageUrl: category.imageUrl }}
            primaryImage={primaryImage}
            relatedImages={relatedImages}
            productTitle={product.name}
            productShortDescription={richContentToPlainText(product.shortDescription) || richContentToPlainText(product.description)}
          />
        </div>

        <div className="mt-10">
          <InfiniteMarquee bottomItems={categoryNames} />
        </div>

        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
            <h2 className="serif mb-4 text-2xl font-black text-stone-900">More Details</h2>
            <RichContent content={product.description} textClassName="sans text-base leading-relaxed text-stone-600" />
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-stone-200 pt-12">
              <div className="mb-10 flex items-center gap-4">
                <h2 className="serif text-3xl font-black text-stone-900">You Might Also Like</h2>
                <div className="h-px flex-1 bg-linear-to-r from-stone-200 to-transparent" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/products/${rel.id}`} className="group block">
                    <div className="group cursor-pointer">
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-stone-200">
                        <Image
                          src={getPrimaryImage(rel) || category.imageUrl}
                          alt={rel.name}
                          width={800}
                          height={800}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="serif text-xl font-bold leading-tight text-stone-900 transition-colors group-hover:text-stone-700">{rel.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {otherCategoryProducts.length > 0 && (
            <div className="mt-16 border-t border-stone-200 pt-12">
              <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="sans mb-2 text-xs font-700 uppercase tracking-[0.2em] text-cyan-600">Discover More</p>
                  <h2 className="serif text-3xl font-black text-slate-900">Explore Products From Other Categories</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherCategoryProducts.map((item) => (
                  <Link key={item.id} href={`/products/${item.id}`} className="group block">
                    <div className="group cursor-pointer">
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-stone-200">
                        <Image
                          src={getPrimaryImage(item) || category.imageUrl}
                          alt={item.name}
                          width={800}
                          height={800}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                        <span className="sans absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-700 backdrop-blur">
                          {item.categoryName}
                        </span>
                      </div>
                      <h3 className="serif text-xl font-bold leading-tight text-stone-900 transition-colors group-hover:text-stone-700">{item.name}</h3>
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
