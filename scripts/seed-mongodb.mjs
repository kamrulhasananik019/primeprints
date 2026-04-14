import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes, scryptSync } from 'node:crypto';
import { MongoClient, ObjectId } from 'mongodb';

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    if (!key || process.env[key]) continue;
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function loadEnv() {
  const root = process.cwd();
  loadEnvFile(resolve(root, '.env'));
  loadEnvFile(resolve(root, '.env.local'));
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function richDoc(text, bullets = []) {
  const content = [];
  if (text) {
    content.push({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    });
  }
  if (bullets.length > 0) {
    content.push({
      type: 'bulletList',
      content: bullets.map((item) => ({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: item }],
          },
        ],
      })),
    });
  }
  return {
    type: 'doc',
    content,
  };
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

async function main() {
  loadEnv();
  const shouldResetCatalog = process.argv.includes('--reset');

  const uri = process.env.MONGODB_URI || '';
  if (!uri) {
    throw new Error('Missing MONGODB_URI in .env or .env.local');
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const parsed = new URL(uri);
  const dbName = parsed.pathname.replace(/^\//, '') || process.env.MONGODB_DB_NAME || 'primeprints';

  const insecureTls = String(process.env.MONGODB_TLS_INSECURE || '').toLowerCase() === 'true';
  const client = new MongoClient(uri, insecureTls ? { tlsAllowInvalidCertificates: true } : undefined);
  await client.connect();
  const db = client.db(dbName);

  const categories = db.collection('categories');
  const products = db.collection('products');
  const admins = db.collection('admins');

  await Promise.all([
    categories.createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { parentId: 1 } },
    ]),
    products.createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { categoryIds: 1 } },
      { key: { isFeatured: 1 } },
      { key: { isActive: 1 } },
    ]),
    admins.createIndexes([{ key: { email: 1 }, unique: true }]),
  ]);

  const now = new Date();
  await admins.updateOne(
    { email: adminEmail },
    {
      $setOnInsert: {
        _id: new ObjectId(),
        createdAt: now,
      },
      $set: {
        email: adminEmail,
        passwordHash: hashPassword(adminPassword),
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  if (shouldResetCatalog) {
    const [deletedProducts, deletedCategories] = await Promise.all([
      products.deleteMany({}),
      categories.deleteMany({}),
    ]);
    console.log(`Reset enabled: removed ${deletedCategories.deletedCount} categories and ${deletedProducts.deletedCount} products.`);
  }

  const categorySeed = [
    {
      slug: 'business-cards',
      name: 'Business Cards',
      shortDescription: 'Premium printed business cards for daily networking.',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80',
      description: 'High-quality business cards printed in the UK for startups and established brands.',
      bullets: ['350gsm and 450gsm stock options', 'Matte, gloss, and soft-touch finishes', 'Same-day print and dispatch available'],
      seoKeywords: ['business cards', 'business card printing', 'uk printing'],
      sortOrder: 1,
    },
    {
      slug: 'flyers-leaflets',
      name: 'Flyers & Leaflets',
      shortDescription: 'Affordable flyer printing for promotions and events.',
      image: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=1200&q=80',
      description: 'Promotional flyers with vivid colors and fast turnaround for marketing campaigns.',
      bullets: ['A6 to A3 sizes available', 'Single or double-sided print', 'Bulk pricing for large campaigns'],
      seoKeywords: ['flyers', 'leaflets', 'flyer printing uk'],
      sortOrder: 2,
    },
    {
      slug: 'posters-banners',
      name: 'Posters & Banners',
      shortDescription: 'Large-format print for indoor and outdoor campaigns.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
      description: 'Durable poster and banner printing for retail, exhibitions, and events.',
      bullets: ['Weather-resistant PVC banner options', 'A2, A1, A0 and custom dimensions', 'Collection and UK delivery options'],
      seoKeywords: ['posters', 'banners', 'large format printing'],
      sortOrder: 3,
    },
    {
      name: 'Paper Products',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
      description: 'High-volume paper product printing for cards, flyers, and booklets.',
    },
    {
      name: 'Large Format Printing',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
      description: 'Posters, banners, and display graphics for events and retail.',
    },
    {
      name: 'Garment Printing',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80',
      description: 'Custom t-shirt and hoodie printing for teams, events, and brands.',
    },
  ];

  for (const item of categorySeed) {
    const slug = item.slug || slugify(item.name);
    await categories.updateOne(
      { slug },
      {
        $setOnInsert: {
          _id: new ObjectId(),
          createdAt: now,
        },
        $set: {
          slug,
          name: item.name,
          shortDescription: richDoc(item.shortDescription || item.description),
          description: richDoc(item.description, item.bullets || []),
          image: { url: item.image, alt: `${item.name} category image` },
          parentId: null,
          seo: {
            title: `${item.name} Printing UK`,
            description: item.description,
            keywords: item.seoKeywords || [item.name.toLowerCase(), 'printing', 'uk'],
            image: item.image,
          },
          isActive: true,
          sortOrder: item.sortOrder || 99,
          updatedAt: now,
        },
      },
      { upsert: true }
    );
  }

  const categoryDocs = await categories
    .find({
      slug: { $in: ['business-cards', 'flyers-leaflets', 'posters-banners', 'paper-products', 'large-format-printing'] },
    })
    .toArray();
  const categoryBySlug = new Map(categoryDocs.map((doc) => [doc.slug, doc._id]));

  const productSeed = [
    {
      name: 'Premium Matte Business Card',
      shortDescription: richDoc('350gsm matte laminated business card with smooth finish.'),
      description: richDoc('Luxury business cards designed to create a strong first impression.', [
        'Spot UV and foil options',
        'Corner rounding available',
        'Printed in full color both sides',
      ]),
      images: [
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=1200&fit=crop&q=80',
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
      ],
      badges: ['Popular', 'Best Seller'],
      categorySlugs: ['business-cards'],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: 'Luxury Spot UV Business Card',
      shortDescription: richDoc('Premium business cards with raised UV highlights.'),
      description: richDoc('Designed for brands that want an elegant and tactile finish.', [
        'Soft-touch lamination',
        'Raised spot UV layers',
        'Excellent for agencies and consultants',
      ]),
      images: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
        'https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&q=80',
      ],
      badges: ['Featured', 'Popular'],
      categorySlugs: ['business-cards'],
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: 'A5 Promotional Flyer',
      shortDescription: richDoc('A5 flyer printing for local promotions and handouts.'),
      description: richDoc('Cost-effective flyers for product launches and event promotion.', [
        'Silk and gloss paper options',
        'Fast 24-hour turnaround',
        'Bulk print discounts',
      ]),
      images: ['https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=1200&q=80'],
      badges: ['Latest'],
      categorySlugs: ['flyers-leaflets'],
      isFeatured: false,
      sortOrder: 3,
    },
    {
      name: 'DL Menu Leaflet',
      shortDescription: richDoc('Compact leaflet perfect for takeaway menus.'),
      description: richDoc('Durable menu leaflet printing with sharp text and vivid imagery.', [
        'Folded or flat options',
        'Restaurant and cafe friendly formats',
      ]),
      images: ['https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=1200&q=80'],
      badges: ['Seasonal'],
      categorySlugs: ['flyers-leaflets'],
      isFeatured: false,
      sortOrder: 4,
    },
    {
      name: 'Event Poster A1',
      shortDescription: richDoc('High-impact large format color output with quick turnaround.'),
      description: richDoc('Bold A1 posters for retail windows and event promotion.', [
        'Indoor and outdoor stocks',
        'Lamination options available',
      ]),
      images: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80'],
      badges: ['Seasonal'],
      categorySlugs: ['posters-banners', 'large-format-printing'],
      isFeatured: false,
      sortOrder: 5,
    },
  ];

  for (const item of productSeed) {
    const slug = slugify(item.name);
    const primaryImage = item.images[0] || '';
    const categoryIds = (item.categorySlugs || []).map((slugName) => categoryBySlug.get(slugName)).filter(Boolean);
    await products.updateOne(
      { slug },
      {
        $setOnInsert: {
          _id: new ObjectId(),
          createdAt: now,
        },
        $set: {
          slug,
          name: item.name,
          shortDescription: item.shortDescription,
          description: item.description,
          images: item.images.map((url, index) => ({ url, alt: `${item.name} image ${index + 1}` })),
          badges: item.badges,
          categoryIds,
          seo: {
            title: `${item.name} Printing`,
            description: item.name,
            keywords: [item.name.toLowerCase(), 'printing', 'uk'],
            image: primaryImage,
          },
          isFeatured: item.isFeatured,
          isActive: true,
          sortOrder: item.sortOrder || 99,
          updatedAt: now,
        },
      },
      { upsert: true }
    );
  }

  const [adminCount, categoryCount, productCount] = await Promise.all([
    admins.countDocuments(),
    categories.countDocuments(),
    products.countDocuments(),
  ]);

  console.log(`Seed complete in db "${dbName}"`);
  console.log(`Admins: ${adminCount}`);
  console.log(`Categories: ${categoryCount}`);
  console.log(`Products: ${productCount}`);
  console.log(`Admin login email: ${adminEmail}`);

  await client.close();
}

main().catch((error) => {
  console.error('Mongo seed failed:', error.message);
  process.exit(1);
});
