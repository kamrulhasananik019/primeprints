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

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
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
              name: 'description',
              type: 'json',
              required: true,
            },
            {
              name: 'imageUrl',
              type: 'group',
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
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
                { name: 'alt', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
              ],
            },
            {
              name: 'parentId',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: false,
              filterOptions: ({ id }) => {
                if (!id) {
                  return true;
                }

                return {
                  id: {
                    not_equals: id,
                  },
                };
              },
              validate: (value: unknown, { id }: any) => {
                if (!value || !id) {
                  return true;
                }

                if (String(value) === String(id)) {
                  return 'A category cannot be its own parent.';
                }

                return true;
              },
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