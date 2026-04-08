export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  images: ProductImage[];
  description: string;
  details: string;
  specs: {
    material: string;
    size: string;
    finish: string;
    turnaround: string;
  };
  status?: string;
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
        images: [
          { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop&q=80', alt: 'Business Cards - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=600&fit=crop&q=80', alt: 'Business Cards - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80', alt: 'Business Cards - Alternative 2' }
        ],
        description: 'Professional business cards with premium finishes',
        details: 'High-quality business cards perfect for networking and brand representation. Our professional printing ensures crisp, vibrant colors and sharp details.',
        specs: {
          material: '350gsm Premium Card Stock',
          size: '3.5" × 2"',
          finish: 'Matte or Gloss',
          turnaround: '3-5 business days'
        },
        status: 'NewArrival'
      },
      {
        id: '4',
        slug: 'postcards',
        name: 'Postcards',
        images: [
          { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&q=80', alt: 'Postcards - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop&q=80', alt: 'Postcards - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1527483377697-8795b1a1d6d2?w=600&h=600&fit=crop&q=80', alt: 'Postcards - Alternative 2' }
        ],
        description: 'Custom postcards for direct mail campaigns',
        details: 'Full-color postcards perfect for direct mail marketing, event invitations, or thank you cards. Premium quality printing on sturdy cardstock.',
        specs: {
          material: '350gsm Card Stock',
          size: '4.25" × 6"',
          finish: 'Gloss or Matte',
          turnaround: '3-4 business days'
        },
        status: 'SeasonalFavorite'
      },
      {
        id: '7',
        slug: 'letterheads',
        name: 'Letterheads',
        images: [
          { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop&q=80', alt: 'Letterheads - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=600&fit=crop&q=80', alt: 'Letterheads - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80', alt: 'Letterheads - Alternative 2' }
        ],
        description: 'Professional letterheads for corporate correspondence',
        details: 'Elegant letterheads that make your business communications stand out. Available in various paper weights and finishes.',
        specs: {
          material: '100gsm Bond Paper',
          size: '8.5" × 11"',
          finish: 'Smooth',
          turnaround: '2-3 business days'
        },
        status: 'latest'
      },
      {
        id: '8',
        slug: 'envelopes',
        name: 'Envelopes',
        images: [
          { url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80', alt: 'Envelopes - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop&q=80', alt: 'Envelopes - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=600&fit=crop&q=80', alt: 'Envelopes - Alternative 2' }
        ],
        description: 'Custom printed envelopes for professional mailing',
        details: 'Matching envelopes for your letterheads and business cards. Available in various sizes and security tint options.',
        specs: {
          material: '80gsm Envelope Paper',
          size: '#10 (4.125" × 9.5")',
          finish: 'Security Tint',
          turnaround: '2-3 business days'
        },
        status: 'NewArrival,SeasonalFavorite'
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
        images: [
          { url: 'https://images.unsplash.com/photo-1555835022-71efeb936319?w=600&h=600&fit=crop&q=80', alt: 'Flyers - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=600&fit=crop&q=80', alt: 'Flyers - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1546410559-bb4caa6b58f7?w=600&h=600&fit=crop&q=80', alt: 'Flyers - Alternative 2' }
        ],
        description: 'Eye-catching flyers for promotional campaigns',
        details: 'Get your message out with beautifully printed flyers. Perfect for events, promotions, and announcements with custom designs and vibrant colors.',
        specs: {
          material: '300gsm Card Stock',
          size: '8.5" × 11"',
          finish: 'Gloss',
          turnaround: '2-3 business days'
        },
        status: 'NewArrival'
      },
      {
        id: '3',
        slug: 'brochures',
        name: 'Brochures',
        images: [
          { url: 'https://images.unsplash.com/photo-1554225155-6726b3ff858f?w=600&h=600&fit=crop&q=80', alt: 'Brochures - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1542744173-8e90f59c20b1?w=600&h=600&fit=crop&q=80', alt: 'Brochures - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1563620978-f6db4e8e5f1c?w=600&h=600&fit=crop&q=80', alt: 'Brochures - Alternative 2' }
        ],
        description: 'Tri-fold brochures for comprehensive product information',
        details: 'Professional tri-fold brochures ideal for showcasing products and services. Premium paper stock with exceptional print quality.',
        specs: {
          material: '250gsm Art Paper',
          size: 'Tri-fold (8.5" × 11")',
          finish: 'Matte',
          turnaround: '4-5 business days'
        },
        status: 'SeasonalFavorite'
      },
      {
        id: '9',
        slug: 'booklets',
        name: 'Booklets',
        images: [
          { url: 'https://images.unsplash.com/photo-1542744173-8e90f59c20b1?w=600&h=600&fit=crop&q=80', alt: 'Booklets - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1554225155-6726b3ff858f?w=600&h=600&fit=crop&q=80', alt: 'Booklets - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1563620978-f6db4e8e5f1c?w=600&h=600&fit=crop&q=80', alt: 'Booklets - Alternative 2' }
        ],
        description: 'Multi-page booklets for detailed information',
        details: 'Perfect for product catalogs, company profiles, and detailed service information. Saddle-stitched binding with premium paper.',
        specs: {
          material: '150gsm Gloss Paper',
          size: '8.5" × 11"',
          finish: 'Saddle Stitch',
          turnaround: '5-7 business days'
        },
        status: 'latest'
      },
      {
        id: '10',
        slug: 'menus',
        name: 'Restaurant Menus',
        images: [
          { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=600&fit=crop&q=80', alt: 'Menus - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1555835022-71efeb936319?w=600&h=600&fit=crop&q=80', alt: 'Menus - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1546410559-bb4caa6b58f7?w=600&h=600&fit=crop&q=80', alt: 'Menus - Alternative 2' }
        ],
        description: 'Elegant menus for restaurants and cafes',
        details: 'Beautifully designed menus that showcase your culinary offerings. Laminated for durability and easy cleaning.',
        specs: {
          material: '200gsm Card Stock',
          size: '8.5" × 14"',
          finish: 'Laminated',
          turnaround: '3-4 business days'
        },
        status: 'SeasonalFavorite,latest'
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
        images: [
          { url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80', alt: 'Banners & Signage - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1610857512508-d0eda408e0f9?w=600&h=600&fit=crop&q=80', alt: 'Banners & Signage - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Banners & Signage - Alternative 2' }
        ],
        description: 'Large format banners for events and promotions',
        details: 'High-impact vinyl banners with UV-resistant inks. Perfect for outdoor events, store displays, and promotional campaigns.',
        specs: {
          material: '13oz Vinyl Banner',
          size: 'Custom sizes available',
          finish: 'UV-resistant',
          turnaround: '5-7 business days'
        },
        status: 'NewArrival'
      },
      {
        id: '11',
        slug: 'posters',
        name: 'Posters',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Posters - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80', alt: 'Posters - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1610857512508-d0eda408e0f9?w=600&h=600&fit=crop&q=80', alt: 'Posters - Alternative 2' }
        ],
        description: 'Eye-catching posters for wall displays',
        details: 'Vibrant posters perfect for events, promotions, and decorative displays. Available in various sizes and paper types.',
        specs: {
          material: '200gsm Poster Paper',
          size: '24" × 36"',
          finish: 'Matte',
          turnaround: '3-4 business days'
        },
        status: 'latest'
      },
      {
        id: '12',
        slug: 'yard-signs',
        name: 'Yard Signs',
        images: [
          { url: 'https://images.unsplash.com/photo-1610857512508-d0eda408e0f9?w=600&h=600&fit=crop&q=80', alt: 'Yard Signs - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Yard Signs - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80', alt: 'Yard Signs - Alternative 2' }
        ],
        description: 'Durable yard signs for outdoor advertising',
        details: 'Weather-resistant corrugated plastic signs perfect for real estate, political campaigns, and business advertising.',
        specs: {
          material: '4mm Corrugated Plastic',
          size: '18" × 24"',
          finish: 'Weather-resistant',
          turnaround: '4-5 business days'
        },
        status: 'NewArrival,SeasonalFavorite'
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
    products: [
      {
        id: '13',
        slug: 'event-posters',
        name: 'Event Posters',
        images: [
          { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop&q=80', alt: 'Event Posters - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1527483377697-8795b1a1d6d2?w=600&h=600&fit=crop&q=80', alt: 'Event Posters - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&q=80', alt: 'Event Posters - Alternative 2' }
        ],
        description: 'Vibrant posters for concerts, festivals, and events',
        details: 'High-quality posters that capture attention and build excitement for your events. Perfect for music venues, theaters, and community gatherings.',
        specs: {
          material: '250gsm Gloss Paper',
          size: '18" × 24"',
          finish: 'High Gloss',
          turnaround: '3-4 business days'
        },
        status: 'SeasonalFavorite'
      },
      {
        id: '14',
        slug: 'promotional-flyers',
        name: 'Promotional Flyers',
        images: [
          { url: 'https://images.unsplash.com/photo-1555835022-71efeb936319?w=600&h=600&fit=crop&q=80', alt: 'Promotional Flyers - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=600&fit=crop&q=80', alt: 'Promotional Flyers - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1546410559-bb4caa6b58f7?w=600&h=600&fit=crop&q=80', alt: 'Promotional Flyers - Alternative 2' }
        ],
        description: 'Cost-effective promotional flyers for mass distribution',
        details: 'Budget-friendly flyers perfect for wide distribution. Available in various sizes and paper weights to suit your marketing needs.',
        specs: {
          material: '100gsm Paper',
          size: '8.5" × 11"',
          finish: 'Uncoated',
          turnaround: '1-2 business days'
        },
        status: 'latest'
      }
    ]
  },
  {
    title: 'Brochures',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    tag: 'Informational',
    description:
      'Detailed brochures that inform and engage your audience.',
    accent: '#2a9d8f',
    slug: 'brochures',
    products: [
      {
        id: '15',
        slug: 'bi-fold-brochures',
        name: 'Bi-Fold Brochures',
        images: [
          { url: 'https://images.unsplash.com/photo-1554225155-6726b3ff858f?w=600&h=600&fit=crop&q=80', alt: 'Bi-Fold Brochures - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1542744173-8e90f59c20b1?w=600&h=600&fit=crop&q=80', alt: 'Bi-Fold Brochures - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1563620978-f6db4e8e5f1c?w=600&h=600&fit=crop&q=80', alt: 'Bi-Fold Brochures - Alternative 2' }
        ],
        description: 'Simple bi-fold brochures for concise information',
        details: 'Clean and professional bi-fold brochures perfect for presenting key information in an organized format.',
        specs: {
          material: '200gsm Gloss Paper',
          size: 'Bi-fold (8.5" × 11")',
          finish: 'Gloss',
          turnaround: '3-4 business days'
        },
        status: 'NewArrival'
      },
      {
        id: '16',
        slug: 'product-catalogs',
        name: 'Product Catalogs',
        images: [
          { url: 'https://images.unsplash.com/photo-1542744173-8e90f59c20b1?w=600&h=600&fit=crop&q=80', alt: 'Product Catalogs - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1554225155-6726b3ff858f?w=600&h=600&fit=crop&q=80', alt: 'Product Catalogs - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1563620978-f6db4e8e5f1c?w=600&h=600&fit=crop&q=80', alt: 'Product Catalogs - Alternative 2' }
        ],
        description: 'Comprehensive product catalogs showcasing your offerings',
        details: 'Detailed catalogs that showcase your complete product line with high-quality images and specifications.',
        specs: {
          material: '150gsm Art Paper',
          size: '8.5" × 11"',
          finish: 'Perfect Bound',
          turnaround: '7-10 business days'
        },
        status: 'SeasonalFavorite,latest'
      }
    ]
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
        images: [
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&q=80', alt: 'Labels & Stickers - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b58f7?w=600&h=600&fit=crop&q=80', alt: 'Labels & Stickers - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1527483377697-8795b1a1d6d2?w=600&h=600&fit=crop&q=80', alt: 'Labels & Stickers - Alternative 2' }
        ],
        description: 'Custom labels and stickers for packaging and branding',
        details: 'Waterproof and durable labels perfect for product packaging, branding, and promotional use. Available in various shapes and sizes.',
        specs: {
          material: 'Premium Vinyl or Paper',
          size: 'Custom sizes',
          finish: 'Waterproof & Durable',
          turnaround: '2-3 business days'
        },
        status: 'SeasonalFavorite'
      },
      {
        id: '17',
        slug: 'die-cut-stickers',
        name: 'Die-Cut Stickers',
        images: [
          { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b58f7?w=600&h=600&fit=crop&q=80', alt: 'Die-Cut Stickers - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&q=80', alt: 'Die-Cut Stickers - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1527483377697-8795b1a1d6d2?w=600&h=600&fit=crop&q=80', alt: 'Die-Cut Stickers - Alternative 2' }
        ],
        description: 'Custom shaped stickers with die-cut precision',
        details: 'Unique shaped stickers that stand out with custom die-cutting. Perfect for logos, characters, and special branding.',
        specs: {
          material: 'Gloss Vinyl',
          size: 'Custom shapes',
          finish: 'Die-cut',
          turnaround: '4-5 business days'
        },
        status: 'latest'
      },
      {
        id: '18',
        slug: 'window-decals',
        name: 'Window Decals',
        images: [
          { url: 'https://images.unsplash.com/photo-1527483377697-8795b1a1d6d2?w=600&h=600&fit=crop&q=80', alt: 'Window Decals - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b58f7?w=600&h=600&fit=crop&q=80', alt: 'Window Decals - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&q=80', alt: 'Window Decals - Alternative 2' }
        ],
        description: 'Transparent window decals for storefronts and vehicles',
        details: 'High-quality vinyl decals that adhere to windows and glass surfaces. Perfect for business branding and promotional messages.',
        specs: {
          material: 'Transparent Vinyl',
          size: 'Custom sizes',
          finish: 'Removable adhesive',
          turnaround: '3-4 business days'
        },
        status: 'NewArrival,latest'
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
    products: [
      {
        id: '19',
        slug: 'custom-t-shirts',
        name: 'Custom T-Shirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom T-Shirts - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom T-Shirts - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom T-Shirts - Alternative 2' }
        ],
        description: 'Custom screen-printed t-shirts for teams and events',
        details: 'High-quality cotton t-shirts with vibrant screen printing. Perfect for team uniforms, events, and promotional merchandise.',
        specs: {
          material: '100% Cotton',
          size: 'S-3XL',
          finish: 'Screen Print',
          turnaround: '7-10 business days'
        },
        status: 'NewArrival'
      },
      {
        id: '20',
        slug: 'hoodies',
        name: 'Custom Hoodies',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom Hoodies - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom Hoodies - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom Hoodies - Alternative 2' }
        ],
        description: 'Comfortable custom hoodies for branding and merchandise',
        details: 'Soft and durable hoodies perfect for corporate branding, team apparel, and promotional giveaways.',
        specs: {
          material: '50/50 Cotton/Polyester',
          size: 'S-3XL',
          finish: 'Screen Print or DTG',
          turnaround: '10-14 business days'
        },
        status: 'SeasonalFavorite'
      },
      {
        id: '21',
        slug: 'caps-hats',
        name: 'Custom Caps & Hats',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom Caps & Hats - Primary', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom Caps & Hats - Alternative 1' },
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80', alt: 'Custom Caps & Hats - Alternative 2' }
        ],
        description: 'Custom embroidered caps and hats for teams and promotions',
        details: 'Professional embroidered caps perfect for sports teams, corporate events, and brand recognition.',
        specs: {
          material: '100% Cotton Twill',
          size: 'One Size Fits Most',
          finish: 'Embroidered',
          turnaround: '8-12 business days'
        },
        status: 'latest'
      }
    ]
  },
];

// Get all products from categories
export const getAllProducts = (): Product[] => {
  return categories.flatMap(category => category.products);
};

// Get new arrival products
export const getNewArrivals = (): Product[] => {
  return getAllProducts().filter(product => product.status?.includes('NewArrival'));
};

// Get seasonal favorite products
export const getSeasonalFavorites = (): Product[] => {
  return getAllProducts().filter(product => product.status?.includes('SeasonalFavorite'));
};

// Get latest products
export const getLatestProducts = (): Product[] => {
  return getAllProducts().filter(product => product.status?.includes('latest'));
};

// Get products with both tags
export const getNewAndSeasonalProducts = (): Product[] => {
  return getAllProducts().filter(product => 
    product.status?.includes('NewArrival') && product.status?.includes('SeasonalFavorite')
  );
};

// Get products by category
export const getProductsByCategory = (categorySlug: string): Product[] => {
  const category = categories.find(cat => cat.slug === categorySlug);
  return category ? category.products : [];
};

// Get related products (from same category)
export const getRelatedProducts = (productId: string, limit: number = 3): Product[] => {
  const allProducts = getAllProducts();
  const currentProduct = allProducts.find(p => p.id === productId);

  if (!currentProduct) return [];

  // Find the category this product belongs to
  const category = categories.find(cat =>
    cat.products.some(p => p.id === productId)
  );

  if (category) {
    // Return other products from the same category
    return category.products
      .filter(p => p.id !== productId)
      .slice(0, limit);
  }

  return [];
};

// Get primary image for a product
export const getPrimaryImage = (product: Product): string => {
  const primaryImage = product.images.find(img => img.isPrimary);
  return primaryImage ? primaryImage.url : product.images[0]?.url || '';
};