import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/cloudflare-d1';

/**
 * Health check endpoint for admin setup
 * Verifies Cloudflare D1 + admin tables + content tables
 */
export async function GET() {
  try {
    const checks = {
      environment: { ok: false, message: '' },
      database: { ok: false, message: '' },
      admin: { ok: false, message: '' },
      collections: { ok: false, message: '' },
    };

    if (!process.env.CF_ACCOUNT_ID || !process.env.CF_D1_DATABASE_ID || !process.env.CF_API_TOKEN) {
      checks.environment.message = 'Missing CF_ACCOUNT_ID / CF_D1_DATABASE_ID / CF_API_TOKEN in .env.local';
    } else {
      checks.environment.ok = true;
      checks.environment.message = 'Environment variables configured';
    }

    if (!checks.environment.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: 'FAILED',
          checks,
          setupGuide: 'See ADMIN_SETUP.md for configuration instructions',
        },
        { status: 503 }
      );
    }

    try {
      await d1Query('SELECT 1 AS ok');
      checks.database.ok = true;
      checks.database.message = 'Connected to Cloudflare D1';

      const admins = await d1Query<{ email: string }>('SELECT email FROM admins LIMIT 1');
      if (admins.length > 0) {
        checks.admin.ok = true;
        checks.admin.message = `Admin user exists: ${admins[0].email}`;
      } else {
        checks.admin.ok = false;
        checks.admin.message = 'No admin user found in admins table.';
      }

      const [categories, products] = await Promise.all([
        d1Query<{ count: number }>('SELECT COUNT(*) AS count FROM categories'),
        d1Query<{ count: number }>('SELECT COUNT(*) AS count FROM products'),
      ]);

      checks.collections.ok = true;
      checks.collections.message = `Categories: ${Number(categories[0]?.count || 0)} docs, Products: ${Number(products[0]?.count || 0)} docs`;
    } catch (dbError) {
      checks.database.ok = false;
      checks.database.message = dbError instanceof Error ? dbError.message : 'Database connection failed';
      checks.admin.ok = false;
      checks.admin.message = 'Could not verify admin user (database error)';
      checks.collections.ok = false;
      checks.collections.message = 'Could not verify collections (database error)';
    }

    const allOk = Object.values(checks).every((check) => check.ok);

    return NextResponse.json(
      {
        ok: allOk,
        status: allOk ? 'HEALTHY' : 'DEGRADED',
        checks,
        nextSteps: !allOk
          ? [
              'Review the checks above for failures',
              'Run: curl -X POST http://localhost:3000/api/seed-demo',
            ]
          : ['Visit /admin/login to access the custom admin panel'],
      },
      { status: allOk ? 200 : 503 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        status: 'ERROR',
        error: errorMessage,
        setupGuide: 'See ADMIN_SETUP.md for configuration instructions',
      },
      { status: 500 }
    );
  }
}
