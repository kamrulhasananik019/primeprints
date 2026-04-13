type DemoCategory = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  parentId: string | null;
};

type DemoProduct = {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  imageUrls: string[];
  badges: string[];
  categoryId: string[];
};

export const demoCategories: DemoCategory[] = [
  {
    id: 'cat-paper-products',
    name: 'Paper Products',
    description: 'High-volume paper product printing for cards, flyers, and booklets.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
    parentId: null,
  },
  {
    id: 'cat-large-format-printing',
    name: 'Large Format Printing',
    description: 'Posters, banners, and display graphics for events and retail.',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
    parentId: null,
  },
  {
    id: 'cat-garment-printing',
    name: 'Garment Printing',
    description: 'Custom t-shirt and hoodie printing for teams, events, and brands.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80',
    parentId: null,
  },
];

export const demoProducts: DemoProduct[] = [
  {
    id: 'prd-premium-business-cards',
    name: 'Premium Business Cards',
    description: 'Luxury cards with soft-touch and spot UV finishing.',
    shortDescription: 'A premium first impression for meetings, events, and sales teams.',
    imageUrls: [
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=1200&fit=crop&q=80',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    ],
    badges: ['latest', 'samedayprinting'],
    categoryId: ['cat-paper-products'],
  },
  {
    id: 'prd-event-poster-a1',
    name: 'Event Poster A1',
    description: 'Bold A1 posters for retail windows and event promotion.',
    shortDescription: 'High-impact large format color output with quick turnaround.',
    imageUrls: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80'],
    badges: ['deliverymarketing'],
    categoryId: ['cat-large-format-printing'],
  },
  {
    id: 'prd-branded-hoodie-print',
    name: 'Branded Hoodie Print',
    description: 'Soft cotton hoodies with front/back branding.',
    shortDescription: 'Great for teams, communities, and product launches.',
    imageUrls: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80'],
    badges: ['latest'],
    categoryId: ['cat-garment-printing'],
  },
];
