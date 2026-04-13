import type { CollectionConfig } from 'payload';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'categoryId'],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              hooks: {
                beforeValidate: [
                  ({ data, value }) => {
                    if (typeof data?.name === 'string' && data.name.trim()) {
                      return toSlug(data.name);
                    }

                    if (typeof value === 'string' && value.trim()) {
                      return toSlug(value);
                    }

                    return value;
                  },
                ],
              },
            },
            {
              name: 'shortDescription',
              type: 'json',
              required: true,
            },
            {
              name: 'description',
              type: 'json',
              required: true,
            },
            {
              name: 'badges',
              type: 'array',
              fields: [{ name: 'value', type: 'text', required: true }],
            },
            {
              name: 'categoryId',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              required: true,
              validate: (value: unknown) => {
                if (!Array.isArray(value) || value.length === 0) {
                  return 'At least 1 category is required.';
                }

                return true;
              },
            },
          ],
        },
        {
          label: 'Images',
          fields: [
            {
              name: 'imageUrl',
              type: 'array',
              required: true,
              minRows: 1,
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'https://example.com/image.jpg',
                  },
                  validate: (value: unknown) => {
                    if (typeof value !== 'string' || !value.trim()) {
                      return 'Image URL is required.';
                    }

                    if (!isValidUrl(value)) {
                      return 'Image URL must be a valid URL.';
                    }

                    return true;
                  },
                },
                {
                  name: 'alt',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Red cotton t-shirt front view',
                    description: 'Used for accessibility and SEO',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Product image title',
                    description: 'Optional image title attribute',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              required: true,
              maxLength: 60,
              admin: {
                description: 'Used for Google title and browser tab',
              },
            },
            {
              name: 'seoDescription',
              type: 'text',
              required: true,
              maxLength: 160,
              admin: {
                description: 'Used for Google search result and social sharing',
              },
            },
            {
              name: 'seoImage',
              type: 'text',
              required: true,
              admin: {
                description: 'Image used for Open Graph / Facebook / Twitter sharing',
              },
              validate: (value: unknown) => {
                if (typeof value !== 'string' || !value.trim()) {
                  return 'SEO image is required.';
                }

                if (!isValidUrl(value)) {
                  return 'SEO image must be a valid URL.';
                }

                return true;
              },
            },
          ],
        },
      ],
    },
  ],
};