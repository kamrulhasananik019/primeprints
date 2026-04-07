export interface Review {
  name: string;
  role: string;
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  {
    name: 'Olivia Martin',
    role: 'Marketing Manager',
    rating: 5,
    text: 'PrimePrints delivered stunning packaging and flyers for our launch campaign. The quality was exceptional and the service was fast. Highly recommend!',
  },
  {
    name: 'Noah Patel',
    role: 'Small Business Owner',
    rating: 5,
    text: 'Amazing results from start to finish. The team understood our needs, provided great advice, and the final prints looked premium.',
  },
  {
    name: 'Emma Johnson',
    role: 'Event Coordinator',
    rating: 5,
    text: 'We ordered banners, posters, and brochures. Everything arrived on time and looked better than expected. Great customer care too.',
  },
  {
    name: 'Liam Brooks',
    role: 'Creative Director',
    rating: 5,
    text: 'A trustworthy print partner for our brand. The colours, paper, and finish were all top class. Will order again for our next project.',
  },
];
