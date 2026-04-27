import Image from 'next/image';
import Link from 'next/link';
import { getPrimaryImage } from '@/lib/product-media';
import { richContentToPlainText } from '@/lib/rich-content';
import { getProductPath, toSlug } from '@/lib/slug';
import { getCategories } from '@/services/category.service';
import { getProductsByCategoryId } from '@/services/product.service';

export default async function DiscountsAndPackages() {
  const categories = await getCategories();
  const dealsCategory = categories.find((category) => {
    const normalizedName = category.name.trim().toLowerCase();
    const normalizedSlug = category.slug.trim().toLowerCase();
    const desired = 'deals and discounts';
    return normalizedName === desired || normalizedSlug === toSlug(desired);
  });

  const products = dealsCategory ? await getProductsByCategoryId(dealsCategory.id, 6) : [];
  const dealsCategoryHref = '/categories/deals-and-discounts';
  const dealsCategoryImage =
    dealsCategory?.imageUrl && dealsCategory.imageUrl.trim() ? dealsCategory.imageUrl.trim() : '';
  const categoryDescription =
    richContentToPlainText(dealsCategory?.shortDescription) ||
    richContentToPlainText(dealsCategory?.description) ||
    'Save more with seasonal offers, package deals, and limited-time print promotions.';
  const dealItems = products.map((product) => {
    const description = richContentToPlainText(product.shortDescription) || richContentToPlainText(product.description) || '';
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description,
      imageUrl: getPrimaryImage(product),
    };
  });

  return (
    <section className="relative overflow-hidden bg-stone-50 py-16 font-sans lg:py-20">
      <div className="pointer-events-none absolute -left-28 top-10 h-64 w-64 rounded-full bg-[#D8E8F5] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#DDE9D2] blur-3xl" aria-hidden="true" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full border border-[#C9D6DF] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1B3C53]">
              Special Offers
            </span>

            <h2 className="font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Discounts & Packages
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
              Grab limited-time printing bundles with premium finishes and faster turnaround options.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-[#C9D6DF] bg-white shadow-sm p-4">
            <div className="relative mb-5 h-64 w-full overflow-hidden rounded-2xl bg-stone-100">
              {dealsCategoryImage ? (
                <Image
                  src={dealsCategoryImage}
                  alt={dealsCategory?.name || 'Deals & Discounts'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-medium text-stone-500">
                  No category image
                </div>
              )}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1B3C53]">Discount Category</p>
            <h3 className="mt-3 font-serif text-3xl font-bold text-stone-900">
              {dealsCategory?.name || 'Deals & Discounts'}
            </h3>
            {/* <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
              {categoryDescription}
            </p> */}
            <Link
              href={dealsCategoryHref}
              prefetch={false}
              className="mt-6 inline-flex rounded-xl bg-[#1B3C53] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#234C6A]"
            >
              Explore All Category
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {dealItems.length === 0 ? (
              <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-600 sm:col-span-2">
                No deals available right now.
              </div>
            ) : (
              dealItems.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={getProductPath(item.id, item.name, item.slug)}
                  prefetch={false}
                  className="group overflow-hidden rounded-2xl border border-[#C9D6DF] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-40 w-full bg-stone-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 40vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-stone-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif text-lg font-semibold text-stone-900">{item.name}</h4>
                    {/* <p className="mt-2 line-clamp-2 text-sm text-stone-600">{item.description}</p> */}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}