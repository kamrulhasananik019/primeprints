import { NextResponse } from 'next/server';
import { randomBytes, scryptSync } from 'node:crypto';
import { revalidateTag } from 'next/cache';

import {
  createAdminCategory,
  createAdminProduct,
  countAdminItems,
  getAdminByEmail,
  getAdminCategories,
  getAdminProducts,
  resolveCategoryIds,
  upsertAdmin,
} from '@/lib/mongo-catalog';

export const runtime = 'nodejs';

function tiptapDoc(text: string) {
  return JSON.stringify({
    type: 'doc',
    content: text
      ? [
          {
            type: 'paragraph',
            content: [{ type: 'text', text }],
          },
        ]
      : [],
  });
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'kamrulhasananik019@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '1122@#Aa';

    const existingAdmin = await getAdminByEmail(adminEmail);
    if (!existingAdmin) {
      await upsertAdmin(adminEmail, hashPassword(adminPassword));
    }

    const categorySeed = [
      {
        name: 'Paper Products',
        description: tiptapDoc('High-volume paper product printing for cards, flyers, and booklets.'),
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
      },
      {
        name: 'Large Format Printing',
        description: tiptapDoc('Posters, banners, and display graphics for events and retail.'),
        imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
      },
      {
        name: 'Garment Printing',
        description: tiptapDoc('Custom t-shirt and hoodie printing for teams, events, and brands.'),
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80',
      },
    ];

    const existingCategories = await getAdminCategories();
    const existingByName = new Set(existingCategories.map((item) => item.name.toLowerCase()));

    for (const category of categorySeed) {
      if (existingByName.has(category.name.toLowerCase())) {
        continue;
      }
      await createAdminCategory({
        name: category.name,
        imageUrl: category.imageUrl,
        parentId: null,
        description: category.description,
      });
    }

    const paperCategoryIds = await resolveCategoryIds(['Paper Products']);
    const largeFormatCategoryIds = await resolveCategoryIds(['Large Format Printing']);

    const productSeed = [
      {
        name: 'Premium Business Cards',
        shortDescription: tiptapDoc('A premium first impression for meetings, events, and sales teams.'),
        description: tiptapDoc('Luxury cards with soft-touch and spot UV finishing.'),
        imageUrls: [
          'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=1200&fit=crop&q=80',
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
        ],
        badges: ['latest', 'samedayprinting'],
        categoryIds: paperCategoryIds,
      },
      {
        name: 'Event Poster A1',
        shortDescription: tiptapDoc('High-impact large format color output with quick turnaround.'),
        description: tiptapDoc('Bold A1 posters for retail windows and event promotion.'),
        imageUrls: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80'],
        badges: ['deliverymarketing'],
        categoryIds: largeFormatCategoryIds,
      },
    ];

    const existingProducts = await getAdminProducts();
    const existingProductNames = new Set(existingProducts.map((item) => item.name.toLowerCase()));

    for (const item of productSeed) {
      if (existingProductNames.has(item.name.toLowerCase())) {
        continue;
      }
      await createAdminProduct(item);
    }

    const counts = await countAdminItems();
    revalidateTag('catalog', 'max');

    return NextResponse.json({
      ok: true,
      message: 'Demo data seeded successfully',
      categories: counts.categories,
      products: counts.products,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Seed error:', errorMessage);

    return NextResponse.json(
      {
        ok: false,
        error: `Failed to seed demo data: ${errorMessage}`,
        hint: 'Ensure MONGODB_URI is correctly configured.',
      },
      { status: 500 }
    );
  }
}
