export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  details: string;
  specs: {
    material: string;
    size: string;
    finish: string;
    turnaround: string;
  };
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'business-cards',
    name: 'Business Cards',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop&q=80',
    category: 'Cards',
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
    id: '2',
    slug: 'flyers',
    name: 'Flyers',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1555835022-71efeb936319?w=600&h=600&fit=crop&q=80',
    category: 'Marketing',
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
    category: 'Marketing',
    description: 'Tri-fold brochures for comprehensive product information',
    details: 'Professional tri-fold brochures ideal for showcasing products and services. Premium paper stock with exceptional print quality.',
    specs: {
      material: '250gsm Art Paper',
      size: 'Tri-fold (8.5" × 11")',
      finish: 'Matte',
      turnaround: '4-5 business days'
    }
  },
  {
    id: '4',
    slug: 'postcards',
    name: 'Postcards',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&q=80',
    category: 'Cards',
    description: 'Custom postcards for direct mail campaigns',
    details: 'Full-color postcards perfect for direct mail marketing, event invitations, or thank you cards. Premium quality printing on sturdy cardstock.',
    specs: {
      material: '350gsm Card Stock',
      size: '4.25" × 6"',
      finish: 'Gloss or Matte',
      turnaround: '3-4 business days'
    }
  },
  {
    id: '5',
    slug: 'banners',
    name: 'Banners & Signage',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80',
    category: 'Signage',
    description: 'Large format banners for events and promotions',
    details: 'High-impact vinyl banners with UV-resistant inks. Perfect for outdoor events, store displays, and promotional campaigns.',
    specs: {
      material: '13oz Vinyl Banner',
      size: 'Custom sizes available',
      finish: 'UV-resistant',
      turnaround: '5-7 business days'
    }
  },
  {
    id: '6',
    slug: 'labels-stickers',
    name: 'Labels & Stickers',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&q=80',
    category: 'Labels',
    description: 'Custom labels and stickers for packaging and branding',
    details: 'Waterproof and durable labels perfect for product packaging, branding, and promotional use. Available in various shapes and sizes.',
    specs: {
      material: 'Premium Vinyl or Paper',
      size: 'Custom sizes',
      finish: 'Waterproof & Durable',
      turnaround: '2-3 business days'
    }
  }
];
