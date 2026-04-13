import type { Category, Product } from '@/data/categories';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/categories?slug=${slug}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products?slug=${slug}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?category=${category}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}
