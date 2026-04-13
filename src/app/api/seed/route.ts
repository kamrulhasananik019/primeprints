import { NextResponse } from 'next/server';
import { categories } from '@/data/categories';
import { allProducts } from '@/data/products';
import { runD1Query } from '@/lib/d1';

export const dynamic = 'force-dynamic';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function seedDatabase() {
  const results = {
    categories: 0,
    products: 0,
    descriptions: 0,
    blocks: 0,
    images: 0,
    specs: 0,
    errors: [] as string[],
  };

  try {
    // Seed categories
    for (const category of categories) {
      try {
        await runD1Query(
          `INSERT OR REPLACE INTO categories (id, slug, title, image, tag, description, accent)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
          [
            category.id,
            category.slug,
            category.title,
            category.image || null,
            category.tag || null,
            category.description,
            category.accent || null,
          ]
        );
        results.categories++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Category ${category.id}: ${errorMessage}`);
      }
    }

    // Seed products with normalized data
    for (const product of allProducts) {
      try {
        // Insert product
        await runD1Query(
          `INSERT OR REPLACE INTO products (id, slug, name, title, category, status)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
          [
            product.id,
            product.slug,
            product.name,
            product.title || null,
            product.category,
            product.status || null,
          ]
        );
        results.products++;

        // Insert images
        if (product.images && Array.isArray(product.images)) {
          for (let i = 0; i < product.images.length; i++) {
            const img = product.images[i];
            await runD1Query(
              `INSERT INTO product_images (id, product_id, url, alt, is_primary, order_index)
               VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
              [
                generateId(),
                product.id,
                img.url,
                img.alt,
                img.isPrimary ? 1 : 0,
                i,
              ]
            );
            results.images++;
          }
        }

        // Insert specs
        if (product.specs && typeof product.specs === 'object') {
          for (const [key, value] of Object.entries(product.specs)) {
            await runD1Query(
              `INSERT INTO product_specs (id, product_id, spec_key, spec_value)
               VALUES (?1, ?2, ?3, ?4)`,
              [generateId(), product.id, key, value]
            );
            results.specs++;
          }
        }

        // Insert descriptions - normalize different description types
        const descriptionTypes = [
          { key: 'shortDescription', type: 'short' },
          { key: 'longDescription', type: 'long' },
          { key: 'details', type: 'details' },
        ];

        for (const { key, type } of descriptionTypes) {
          const descContent = (product as any)[key];
          if (!descContent) continue;

          const descId = generateId();
          await runD1Query(
            `INSERT INTO product_descriptions (id, product_id, type) VALUES (?1, ?2, ?3)`,
            [descId, product.id, type]
          );
          results.descriptions++;

          // Parse description blocks
          let blocks: Array<{ type: string; content: any }> = [];

          if (typeof descContent === 'string') {
            // Simple text
            blocks.push({ type: 'text', content: { content: descContent } });
          } else if (Array.isArray(descContent)) {
            // Complex structure with mixed types
            blocks = descContent.map((block: any) => {
              if (typeof block === 'string') {
                return { type: 'text', content: { content: block } };
              }
              return {
                type: block.type || 'text',
                content: block,
              };
            });
          }

          // Insert blocks
          for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            await runD1Query(
              `INSERT INTO description_blocks (id, description_id, block_type, order_index, content)
               VALUES (?1, ?2, ?3, ?4, ?5)`,
              [generateId(), descId, block.type, i, JSON.stringify(block.content)]
            );
            results.blocks++;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Product ${product.id}: ${errorMessage}`);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }

  return { success: true, ...results };
}

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed the database',
    endpoint: 'POST /api/seed',
  });
}
