export interface SeasonalItem {
  title: string;
  image: string;
  tag: string;
  description: string;
  accent: string;
}

export const seasonalFavorites: SeasonalItem[] = [
  {
    title: 'Holiday Cards',
    image: 'https://images.unsplash.com/photo-1610857512508-d0eda408e0f9?w=600&q=80',
    tag: 'Seasonal',
    description:
      'Set the festive mood with custom-designed holiday greeting cards.',
    accent: '#d4331f',
  },
  {
    title: 'Spring Promotional',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    tag: 'Promotion',
    description:
      'Fresh spring campaigns with vibrant colors and designs.',
    accent: '#a8d5ba',
  },
  {
    title: 'Summer Event Flyers',
    image: 'https://images.unsplash.com/photo-1527483377697-8795b1a1d6d2?w=600&q=80',
    tag: 'Events',
    description:
      'Eye-catching flyers for summer festivals and outdoor events.',
    accent: '#f4a261',
  },
  {
    title: 'Wedding Invitations',
    image: 'https://images.unsplash.com/photo-1546410559-bb4caa6b58f7?w=600&q=80',
    tag: 'Formal',
    description:
      'Elegant and personalized wedding invitation sets.',
    accent: '#d4c4b8',
  },
  {
    title: 'Corporate Annual Reports',
    image: 'https://images.unsplash.com/photo-1542744173-8e90f59c20b1?w=600&q=80',
    tag: 'Corporate',
    description:
      'Premium annual reports that impress stakeholders.',
    accent: '#2a3f5f',
  },
  {
    title: 'Product Packaging',
    image: 'https://images.unsplash.com/photo-1563620978-f6db4e8e5f1c?w=600&q=80',
    tag: 'Packaging',
    description:
      'Custom packaging solutions for e-commerce and retail.',
    accent: '#e8b4b8',
  },
  {
    title: 'Back to School Supplies',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b58f7?w=600&q=80',
    tag: 'Education',
    description:
      'Branded notebooks, folders, and school materials.',
    accent: '#6b9bd1',
  },
];
