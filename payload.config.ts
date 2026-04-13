import { postgresAdapter } from '@payloadcms/db-postgres';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Categories } from './src/collections/Categories';
import { Products } from './src/collections/Products';
import { Users } from './src/collections/Users';
import { seedPayloadContent } from './src/payload/seed';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
    },
  },
  collections: [Users, Categories, Products],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'primeprints-payload-dev-secret',
  onInit: async (payload) => {
    await seedPayloadContent(payload);
  },
});