import { notFound } from 'next/navigation';
import Link from 'next/link';

type Category = {
  title: string;
  image: string;
  tag: string;
  description: string;
  accent: string;
};

const categories: Category[] = [
  {
    title: 'Business Cards',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    tag: 'Identity',
    description:
      'Craft first impressions that last. Premium paper stocks, finishes, and die-cut shapes for a card that commands attention.',
    accent: '#c9a96e',
  },
  {
    title: 'Print & Office',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80',
    tag: 'Marketing',
    description:
      'High-fidelity prints for advertising and office environments. Brochures, flyers, letterheads and more.',
    accent: '#7b9e87',
  },
  {
    title: 'Signs & Banners',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80',
    tag: 'Outdoor',
    description:
      'Bold, weather-resistant signage that stops people in their tracks.',
    accent: '#e07a5f',
  },
  {
    title: 'Flyers & Posters',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80',
    tag: 'Promotional',
    description:
      'Eye-catching flyers and posters to promote your events and services.',
    accent: '#f4a261',
  },
  {
    title: 'Brochures',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    tag: 'Informational',
    description:
      'Detailed brochures that inform and engage your audience.',
    accent: '#2a9d8f',
  },
  {
    title: 'Stickers & Labels',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    tag: 'Branding',
    description:
      'Custom stickers and labels for branding and product identification.',
    accent: '#e76f51',
  },
  {
    title: 'T-Shirts & Apparel',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    tag: 'Merchandise',
    description:
      'Custom printed t-shirts and apparel for teams and promotions.',
    accent: '#264653',
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find(cat => slugify(cat.title) === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-block text-stone-600 hover:text-stone-900">
          ← Back to Home
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
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
      </div>
    </div>
  );
}