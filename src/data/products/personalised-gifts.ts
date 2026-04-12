import type { Product } from '../categories';

export const personalisedGifts: Product[] = [
  { id: 'pg-01', slug: 'coasters', name: 'Coasters', category: 'personalised-gifts', images: [], description: 'Personalized coasters.', specs: { base: 'Cork/MDF' }, status: 'Gift' },
  { id: 'pg-02', slug: 'aluminium-prints', name: 'Aluminium Prints', category: 'personalised-gifts', images: [], description: 'Metal photo prints.', specs: { material: 'Chromaluxe' }, status: 'Premium' },
  { id: 'pg-03', slug: 'magnets', name: 'Magnets', category: 'personalised-gifts', images: [], description: 'Fridge magnets.', specs: { type: 'Flexible/Rigid' }, status: 'Souvenir' },
  { id: 'pg-04', slug: 'money-box', name: 'Money Box', category: 'personalised-gifts', images: [], description: 'Custom piggy banks.', specs: { material: 'Ceramic' }, status: 'Kids' },
];
