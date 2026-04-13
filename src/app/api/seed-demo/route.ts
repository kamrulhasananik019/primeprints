import { NextResponse } from 'next/server';
import { randomBytes, randomUUID, scryptSync } from 'node:crypto';
import { d1Execute, d1Query } from '@/lib/cloudflare-d1';
import { revalidateTag } from 'next/cache';
import { toSlug } from '@/lib/slug';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'kamrulhasananik019@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '1122@#Aa';
    const existingAdmin = await d1Query<{ id: string }>('SELECT id FROM admins WHERE LOWER(email) = LOWER(?) LIMIT 1', [adminEmail]);
    if (!existingAdmin[0]?.id) {
      await d1Execute('INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)', [
        randomUUID(),
        adminEmail,
        hashPassword(adminPassword),
      ]);
    }

    if (!process.env.CF_ACCOUNT_ID || !process.env.CF_D1_DATABASE_ID || !process.env.CF_API_TOKEN) {
      return NextResponse.json(
        {
          ok: false,
          error: 'CF_ACCOUNT_ID, CF_D1_DATABASE_ID, and CF_API_TOKEN are required.',
        },
        { status: 500 }
      );
    }

    const categorySeed = [
      [
        'Paper Products',
        JSON.stringify([{ type: 'markdown', content: 'High-volume paper product printing for cards, flyers, and booklets.' }]),
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
      ],
      [
        'Large Format Printing',
        JSON.stringify([{ type: 'markdown', content: 'Posters, banners, and display graphics for events and retail.' }]),
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
      ],
      [
        'Garment Printing',
        JSON.stringify([{ type: 'markdown', content: 'Custom t-shirt and hoodie printing for teams, events, and brands.' }]),
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80',
      ],
    ];

    const categoryIds: string[] = [];
    for (const [name, description, imageUrl] of categorySeed) {
      const existing = await d1Query<{ id: string }>('SELECT id FROM categories WHERE name = ? LIMIT 1', [name]);
      if (existing[0]?.id) {
        categoryIds.push(existing[0].id);
        continue;
      }
      const id = randomUUID();
      await d1Execute('INSERT INTO categories (id, slug, name, description, image_url, parent_id) VALUES (?, ?, ?, ?, ?, ?)', [
        id,
        toSlug(name),
        name,
        description,
        imageUrl,
        null,
      ]);
      categoryIds.push(id);
    }

    const productSeed = [
      {
        name: 'Premium Business Cards',
        shortDescription: JSON.stringify([{ type: 'markdown', content: 'A premium first impression for meetings, events, and sales teams.' }]),
        description: JSON.stringify([{ type: 'markdown', content: 'Luxury cards with soft-touch and spot UV finishing.' }]),
        imageUrls: [
          'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=1200&fit=crop&q=80',
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
        ],
        badges: ['latest', 'samedayprinting'],
        categoryIds: categoryIds[0] ? [categoryIds[0]] : [],
      },
      {
        name: 'Event Poster A1',
        shortDescription: JSON.stringify([{ type: 'markdown', content: 'High-impact large format color output with quick turnaround.' }]),
        description: JSON.stringify([{ type: 'markdown', content: 'Bold A1 posters for retail windows and event promotion.' }]),
        imageUrls: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80'],
        badges: ['deliverymarketing'],
        categoryIds: categoryIds[1] ? [categoryIds[1]] : [],
      },
    ];

    for (const item of productSeed) {
      const existing = await d1Query<{ id: string }>('SELECT id FROM products WHERE name = ? LIMIT 1', [item.name]);
      if (existing[0]?.id) {
        continue;
      }
      await d1Execute(
        'INSERT INTO products (id, slug, name, image_url, description, short_description, badges, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          randomUUID(),
          toSlug(item.name),
          item.name,
          JSON.stringify(item.imageUrls),
          item.description,
          item.shortDescription,
          JSON.stringify(item.badges),
          JSON.stringify(item.categoryIds),
        ]
      );
    }

    const [categories, products] = await Promise.all([
      d1Query<{ count: number }>('SELECT COUNT(*) as count FROM categories'),
      d1Query<{ count: number }>('SELECT COUNT(*) as count FROM products'),
    ]);

    revalidateTag('catalog', 'max');

    return NextResponse.json({
      ok: true,
      message: 'Demo data seeded successfully',
      categories: Number(categories[0]?.count || 0),
      products: Number(products[0]?.count || 0),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Seed error:', errorMessage);

    return NextResponse.json(
      {
        ok: false,
        error: `Failed to seed demo data: ${errorMessage}`,
        hint: 'Ensure Cloudflare D1 API env vars are correctly configured.',
      },
      { status: 500 }
    );
  }
}