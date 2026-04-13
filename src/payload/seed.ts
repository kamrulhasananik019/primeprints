import type { Payload } from 'payload';

import { demoCategories, demoProducts } from '@/payload/demo-data';

const defaultAdminEmail = process.env.PAYLOAD_ADMIN_EMAIL || 'kamrulhasananik019@gmail.com';
const defaultAdminPassword = process.env.PAYLOAD_ADMIN_PASSWORD || '1122@#Aa';
const defaultCategoryAccentBySlug: Record<string, string> = {
  'paper-products': '#1f6f8b',
  'large-format-printing': '#e85d04',
  'garment-printing': '#2a9d8f',
};

export async function seedPayloadContent(payload: Payload) {
  const [existingUsers, existingCategories, existingProducts] = await Promise.all([
    payload.find({ collection: 'users', limit: 1 }),
    payload.find({ collection: 'categories', limit: 1000 }),
    payload.find({ collection: 'products', limit: 1 }),
  ]);

  const categoryIdBySlug = new Map<string, string>(
    existingCategories.docs.map((category) => [String((category as { slug?: string }).slug ?? ''), String((category as { id?: string }).id ?? '')])
  );

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
      const createdCategory = await payload.create({
        collection: 'categories',
        data: {
          id: category.id,
          slug: category.slug,
          title: category.name,
          image: category.imageUrl,
          tag: category.tag,
          description: category.description,
          shortDescription: category.description,
          longDescription: category.description,
          accent: defaultCategoryAccentBySlug[category.slug] ?? '#1b3c53',
          parentId: undefined,
        },
      });

      const createdCategoryId = String((createdCategory as { id?: string; doc?: { id?: string } }).id ?? (createdCategory as { doc?: { id?: string } }).doc?.id ?? '');
      if (createdCategoryId) {
        categoryIdBySlug.set(category.slug, createdCategoryId);
      }
    }
  }

  if (existingProducts.docs.length === 0) {
    for (const product of demoProducts) {
      const categorySlug = product.categoryId[0] ?? '';
      await payload.create({
        collection: 'products',
        data: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          title: product.name,
          categoryId: categorySlug,
          description: product.description,
          shortDescription: product.shortDescription,
          longDescription: product.description,
          details: product.shortDescription,
          images: product.imageUrls.map((url, index) => ({
            url,
            alt: index === 0 ? product.name : `${product.name} ${index + 1}`,
            isPrimary: index === 0,
          })),
          badges: product.badges.map((value) => ({ value })),
          specs: {
            material: '',
            size: '',
            finish: '',
            turnaround: '',
          },
          status: product.badges.join(','),
        },
      });
    }
  }
}