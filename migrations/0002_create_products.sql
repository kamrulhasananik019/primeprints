-- Migration: Create categories and products tables
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  image TEXT,
  tag TEXT,
  description TEXT NOT NULL,
  shortDescription TEXT,
  longDescription TEXT,
  accent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  shortDescription TEXT,
  longDescription TEXT,
  details TEXT,
  images TEXT NOT NULL,
  specs TEXT NOT NULL,
  status TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(slug)
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
