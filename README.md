This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Cloudflare D1 Setup

Wrangler is installed and configured with a D1 binding named `DB`.

1. Login to Cloudflare:

```bash
pnpm cf:login
```

2. Create the remote D1 database:

```bash
pnpm cf:d1:create
```

3. Copy the `database_id` from command output into `wrangler.jsonc`.

4. Apply local migration:

```bash
pnpm cf:d1:migrate
```

5. Apply remote migration:

```bash
pnpm cf:d1:migrate:remote
```

Useful command:

```bash
pnpm cf:d1:list
```

## Cloudflare R2 Setup (Images, Videos, Files)

1. Create an R2 bucket:

```bash
pnpm cf:r2:create
```

2. Create an R2 API token in Cloudflare with bucket read/write access.

3. Get your R2 S3 API credentials (`Access Key ID` and `Secret Access Key`).

4. Update `.env.local`:

```bash
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_BUCKET=primeprints-assets
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
# Optional public delivery URL (recommended)
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
# Optional size limit in bytes (default 100MB)
R2_MAX_UPLOAD_BYTES=104857600
```

5. Use upload API (multipart form-data):

```bash
curl -X POST http://localhost:3000/api/r2/upload \
	-F "file=@/path/to/your-file.jpg" \
	-F "folder=images"
```

Response includes `key` and `url`.

6. Delete an object by key:

```bash
curl -X POST http://localhost:3000/api/r2/delete \
	-H "Content-Type: application/json" \
	-d '{"key":"images/your-object-key.jpg"}'
```

## Use D1 In Next.js

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in `CF_ACCOUNT_ID` and `CF_API_TOKEN` in `.env.local`.

3. Start the app:

```bash
pnpm dev
```

4. Test D1 route:

```bash
curl http://localhost:3000/api/d1-health
```

## Admin Panel Setup

This project now includes a protected admin CMS at `/admin` with D1-backed login and CRUD APIs for categories and products.

1. Add admin env values in `.env.local`:

```bash
ADMIN_SESSION_SECRET=replace-with-long-random-secret
ADMIN_SESSION_TTL_SECONDS=28800
```

2. Apply admin migration:

```bash
pnpm cf:d1:migrate
pnpm cf:d1:migrate:remote
```

3. Generate a password hash for the first admin user:

```bash
node -e "const {scryptSync,randomBytes}=require('crypto');const p='ChangeMe123!';const s=randomBytes(16).toString('hex');const h=scryptSync(p,s,64).toString('hex');console.log('scrypt$'+s+'$'+h)"
```

4. Insert admin in D1 (replace values):

```sql
INSERT INTO admins (id, email, password_hash)
VALUES ('admin-1', 'admin@example.com', 'scrypt$<salt>$<hash>');
```

5. Start app and login at `/admin/login`.

## New Database Shape

Migration `0005_reset_schema_keep_admin.sql` resets all non-admin tables and keeps admin auth tables.

Tables kept:

- `admins`
- `admin_login_audit`

Tables recreated:

- `categories`
- `products`

Data model:

- `Category`: id, slug, name, description, imageUrl, parentId
- `Product`: id, slug, name, description, shortDescription, imageUrl[], badges[], categoryId[]

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
