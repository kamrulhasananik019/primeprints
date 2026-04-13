import type { Payload } from 'payload';

const defaultAdminEmail = process.env.PAYLOAD_ADMIN_EMAIL || 'kamrulhasananik019@gmail.com';
const defaultAdminPassword = process.env.PAYLOAD_ADMIN_PASSWORD || '1122@#Aa';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function createRichText(value: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              version: 1,
              text: value,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
            },
          ],
        },
      ],
    },
  };
}

const demoCategories = [
  {
    name: 'Paper Products',
    description: 'High-volume paper product printing for cards, flyers, and booklets.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
    parentSlug: null as string | null,
  },
  {
    name: 'Large Format Printing',
    description: 'Posters, banners, and display graphics for events and retail.',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
    parentSlug: null as string | null,
  },
  {
    name: 'Garment Printing',
    description: 'Custom t-shirt and hoodie printing for teams, events, and brands.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80',
    parentSlug: null as string | null,
  },
];

const demoProducts = [
  {
    name: 'Premium Business Cards',
    description: 'Luxury cards with soft-touch and spot UV finishing.',
    shortDescription: 'A premium first impression for meetings, events, and sales teams.',
    imageUrls: [
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=1200&fit=crop&q=80',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    ],
    badges: ['latest', 'samedayprinting'],
    categorySlugs: ['paper-products'],
  },
  {
    name: 'Event Poster A1',
    description: 'Bold A1 posters for retail windows and event promotion.',
    shortDescription: 'High-impact large format color output with quick turnaround.',
    imageUrls: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80'],
    badges: ['deliverymarketing'],
    categorySlugs: ['large-format-printing'],
  },
  {
    name: 'Branded Hoodie Print',
    description: 'Soft cotton hoodies with front/back branding.',
    shortDescription: 'Great for teams, communities, and product launches.',
    imageUrls: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80'],
    badges: ['latest'],
    categorySlugs: ['garment-printing'],
  },
];

export async function seedPayloadContent(payload: Payload) {
  const existingUsers = await payload.find({ collection: 'users', limit: 1 });

  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: defaultAdminEmail,
        password: defaultAdminPassword,
      },
    });
  }

  const categoryIdBySlug = new Map<string, string>();

  for (const category of demoCategories) {
    const slug = toSlug(category.name);
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });

    const data = {
      name: category.name,
      slug,
      description: createRichText(category.description),
      imageUrl: {
        url: category.imageUrl,
        alt: category.name,
        title: category.name,
      },
      seoTitle: category.name,
      seoDescription: category.description,
      seoImage: category.imageUrl,
    };

    const savedCategory =
      existing.docs.length > 0
        ? await payload.update({
            collection: 'categories',
            id: String(existing.docs[0].id),
            data: { ...data, parentId: undefined },
          })
        : await payload.create({
            collection: 'categories',
            data: { ...data, parentId: undefined },
          });

    categoryIdBySlug.set(slug, String(savedCategory.id));
  }

  for (const category of demoCategories) {
    const slug = toSlug(category.name);
    const categoryId = categoryIdBySlug.get(slug);
    const parentId = category.parentSlug ? categoryIdBySlug.get(category.parentSlug) : undefined;

    if (categoryId) {
      await payload.update({
        collection: 'categories',
        id: categoryId,
        data: {
          parentId,
        },
      });
    }
  }

  for (const product of demoProducts) {
    const slug = toSlug(product.name);
    const categoryIds = product.categorySlugs.map((item) => categoryIdBySlug.get(item)).filter(Boolean) as string[];

    if (categoryIds.length === 0) {
      continue;
    }

    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });

    const data = {
      name: product.name,
      slug,
      shortDescription: createRichText(product.shortDescription),
      description: createRichText(product.description),
      imageUrl: product.imageUrls.map((url, index) => ({
        url,
        alt: `${product.name} image ${index + 1}`,
        title: product.name,
      })),
      badges: product.badges.map((value) => ({ value })),
      categoryId: categoryIds,
      seoTitle: product.name,
      seoDescription: product.shortDescription,
      seoImage: product.imageUrls[0] ?? '',
    };

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'products',
        id: String(existing.docs[0].id),
        data,
      });
      continue;
    }

    await payload.create({
      collection: 'products',
      data,
    });
  }
}