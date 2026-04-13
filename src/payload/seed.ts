import type { Payload } from 'payload';

import { demoCategories, demoProducts } from '@/payload/demo-data';

const defaultAdminEmail = process.env.PAYLOAD_ADMIN_EMAIL || 'kamrulhasananik019@gmail.com';
const defaultAdminPassword = process.env.PAYLOAD_ADMIN_PASSWORD || '1122@#Aa';

export async function seedPayloadContent(payload: Payload) {
  const [existingUsers, existingCategories, existingProducts] = await Promise.all([
    payload.find({ collection: 'users', limit: 1 }),
    payload.find({ collection: 'categories', limit: 1 }),
    payload.find({ collection: 'products', limit: 1 }),
  ]);

  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: defaultAdminEmail,
        password: defaultAdminPassword,
      },
    });
  }

  if (existingCategories.docs.length === 0) {
    for (const category of demoCategories) {
      await payload.create({
        collection: 'categories',
        data: {
          id: category.id,
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl,
          parentId: category.parentId ?? undefined,
        },
      });
    }
  }

  if (existingProducts.docs.length === 0) {
    for (const product of demoProducts) {
      await payload.create({
        collection: 'products',
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          imageUrl: product.imageUrls.map((value) => ({ value })),
          badges: product.badges.map((value) => ({ value })),
          categoryId: product.categoryId.map((value) => ({ value })),
        },
      });
    }
  }
}