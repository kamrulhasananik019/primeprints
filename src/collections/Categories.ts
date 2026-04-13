import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', required: true },
    { name: 'image', type: 'text', required: true },
    { name: 'tag', type: 'text', required: true },
    { name: 'description', type: 'json' },
    { name: 'shortDescription', type: 'json' },
    { name: 'longDescription', type: 'json' },
    { name: 'accent', type: 'text', required: true },
    { name: 'parentId', type: 'text' },
  ],
};