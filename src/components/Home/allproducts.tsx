import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/data/products';
import { getPrimaryImage } from '@/lib/catalog';

type AllProductsProps = {
  products: Product[];
  productCategoryTitles: Record<string, string>;
};

export default function AllProducts({ products, productCategoryTitles }: AllProductsProps) {

  return (
    <section className="container mx-auto min-h-screen bg-gradient-to-br from-slate-50 to-white px-4 pt-10 font-sans">
   <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className='mx-auto container'>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
              Professional Print
            </span>

            <h2 className="font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Latest Products

            </h2>
          </div>
        </div>

      <div className=" py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const categoryTitle = productCategoryTitles[product.id];

            return (
             <Link key={product.id} href={`/products/${product.slug}`}>
  <div className="group cursor-pointer">
    <div className="relative mb-4 aspect-[3/3] overflow-hidden rounded-3xl bg-stone-200">
      <Image
        src={getPrimaryImage(product)}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />

      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-700 backdrop-blur">
        Latest
      </div>

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-stone-900/40 to-transparent p-6 opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="text-xs font-medium uppercase tracking-widest text-white">
          View Details
        </span>
      </div>
    </div>

    <h3 className="font-serif text-lg font-semibold text-stone-900">
      {product.name}
    </h3>
    <p className="mt-1 text-sm text-stone-500">
      {categoryTitle}
    </p>
  </div>
</Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🖨️</p>
            <p className="text-slate-400 text-lg">No products in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}