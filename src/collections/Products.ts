import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text' },
    { name: 'categoryId', type: 'text', required: true },
    { name: 'description', type: 'json' },
    { name: 'shortDescription', type: 'json' },
    { name: 'longDescription', type: 'json' },
    { name: 'details', type: 'json' },
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'url', type: 'text', required: true },
        { name: 'alt', type: 'text', required: true },
        { name: 'isPrimary', type: 'checkbox' },
      ],
    },
    {
      name: 'badges',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    { name: 'specs', type: 'json' },
    { name: 'status', type: 'text' },
  ],
};