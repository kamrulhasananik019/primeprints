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
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    {
      name: 'imageUrl',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'badges',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'categoryId',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
      required: true,
    },
  ],
};