import type { Payload } from 'payload';

import { categories } from '@/data/categories';
import { allProducts } from '@/data/products';

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
    for (const category of categories) {
      await payload.create({
        collection: 'categories',
        data: {
          slug: category.slug,
          title: category.title,
          image: category.image,
          tag: category.tag,
          description: category.description,
          shortDescription: category.shortDescription ?? category.description,
          longDescription: category.longDescription ?? category.description,
          accent: category.accent,
          parentId: '',
        },
      });
    }
  }

  if (existingProducts.docs.length === 0) {
    for (const product of allProducts) {
      await payload.create({
        collection: 'products',
        data: {
          slug: product.slug,
          name: product.name,
          title: product.title || '',
          categoryId: product.category,
          description: product.description,
          shortDescription: product.shortDescription ?? product.description,
          longDescription: product.longDescription ?? product.details ?? product.description,
          details: product.details ?? product.longDescription ?? product.description,
          images: product.images,
          badges: product.status ? [{ value: product.status }] : [],
          specs: product.specs,
          status: product.status ?? '',
        },
      });
    }
  }
}