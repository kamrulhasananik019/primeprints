import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Layers, Package, Ruler, Star } from 'lucide-react';
import InfiniteMarquee from '@/components/shared/infinite-marquee';
import { allProducts } from '@/data/products';
import { getCategoriesWithProducts, getPrimaryImage, getRelatedProducts } from '@/lib/catalog';

export const dynamic = 'force-static';

const categories = getCategoriesWithProducts();

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let productName = '';
  let productDescription = '';
  let productImage = '';

  for (const category of categories) {
    const product = category.products.find((item) => item.slug === slug);
    if (product) {
      productName = product.name;
      productDescription = product.details || product.description;
      productImage = getPrimaryImage(product) || category.image;
      break;
    }
  }

  if (!productName) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

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
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product = null;
  let category = null;
  for (const cat of categories) {
    const found = cat.products.find((item) => item.slug === slug);
    if (found) {
      product = found;
      category = cat;
      break;
    }
  }

  if (!product || !category) {
    notFound();
  }

  const related = getRelatedProducts(product.id);
  const otherCategoryProducts = categories
    .filter((cat) => cat.id !== category.id)
    .flatMap((cat) =>
      cat.products.slice(0, 2).map((item) => ({
        ...item,
        categoryTitle: cat.title,
      }))
    )
    .slice(0, 6);

  const specIcons: Record<string, React.ReactNode> = {
    material: <Layers size={16} />,
    size: <Ruler size={16} />,
    finish: <Package size={16} />,
    turnaround: <Clock size={16} />,
  };

  const primaryImage = getPrimaryImage(product) || category.image;
  const relatedImages = related
    .map((item) => getPrimaryImage(item))
    .filter(Boolean);
  const galleryImages = Array.from(
    new Set([primaryImage, ...product.images.map((img) => img.url), ...relatedImages])
  )
    .filter(Boolean)
    .slice(0, 6);
  const categoryTitles = categories.map((cat) => cat.title);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-20 shadow-md">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <Link
            href={`/categories/${category.slug}`}
            className="sans flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors text-sm font-500"
          >
            Back to {category.title}
          </Link>
          <span className="px-3 py-1.5 rounded-lg text-xs font-600 uppercase tracking-wider">{category.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-slate-100 to-slate-50 aspect-square shadow-2xl border border-slate-200">
              <Image
                src={primaryImage}
                alt={product.name}
                width={1200}
                height={1200}
                priority
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-600 text-slate-800">4.9</span>
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-5 grid grid-cols-4 sm:grid-cols-6 gap-3">
                {galleryImages.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="aspect-square overflow-hidden rounded-xl border border-slate-200"
                    aria-label={`Product image ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} preview ${index + 1}`}
                      width={240}
                      height={240}
                      sizes="(max-width: 640px) 25vw, 12vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="sans text-cyan-600 uppercase tracking-[0.2em] text-xs font-700 mb-4">
                {category.title}
              </p>
              <h1 className="serif text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                {product.name}
              </h1>
              <p className="sans text-slate-600 text-lg leading-relaxed mb-8">
                {product.details || product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:border-cyan-400/50 hover:shadow-lg transition-all hover:bg-linear-to-br hover:from-cyan-50/50 hover:to-blue-50/50"
                  >
                    <div className="sans flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest font-600 mb-2">
                      <span className="text-cyan-600">{specIcons[key]}</span>
                      {key}
                    </div>
                    <p className="sans text-slate-900 text-sm font-600">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <Link
                  href={`/contact?category=${category.slug}&product=${product.slug}`}
                  className="sans inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-700 text-white transition hover:bg-slate-800"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        <InfiniteMarquee bottomItems={categoryTitles} />

        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-slate-200">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="serif text-3xl font-black text-slate-900">You Might Also Like</h2>
              <div className="flex-1 h-px bg-linear-to-r from-slate-200 to-transparent" />
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
                      {rel.name}
                    </h3>
                    <p className="sans mt-1 text-sm text-stone-600 line-clamp-2">
                      {rel.description}
                    </p>
                    <span className="sans mt-2 block text-xs text-stone-500 font-500">
                      {Object.values(rel.specs)[0] || 'Custom options available'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {otherCategoryProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-slate-200">
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
                      {item.name}
                    </h3>
                    <p className="sans mt-1 text-sm text-stone-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
