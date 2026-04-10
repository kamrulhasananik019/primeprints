import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories, getPrimaryImage } from '@/utils/data';
import InfiniteMarquee from '@/components/shared/infinite-marquee';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find(cat => cat.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-white">
      <div className="relative overflow-hidden border-b border-stone-200/70">
        <div className="absolute -right-28 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: `${category.accent}30` }} />
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900">
            <span>←</span> Back to Home
          </Link>
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
              <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
                {category.description}
              </p>
              <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-stone-500">
                {category.products.length} products available
              </p>
            </div>
            <div className="aspect-[16/11] overflow-hidden rounded-3xl bg-stone-200 shadow-2xl shadow-stone-300/40">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <InfiniteMarquee bottomItems={categories.map((cat) => cat.title)} />

      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        {category.products.length > 0 && (
          <div>
            <h2 className="mb-8 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
              Products in {category.title}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {category.products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200">
                      <img
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-800 backdrop-blur">
                        {category.tag}
                      </div>
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className="text-sm font-medium text-white">View Details</span>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-stone-900">{product.name}</h3>
                    <p className="mt-1 text-sm text-stone-500 line-clamp-2">{product.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {category.products.length === 0 && (
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