# Admin Quick Reference

Fast access to common admin tasks and commands.

## Quick Links

| Task | URL |
|------|-----|
| Admin Panel | `http://localhost:3000/admin` |
| Health Check | `curl http://localhost:3000/api/admin-health` |
| Seed Demo Data | `curl -X POST http://localhost:3000/api/seed-demo` |
| API Docs | [Payload REST API](https://payloadcms.com/docs/rest-api/overview) |

## Environment Variables

```bash
# Required
DATABASE_URL=postgres://user@localhost:5432/primeprints
PAYLOAD_SECRET=<32-char-random-string>

# Optional (defaults provided)
PAYLOAD_ADMIN_EMAIL=admin@example.com
PAYLOAD_ADMIN_PASSWORD=ChangeMe123!
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional (Cloudflare R2 uploads)
R2_ACCOUNT_ID=
R2_BUCKET=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=
```

## Admin Features

### Collections

#### Users (Admin Authentication)
- **Slug**: `users`
- **Auth**: Enabled
- **Fields**: email, password (managed by Payload)
- **Access**: Admin only
- **Edit URL**: `/admin/users`

#### Categories
- **Slug**: `categories`
- **Fields**:
  - `name` (text, required)
  - `slug` (auto-generated, unique)
  - `description` (rich text)
  - `imageUrl` (group: url, alt, title)
  - `parentId` (self-relationship, prevents circular)
  - `seoTitle` (max 60 chars)
  - `seoDescription` (max 160 chars)
  - `seoImage` (URL)
- **Admin Tabs**: Content, SEO
- **Edit URL**: `/admin/categories`

#### Products
- **Slug**: `products`
- **Fields**:
  - `name` (text, required)
  - `slug` (auto-generated, unique)
  - `shortDescription` (rich text, required)
  - `description` (rich text)
  - `imageUrl` (array of groups: url, alt, title)
  - `categoryId` (many-to-many relationship)
  - `badges` (array of strings)
  - `seoTitle` (max 60 chars)
  - `seoDescription` (max 160 chars)
  - `seoImage` (URL)
- **Admin Tabs**: Content, Images, SEO
- **Edit URL**: `/admin/products`

## Common Tasks

### 1. Create a New Category

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <auth-token>" \
  -d '{
    "name": "Custom Packaging",
    "description": "<p>Custom box and packaging solutions</p>",
    "imageUrl": {
      "url": "https://example.com/images/packaging.jpg",
      "alt": "Custom Packaging",
      "title": "Custom Packaging"
    },
    "seoTitle": "Custom Packaging Services",
    "seoDescription": "Premium custom packaging for your brand",
    "seoImage": "https://example.com/images/packaging-seo.jpg"
  }'
```

### 2. Create a New Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <auth-token>" \
  -d '{
    "name": "Custom Notebooks",
    "shortDescription": "<p>Premium bound notebooks with custom covers</p>",
    "description": "<p>High-quality hardcover notebooks with custom branding...</p>",
    "imageUrl": [
      {
        "url": "https://example.com/notebook1.jpg",
        "alt": "Front cover",
        "title": "Notebook Front"
      }
    ],
    "categoryId": ["cat-paper-products"],
    "badges": ["latest", "popular"],
    "seoTitle": "Custom Printed Notebooks",
    "seoDescription": "Professional custom notebooks for corporate gifting",
    "seoImage": "https://example.com/notebook-seo.jpg"
  }'
```

### 3. Update a Product

```bash
curl -X PATCH http://localhost:3000/api/products/prd-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <auth-token>" \
  -d '{
    "name": "Premium Custom Notebooks",
    "badges": ["latest", "bestseller"]
  }'
```

### 4. Delete a Category

```bash
curl -X DELETE http://localhost:3000/api/categories/cat-id \
  -H "Authorization: Bearer <auth-token>"
```

### 5. Get All Categories

```bash
curl http://localhost:3000/api/categories?limit=100
```

Response:
```json
{
  "docs": [
    {
      "id": "cat-paper-products",
      "name": "Paper Products",
      "slug": "paper-products",
      "description": "...",
      "imageUrl": { "url": "...", "alt": "...", "title": "..." },
      "seoTitle": "...",
      "seoDescription": "...",
      "seoImage": "..."
    }
  ],
  "totalDocs": 1,
  "limit": 100,
  "page": 1
}
```

### 6. Get Product by ID

```bash
curl http://localhost:3000/api/products/prd-id
```

### 7. Search Products

```bash
curl "http://localhost:3000/api/products?where[name][contains]=notebook&limit=10"
```

### 8. Add Image to Product

```bash
# First, upload file to R2
curl -X POST http://localhost:3000/api/r2/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=products" > response.json

# Extract URL from response
PUBLIC_URL=$(cat response.json | jq -r '.url')

# Add to product imageUrl array
curl -X PATCH http://localhost:3000/api/products/prd-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <auth-token>" \
  -d "{
    \"imageUrl\": [
      {
        \"url\": \"$PUBLIC_URL\",
        \"alt\": \"Product Image\",
        \"title\": \"Product Image\"
      }
    ]
  }"
```

### 9. Re-seed Demo Data

```bash
curl -X POST http://localhost:3000/api/seed-demo
```

### 10. Get Admin Health Status

```bash
curl http://localhost:3000/api/admin-health | jq
```

## SQL Queries (Direct Database)

```bash
# Connect to database
psql $DATABASE_URL

# List all users
SELECT id, email, created_at FROM users;

# Count products
SELECT COUNT(*) FROM products;

# Find products by category
SELECT p.id, p.name, c.name as category
FROM products p
JOIN products_categories pc ON p.id = pc.product_id
JOIN categories c ON pc.category_id = c.id
WHERE c.slug = 'paper-products';

# List categories with parent relationships
SELECT id, name, parent_id, slug FROM categories;

# Search products by name
SELECT id, name, slug FROM products WHERE name ILIKE '%business%';

# Get products by SEO title
SELECT id, name, seo_title FROM products WHERE seo_title LIKE '%Custom%';

# Check table structure
\d products
\d categories
\d users
```

## Payload Admin UI

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save current document |
| `Ctrl+K` | Search globally |
| `Tab` | Move to next field |
| `Shift+Tab` | Move to previous field |

### Editor Features

**Rich Text Editor (Tiptap)**:
- **Format**: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline)
- **Lists**: Ctrl+Shift+L (bullet), Ctrl+Shift+O (ordered)
- **Heading**: `#` for H1, `##` for H2, etc.
- **Link**: Ctrl+K (insert URL)
- **Code**: Backticks for inline code

**Image Group Fields**:
- **URL**: Full URL to image (https://...)
- **Alt**: Short descriptive text (for accessibility)
- **Title**: Hover tooltip text (optional)

**Relationships**:
- Search by ID or name
- Multi-select for many relationships
- Remove with X button

## Development Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin-health` | GET | Admin setup health check |
| `/api/seed-demo` | POST | Re-seed demo data |
| `/api/categories` | GET | List categories (public) |
| `/api/categories/:id` | GET | Get category by ID (public) |
| `/api/products` | GET | List products (public) |
| `/api/products/:id` | GET | Get product by ID (public) |
| `/api/r2/upload` | POST | Upload file to R2 (admin) |
| `/api/r2/delete` | POST | Delete file from R2 (admin) |

## Error Responses

### 400 Bad Request
```json
{
  "errors": [{
    "message": "Field is required",
    "field": "name"
  }]
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message",
  "error": "detailed error"
}
```

## Tips & Best Practices

1. **Slugs**: Always use lowercase, hyphens instead of spaces
2. **SEO Titles**: Keep under 60 characters for Google display
3. **SEO Descriptions**: 150-160 characters optimal for Google
4. **Image URLs**: Use public CDN or R2 URLs for fast delivery
5. **Rich Text**: Use headings (H2, H3) for better semantics
6. **Categories**: Organize hierarchically with parent relationships
7. **Badges**: Use consistent, lowercase names (latest, popular, sale)
8. **Products**: Always include at least 1 product image

## Support

- Check [STARTUP_CHECKLIST.md](./STARTUP_CHECKLIST.md) for setup help
- Read [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed features
- Visit [Payload CMS Docs](https://payloadcms.com/docs) for API reference
- Check server console for detailed error logs
