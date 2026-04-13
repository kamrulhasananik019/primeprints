import type { RichDescription } from '@/types/rich-content';

type DemoCategory = {
  id: string;
  slug: string;
  name: string;
  description: RichDescription;
  imageUrl: string;
  tag: string;
  parentId: string | null;
};

type DemoProduct = {
  id: string;
  slug: string;
  name: string;
  description: RichDescription;
  shortDescription: RichDescription;
  imageUrls: string[];
  badges: string[];
  categoryId: string[];
};

const introTipTap = {
  type: 'doc' as const,
  content: [
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Fast turnaround, reliable delivery' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Order before noon for priority production and same-day dispatch options in London.',
        },
      ],
    },
  ],
};

export const demoCategories: DemoCategory[] = [
  {
    id: 'category-paper-products',
    slug: 'paper-products',
    name: 'Paper Products',
    description: [{ type: 'markdown', content: 'High-volume **paper product printing** for cards, flyers, and booklets.' }],
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
    tag: 'Core Print',
    parentId: null,
  },
  {
    id: 'category-large-format-printing',
    slug: 'large-format-printing',
    name: 'Large Format Printing',
    description: [{ type: 'markdown', content: 'Posters, banners, and display graphics for events and retail.' }],
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
    tag: 'Signage',
    parentId: null,
  },
  {
    id: 'category-garment-printing',
    slug: 'garment-printing',
    name: 'Garment Printing',
    description: [{ type: 'markdown', content: 'Custom t-shirt and hoodie printing for teams, events, and brands.' }],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80',
    tag: 'Apparel',
    parentId: null,
  },
];

export const demoProducts: DemoProduct[] = [
  {
    id: 'product-premium-business-cards',
    slug: 'premium-business-cards',
    name: 'Premium Business Cards',
    description: [
      { type: 'markdown', content: 'Luxury cards with **soft-touch** and spot UV finishing.' },
      { type: 'tiptap', content: introTipTap },
    ],
    shortDescription: [
      { type: 'text', content: 'A premium first impression for meetings, events, and sales teams.' },
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=1200&fit=crop&q=80',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    ],
    badges: ['latest', 'samedayprinting'],
    categoryId: ['paper-products'],
  },
  {
    id: 'product-event-poster-a1',
    slug: 'event-poster-a1',
    name: 'Event Poster A1',
    description: [{ type: 'markdown', content: 'Bold **A1 posters** for retail windows and event promotion.' }],
    shortDescription: [{ type: 'text', content: 'High-impact large format color output with quick turnaround.' }],
    imageUrls: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80'],
    badges: ['deliverymarketing'],
    categoryId: ['large-format-printing'],
  },
  {
    id: 'product-branded-hoodie-print',
    slug: 'branded-hoodie-print',
    name: 'Branded Hoodie Print',
    description: [{ type: 'markdown', content: 'Soft cotton hoodies with front/back branding.' }],
    shortDescription: [{ type: 'markdown', content: 'Great for teams, communities, and product launches.' }],
    imageUrls: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80'],
    badges: ['latest'],
    categoryId: ['garment-printing'],
  },
];
