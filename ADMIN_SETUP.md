# Admin Panel Setup Guide

## Quick Start

### 1. Environment Configuration

Create `.env.local` in the project root:

```bash
# Required: PostgreSQL connection
DATABASE_URL=postgres://user:password@localhost:5432/primeprints

# Required: Payload secret (use a long random string)
PAYLOAD_SECRET=$(openssl rand -base64 32)

# Optional: Admin credentials (used for initial seed)
PAYLOAD_ADMIN_EMAIL=admin@example.com
PAYLOAD_ADMIN_PASSWORD=ChangeMe123!

# Optional: Site URL for canonical links
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Database Setup

Initialize PostgreSQL:

```bash
# Create database (if not exists)
createdb primeprints

# Start the app (this automatically runs migrations and seeds data)
pnpm dev
```

The app will:
- Automatically create all required Payload tables on first run
- Create a default admin user with credentials from `.env.local`
- Seed demo categories and products into the database

### 3. Access Admin Panel

Once the app is running:
- Navigate to: `http://localhost:3000/admin`
- Login with your credentials:
  - Email: `admin@example.com` (or `PAYLOAD_ADMIN_EMAIL`)
  - Password: `ChangeMe123!` (or `PAYLOAD_ADMIN_PASSWORD`)

## Admin Features

### Collections

The admin panel provides full CRUD management for:

1. **Users** - Admin authentication (managed by Payload)
2. **Categories** - Product categories with:
   - Auto-generating slugs from names
   - Rich text descriptions (Tiptap editor)
   - Group fields for images (URL, alt text, title)
   - Self-referencing parent-child relationships
   - SEO metadata (title, description, image)

3. **Products** - Individual products with:
   - Auto-generating slugs
   - Rich text short and full descriptions
   - Image galleries (multiple images with metadata)
   - Multi-category tagging
   - Custom badges (e.g., "latest", "samedayprinting")
   - SEO metadata (title, description, image)

### Rich Text Editor

Both Categories and Products use Payload's native rich text editor (Tiptap) which supports:
- Headings and paragraphs
- Bold, italic, underline text
- Lists (ordered and unordered)
- Links
- Code blocks
- Blockquotes

### Tabbed Interface

The admin UI is organized into logical tabs:

**Categories:**
- **Content**: Name, slug, description, image, parent category
- **SEO**: SEO title, description, image for search results

**Products:**
- **Content**: Name, slug, short description, full description, badges, categories
- **Images**: Image gallery with URL, alt text, and titles
- **SEO**: SEO title, description, image for search results

## Seeding Data

### Initial Seed (Automatic)

On first app run, the seeding function automatically:
1. Creates admin user (if none exists)
2. Seeds demo categories (3 categories)
3. Seeds demo products (3 products)

This happens in `src/payload/seed.ts` which is called by `payload.config.ts` onInit hook.

### Manual Reseed

To reseed demo data while preserving the admin user:

```bash
curl -X POST http://localhost:3000/api/seed-demo
```

Response:
```json
{
  "ok": true,
  "categories": 3,
  "products": 3
}
```

## Troubleshooting

### "DATABASE_URL is required"

**Issue**: Admin panel or seed endpoint returns this error

**Fix**: Ensure `DATABASE_URL` is set in `.env.local`:
```bash
DATABASE_URL=postgres://user@localhost:5432/primeprints pnpm dev
```

### Admin login fails

**Issue**: Cannot log in with provided credentials

**Steps**:
1. Verify credentials in `.env.local` (PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD)
2. Check database connection: `psql $DATABASE_URL`
3. Verify users table exists: `\dt users` in psql
4. Reset via reseed: `curl -X POST http://localhost:3000/api/seed-demo`

### Rich text not rendering

**Issue**: Description appears as JSON in frontend

**Fix**: Ensure `normalizeRichText()` in `src/lib/d1.ts` is properly converting Payload's rich text format to plain text for the storefront display.

### Images not loading

**Issue**: Image URLs showing as broken

**Steps**:
1. Verify image URL is valid in the admin panel
2. For R2 images, ensure R2_PUBLIC_URL is set correctly
3. Use absolute URLs (https://example.com/image.jpg) or relative paths (/images/image.jpg)

## Advanced Configuration

### Custom Admin User

To change initial admin credentials:

Edit `.env.local`:
```bash
PAYLOAD_ADMIN_EMAIL=your-email@example.com
PAYLOAD_ADMIN_PASSWORD=YourSecurePassword123!
```

Then restart the app to trigger reseeding.

### Change Admin Collection

To modify admin access controls, edit `src/collections/Users.ts`:

```typescript
access: {
  create: ({ req }) => Boolean(req.user), // Only admins can create users
  delete: ({ req }) => Boolean(req.user),
  read: ({ req }) => Boolean(req.user),   // Only admins can view users
  update: ({ req }) => Boolean(req.user),
}
```

### Payload Secret Rotation

For production deployments, update the `PAYLOAD_SECRET`:

```bash
PAYLOAD_SECRET=$(openssl rand -base64 32)
```

**Warning**: Changing this will invalidate existing sessions.

## Database Migrations

Payload manages database schema automatically. However, if you need to run custom migrations:

```bash
# Payload watches for schema changes and applies migrations automatically on dev
pnpm dev
```

For production, ensure all environment variables are set before deploying.

## API Endpoints

### Payload REST API

The Payload CMS provides REST APIs:

```bash
# Get all categories
curl http://localhost:3000/api/categories

# Get category by ID
curl http://localhost:3000/api/categories/cat-paper-products

# Create category (requires admin auth)
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "New Category", "description": "..."}'
```

See [Payload REST API docs](https://payloadcms.com/docs/rest-api/overview) for more details.

## Next Steps

- [ ] Configure custom domains and CDN for image delivery via R2
- [ ] Set up backup strategy for PostgreSQL database
- [ ] Enable 2FA for admin accounts
- [ ] Configure email notifications for admin actions
- [ ] Set up monitoring and alerting for database health

