import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories, getPrimaryImage } from '@/utils/data';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find(cat => cat.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-block text-stone-600">
          ← Back to Home
        </Link>

        {/* Category Details */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200">
            <img
              src={category.image}
              alt={category.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="mb-4">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                style={{ backgroundColor: category.accent + '20', color: category.accent }}
              >
                {category.tag}
              </span>
            </div>

            <h1 className="font-serif text-4xl font-bold text-stone-900 mb-4">
              {category.title}
            </h1>

            <p className="text-lg text-stone-600 leading-relaxed">
              {category.description}
            </p>

            <div className="mt-8">
              <button
                className="rounded-lg px-6 py-3 font-medium text-white transition"
                style={{ backgroundColor: category.accent }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Products in this Category */}
        {category.products.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-8">
              Products in {category.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-500">
                          {product.specs.turnaround}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {category.products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-600 text-lg">
              No products available in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}