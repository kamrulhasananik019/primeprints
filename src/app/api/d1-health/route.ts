import { NextResponse } from 'next/server';

import { getHealthcheckRows } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await getHealthcheckRows(5);

    return NextResponse.json({
      ok: true,
      count: rows.length,
      rows,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
