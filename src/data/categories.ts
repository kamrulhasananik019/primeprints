export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export type RichDescriptionBlock =
  | {
      type: 'text';
      content: string;
    }
  | {
      type: 'list';
      items: string[];
    };

export type RichDescription = string | RichDescriptionBlock[];

export interface Product {
  id: string;
  slug: string;
  title?: string;
  name: string;
  category: string;
  images: ProductImage[];
  description: string;
  shortDescription?: RichDescription;
  longDescription?: RichDescription;
  details?: RichDescription;
  specs: Record<string, string>;
  status?: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  image: string;
  tag: string;
  description: string;
  shortDescription?: RichDescription;
  longDescription?: RichDescription;
  accent: string;
}

export const categories: Category[] = [
  {
    id: 'cat-paper-products',
    slug: 'paper-products',
    title: 'Paper Products',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    tag: 'Print',
    description: 'Essential business and marketing materials printed on high-quality paper stocks.',
    shortDescription: [
      {
        type: 'text',
        content:
          'Prime Print delivers fast, high-quality paper product printing across the UK for businesses, events, and everyday marketing campaigns.',
      },
      {
        type: 'list',
        items: ['Same day and next day options on selected products', 'Nationwide UK delivery', 'Professional print quality and dependable finishing'],
      },
    ],
    longDescription: [
      {
        type: 'text',
        content:
          'Our paper products category includes business cards, flyers, leaflets, brochures, menus, posters, postcards, and stickers produced with sharp detail and consistent colour.',
      },
      {
        type: 'text',
        content:
          'Whether you need short-run prints for a local campaign or larger quantities for exhibitions and national distribution, Prime Print combines competitive pricing, fast turnaround, and reliable UK-wide delivery.',
      },
    ],
    accent: '#c9a96e',
  },
  {
    id: 'cat-binding',
    slug: 'binding-accessories',
    title: 'Binding & Accessories',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
    tag: 'Finishing',
    description: 'Professional document finishing for reports and presentations.',
    accent: '#2c3e50',
  },
  {
    id: 'cat-large-format',
    slug: 'large-format-printing',
    title: 'Large Format Printing',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    tag: 'Signage',
    description: 'High-impact wide format prints.',
    accent: '#e74c3c',
  },
  {
    id: 'cat-custom',
    slug: 'custom-product-printing',
    title: 'Custom Product Printing',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    tag: 'Personalised',
    description: 'Bespoke printing for every occasion.',
    accent: '#9b59b6',
  },
  {
    id: 'cat-tshirt',
    slug: 'garment-printing',
    title: 'T-Shirt / Garment Printing',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
    tag: 'Apparel',
    description: 'Custom apparel and clothing.',
    accent: '#27ae60',
  },
  {
    id: 'cat-exhibition',
    slug: 'exhibition-printing',
    title: 'Show & Exhibition Printing',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    tag: 'Expo',
    description: 'Complete setup for events and trade shows.',
    accent: '#3498db',
  },
  {
    id: 'cat-gifts',
    slug: 'personalised-gifts',
    title: 'Personalised Gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
    tag: 'Gifts',
    description: 'Photo gifts and personalized keepsakes.',
    accent: '#f1c40f',
  },
];
