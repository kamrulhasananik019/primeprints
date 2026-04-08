export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  description: string;
  details: string;
  specs: {
    material: string;
    size: string;
    finish: string;
    turnaround: string;
  };
}

export interface Category {
  title: string;
  image: string;
  tag: string;
  description: string;
  accent: string;
  slug: string;
  products: Product[];
}

export const categories: Category[] = [
  {
    title: 'Business Cards',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    tag: 'Identity',
    description:
      'Craft first impressions that last. Premium paper stocks, finishes, and die-cut shapes for a card that commands attention.',
    accent: '#c9a96e',
    slug: 'business-cards',
    products: [
      {
        id: '1',
        slug: 'business-cards',
        name: 'Business Cards',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop&q=80',
        description: 'Professional business cards with premium finishes',
        details: 'High-quality business cards perfect for networking and brand representation. Our professional printing ensures crisp, vibrant colors and sharp details.',
        specs: {
          material: '350gsm Premium Card Stock',
          size: '3.5" × 2"',
          finish: 'Matte or Gloss',
          turnaround: '3-5 business days'
        }
      },
      {
        id: '4',
        slug: 'postcards',
        name: 'Postcards',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&q=80',
        description: 'Custom postcards for direct mail campaigns',
        details: 'Full-color postcards perfect for direct mail marketing, event invitations, or thank you cards. Premium quality printing on sturdy cardstock.',
        specs: {
          material: '350gsm Card Stock',
          size: '4.25" × 6"',
          finish: 'Gloss or Matte',
          turnaround: '3-4 business days'
        }
      }
    ]
  },
  {
    title: 'Print & Office',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80',
    tag: 'Marketing',
    description:
      'High-fidelity prints for advertising and office environments. Brochures, flyers, letterheads and more.',
    accent: '#7b9e87',
    slug: 'print-office',
    products: [
      {
        id: '2',
        slug: 'flyers',
        name: 'Flyers',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1555835022-71efeb936319?w=600&h=600&fit=crop&q=80',
        description: 'Eye-catching flyers for promotional campaigns',
        details: 'Get your message out with beautifully printed flyers. Perfect for events, promotions, and announcements with custom designs and vibrant colors.',
        specs: {
          material: '300gsm Card Stock',
          size: '8.5" × 11"',
          finish: 'Gloss',
          turnaround: '2-3 business days'
        }
      },
      {
        id: '3',
        slug: 'brochures',
        name: 'Brochures',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1554225155-6726b3ff858f?w=600&h=600&fit=crop&q=80',
        description: 'Tri-fold brochures for comprehensive product information',
        details: 'Professional tri-fold brochures ideal for showcasing products and services. Premium paper stock with exceptional print quality.',
        specs: {
          material: '250gsm Art Paper',
          size: 'Tri-fold (8.5" × 11")',
          finish: 'Matte',
          turnaround: '4-5 business days'
        }
      }
    ]
  },
  {
    title: 'Signs & Banners',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80',
    tag: 'Outdoor',
    description:
      'Bold, weather-resistant signage that stops people in their tracks.',
    accent: '#e07a5f',
    slug: 'signs-banners',
    products: [
      {
        id: '5',
        slug: 'banners',
        name: 'Banners & Signage',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80',
        description: 'Large format banners for events and promotions',
        details: 'High-impact vinyl banners with UV-resistant inks. Perfect for outdoor events, store displays, and promotional campaigns.',
        specs: {
          material: '13oz Vinyl Banner',
          size: 'Custom sizes available',
          finish: 'UV-resistant',
          turnaround: '5-7 business days'
        }
      }
    ]
  },
  {
    title: 'Flyers & Posters',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80',
    tag: 'Promotional',
    description:
      'Eye-catching flyers and posters to promote your events and services.',
    accent: '#f4a261',
    slug: 'flyers-posters',
    products: []
  },
  {
    title: 'Brochures',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    tag: 'Informational',
    description:
      'Detailed brochures that inform and engage your audience.',
    accent: '#2a9d8f',
    slug: 'brochures',
    products: []
  },
  {
    title: 'Stickers & Labels',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    tag: 'Branding',
    description:
      'Custom stickers and labels for branding and product identification.',
    accent: '#e76f51',
    slug: 'stickers-labels',
    products: [
      {
        id: '6',
        slug: 'labels-stickers',
        name: 'Labels & Stickers',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&q=80',
        description: 'Custom labels and stickers for packaging and branding',
        details: 'Waterproof and durable labels perfect for product packaging, branding, and promotional use. Available in various shapes and sizes.',
        specs: {
          material: 'Premium Vinyl or Paper',
          size: 'Custom sizes',
          finish: 'Waterproof & Durable',
          turnaround: '2-3 business days'
        }
      }
    ]
  },
  {
    title: 'T-Shirts & Apparel',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    tag: 'Merchandise',
    description:
      'Custom printed t-shirts and apparel for teams and promotions.',
    accent: '#264653',
    slug: 't-shirts-apparel',
    products: []
  },
];
