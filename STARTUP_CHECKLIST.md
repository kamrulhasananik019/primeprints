# Primeprints Startup Checklist

Complete these steps to get the admin panel and storefront running correctly.

## Pre-Startup Checks

### 1. Node.js & Package Manager ✓
- [ ] Node.js v18+ installed: `node --version`
- [ ] pnpm installed: `pnpm --version`
- [ ] All dependencies installed: `pnpm install`

### 2. PostgreSQL Database ✓
- [ ] PostgreSQL 13+ running on your system
- [ ] Can connect to PostgreSQL: `psql postgres`
- [ ] Database created: `createdb primeprints` (or existing database configured)

## Environment Configuration

### 3. Create `.env.local` ✓

Copy the template and fill in values:

```bash
cp .env.example .env.local
```

Required fields:
```bash
# Database
DATABASE_URL=postgres://user@localhost:5432/primeprints

# Payload
PAYLOAD_SECRET=<your-32-character-random-secret>

# Admin (optional - defaults provided)
PAYLOAD_ADMIN_EMAIL=admin@example.com
PAYLOAD_ADMIN_PASSWORD=ChangeMe123!
```

### 4. Verify Environment ✓
- [ ] `.env.local` created in project root
- [ ] `DATABASE_URL` points to valid PostgreSQL database
- [ ] `PAYLOAD_SECRET` is a long random string (32+ chars)
- [ ] Admin credentials are set

Generate a secure PAYLOAD_SECRET:
```bash
openssl rand -base64 32
```

## First Run

### 5. Start Development Server ✓

```bash
pnpm dev
```

On first run, the app will automatically:
- Create Payload database schema
- Seed admin user
- Seed demo categories and products

### 6. Verify Health Check ✓

Test the admin health endpoint:

```bash
curl http://localhost:3000/api/admin-health
```

Expected response:
```json
{
  "ok": true,
  "status": "HEALTHY",
  "checks": {
    "environment": { "ok": true, "message": "Environment variables configured" },
    "database": { "ok": true, "message": "Connected to PostgreSQL database" },
    "admin": { "ok": true, "message": "Admin user exists: admin@example.com" },
    "collections": { "ok": true, "message": "Categories: X docs, Products: Y docs" }
  }
}
```

If health check fails:
- Review error messages in `checks`
- See **Troubleshooting** section below
- Check server console for detailed error logs

## Admin Panel Access

### 7. Login to Admin ✓

1. Navigate to: `http://localhost:3000/admin`
2. Login with credentials:
   - Email: (your `PAYLOAD_ADMIN_EMAIL`)
   - Password: (your `PAYLOAD_ADMIN_PASSWORD`)

### 8. Verify Admin Features ✓

Test each admin feature:
- [ ] **Users**: View admin user in Users collection
- [ ] **Categories**: See 3 demo categories (Paper Products, Large Format, Garment)
- [ ] **Products**: See 3 demo products with images and metadata

### 9. Seed Demo Data (Optional) ✓

If you want to reseed demo data:

```bash
curl -X POST http://localhost:3000/api/seed-demo
```

Response should show:
```json
{
  "ok": true,
  "message": "Demo data seeded successfully",
  "categories": 3,
  "products": 3
}
```

## Storefront Verification

### 10. Test Storefront Pages ✓

Visit these pages to verify data is loading from the database:

- [ ] Homepage: `http://localhost:3000/`
  - Should show hero, categories slider, products carousel
  
- [ ] Categories page: `http://localhost:3000/categories/cat-paper-products`
  - Should show category details and related products
  
- [ ] Product page: `http://localhost:3000/products/prd-premium-business-cards`
  - Should show product details, images, description

If pages show "No data found" or 404:
- Ensure seed endpoint was triggered (see step 9)
- Check health endpoint (see step 6)
- Verify DATABASE_URL and data access in `src/lib/d1.ts`

## Optional: Image Uploads

### 11. Configure Cloudflare R2 (Optional) ✓

For image upload functionality to Cloudflare R2:

1. Add R2 credentials to `.env.local`:
```bash
R2_ACCOUNT_ID=your-account-id
R2_BUCKET=your-bucket-name
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

2. Test upload endpoint:
```bash
curl -X POST http://localhost:3000/api/r2/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=products"
```

## Troubleshooting

### Admin Login Issues

**Problem**: Cannot log in to admin panel

**Solutions**:
1. Verify admin user exists:
   ```bash
   psql $DATABASE_URL -c "SELECT email FROM users LIMIT 1;"
   ```

2. Reset admin credentials via seed:
   ```bash
   curl -X POST http://localhost:3000/api/seed-demo
   ```

3. Check app logs for authentication errors (console output)

### Database Connection Issues

**Problem**: "Cannot connect to database" or "CONNECTION_URI_ERROR"

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   pg_isready -h localhost -p 5432
   ```

2. Test connection string:
   ```bash
   psql $DATABASE_URL -c "\dt"
   ```

3. Create database if missing:
   ```bash
   createdb primeprints
   ```

4. Restart dev server:
   ```bash
   # Kill current process with Ctrl+C
   pnpm dev
   ```

### Missing Environment Variables

**Problem**: "DATABASE_URL is required" or "PAYLOAD_SECRET is required"

**Solutions**:
1. Verify `.env.local` exists in project root
2. Check for typos in variable names (must match exactly)
3. Reload terminal: `source ~/.bashrc` or restart IDE
4. Restart dev server after changing `.env.local`

### No Demo Data In Admin

**Problem**: Collections are empty despite starting the app

**Solutions**:
1. Trigger seed manually:
   ```bash
   curl -X POST http://localhost:3000/api/seed-demo
   ```

2. Check seed function doesn't have guards:
   - Edit `src/payload/seed.ts`
   - Verify `demoCategories` and `demoProducts` are defined
   - Check for database connection errors in server logs

### Rich Text Not Rendering

**Problem**: Product descriptions show JSON instead of formatted text

**Solutions**:
1. Verify `normalizeRichText()` in `src/lib/d1.ts` is working
2. Check that frontend pages are calling the normalization function
3. Inspect page source to see raw data (browser DevTools > Network)
4. Check for console errors in browser DevTools

## Post-Startup Tasks

### 12. Backup & Security ✓

- [ ] Set strong, unique `PAYLOAD_SECRET` in production
- [ ] Configure database backups (PostgreSQL pg_dump or cloud provider)
- [ ] Set up monitoring for database health
- [ ] Enable HTTPS in production
- [ ] Rotate admin passwords periodically

### 13. Deployment Preparation ✓

- [ ] Document all required environment variables
- [ ] Test `.env.local` settings in production environment
- [ ] Set up CI/CD pipeline if using (GitHub Actions, etc.)
- [ ] Configure CDN for static assets and R2 images
- [ ] Test health endpoint in production

### 14. Documentation ✓

- [ ] Read [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed admin features
- [ ] Review [README.md](./README.md) for project overview
- [ ] Bookmark [Payload CMS docs](https://payloadcms.com/docs) for reference
- [ ] Bookmark [Next.js docs](https://nextjs.org/docs) for reference

## Help & Support

### Quick Links

- **Admin Health Check**: `GET http://localhost:3000/api/admin-health`
- **Seed Endpoint**: `POST http://localhost:3000/api/seed-demo`
- **Admin Panel**: `http://localhost:3000/admin`
- **Storefront**: `http://localhost:3000/`

### Common Commands

```bash
# Start development server
pnpm dev

# Install dependencies
pnpm install

# Build for production
pnpm build

# Start production server
pnpm start

# Run database health check
curl http://localhost:3000/api/d1-health

# Run admin health check
curl http://localhost:3000/api/admin-health

# Seed demo data
curl -X POST http://localhost:3000/api/seed-demo

# View PostgreSQL database
psql $DATABASE_URL

# List all tables
psql $DATABASE_URL -c "\dt"

# Query users
psql $DATABASE_URL -c "SELECT * FROM users;"
```

### Getting Help

1. **Check console logs**: Look for detailed error messages
2. **Run health check**: `curl http://localhost:3000/api/admin-health`
3. **Review ADMIN_SETUP.md**: Comprehensive troubleshooting guide
4. **Check PostgreSQL**: `psql $DATABASE_URL`
5. **Inspect network**: Browser DevTools > Network tab

---

**Version**: 1.0  
**Last Updated**: 2026-04-13  
**Status**: Production Ready ✓
