-- Normalized schema for flexible content management
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_descriptions;
DROP TABLE IF EXISTS description_blocks;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_specs;
DROP TABLE IF EXISTS categories;

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  image TEXT,
  tag TEXT,
  description TEXT NOT NULL,
  accent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Products table (core data only)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  category TEXT NOT NULL,
  status TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(slug)
);

-- Product descriptions - flexible for different types
CREATE TABLE product_descriptions (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'short', 'long', 'details', 'meta'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Description blocks - individual content blocks
CREATE TABLE description_blocks (
  id TEXT PRIMARY KEY,
  description_id TEXT NOT NULL,
  block_type TEXT NOT NULL, -- 'text', 'list', 'faq'
  order_index INTEGER NOT NULL,
  content TEXT NOT NULL, -- JSON for flexibility
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (description_id) REFERENCES product_descriptions(id) ON DELETE CASCADE
);

-- Product images
CREATE TABLE product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT 0,
  order_index INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product specs as key-value pairs
CREATE TABLE product_specs (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_product_descriptions_product ON product_descriptions(product_id);
CREATE INDEX idx_description_blocks_description ON description_blocks(description_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_specs_product ON product_specs(product_id);
