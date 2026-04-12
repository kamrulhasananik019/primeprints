import type { Product } from '../categories';

export const garmentPrinting: Product[] = [
  { id: 'tg-01', slug: 't-shirt-printing', name: 'T-Shirt Printing', category: 'garment-printing', images: [], description: 'Custom tees.', specs: { print: 'DTG/Vinyl' }, status: 'latest' },
  { id: 'tg-02', slug: 'hoodie-printing', name: 'Hoodie Printing', category: 'garment-printing', images: [], description: 'Warm custom hoodies.', specs: { weight: 'Heavyweight' }, status: 'WinterEssential' },
  { id: 'tg-03', slug: 'tote-bag-printing', name: 'Tote Bag Printing', category: 'garment-printing', images: [], description: 'Canvas tote bags.', specs: { material: 'Eco-Cotton' }, status: 'EcoFriendly' },
  { id: 'tg-04', slug: 'apron-printing', name: 'Apron Printing', category: 'garment-printing', images: [], description: 'Kitchen & Work aprons.', specs: { type: 'Full length' }, status: 'Hospitality' },
  { id: 'tg-05', slug: 'sweatshirt-printing', name: 'Sweatshirt Printing', category: 'garment-printing', images: [], description: 'Branded sweatshirts.', specs: { fit: 'Unisex' }, status: 'Standard' },
  { id: 'tg-06', slug: 'cap-printing', name: 'Cap Printing', category: 'garment-printing', images: [], description: 'Embroidered/Printed caps.', specs: { style: 'Trucker/Baseball' }, status: 'Accessories' },
  { id: 'tg-07', slug: 'hi-vis-printing', name: 'Hi-Vis Printing', category: 'garment-printing', images: [], description: 'Safety wear.', specs: { class: 'EN ISO 20471' }, status: 'Workwear' },
  { id: 'tg-08', slug: 'running-vest-printing', name: 'Running Vest Printing', category: 'garment-printing', images: [], description: 'Athletic vests.', specs: { fabric: 'Breathable' }, status: 'Sports' },
  { id: 'tg-09', slug: 'sports-wear-printing', name: 'Sports wear Printing', category: 'garment-printing', images: [], description: 'Team kits.', specs: { dryfit: 'Yes' }, status: 'Sports' },
];
