ALTER TABLE categories ADD COLUMN slug TEXT;
ALTER TABLE products ADD COLUMN slug TEXT;

UPDATE categories
SET slug = LOWER(REPLACE(TRIM(name), ' ', '-'))
WHERE slug IS NULL OR slug = '';

UPDATE products
SET slug = LOWER(REPLACE(TRIM(name), ' ', '-'))
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
