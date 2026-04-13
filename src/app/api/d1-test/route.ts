import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllTables, 
  getTableInfo, 
  getTableData, 
  getHealthcheckRows,
  insertHealthcheck 
} from '@/lib/d1';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'all';
    const table = searchParams.get('table');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // Show all available endpoints and actions
    if (action === 'help') {
      return NextResponse.json({
        message: 'D1 Test API',
        endpoints: {
          'GET /api/d1-test?action=all': 'Get all tables and their data',
          'GET /api/d1-test?action=tables': 'List all tables',
          'GET /api/d1-test?action=health': 'Get healthcheck data',
          'GET /api/d1-test?action=table&table=TABLE_NAME': 'Get specific table data',
          'GET /api/d1-test?action=schema&table=TABLE_NAME': 'Get table schema',
          'GET /api/d1-test?action=help': 'Show this help message',
        },
        inserted_record_example: 'POST /api/d1-test with body: { "action": "insert" }',
      });
    }

    // Get all tables
    if (action === 'tables') {
      const tables = await getAllTables();
      return NextResponse.json({
        action: 'tables',
        tables: tables.map((t) => t.name),
      });
    }

    // Get specific table schema
    if (action === 'schema' && table) {
      const schema = await getTableInfo(table);
      return NextResponse.json({
        action: 'schema',
        table,
        schema,
      });
    }

    // Get healthcheck data
    if (action === 'health') {
      const data = await getHealthcheckRows(limit);
      return NextResponse.json({
        action: 'health',
        count: data.length,
        data,
      });
    }

    // Get specific table data
    if (action === 'table' && table) {
      const data = await getTableData(table, limit);
      return NextResponse.json({
        action: 'table',
        table,
        count: data.length,
        limit,
        data,
      });
    }

    // Get everything (default)
    if (action === 'all') {
      const tables = await getAllTables();
      const allData: Record<string, unknown[]> = {};

      for (const { name } of tables) {
        const data = await getTableData(name, limit);
        const schema = await getTableInfo(name);
        allData[name] = {
          schema,
          data,
        };
      }

      return NextResponse.json({
        action: 'all',
        tables: tables.map((t) => t.name),
        data: allData,
      });
    }

    return NextResponse.json({
      error: 'Unknown action',
      hint: 'Use ?action=help for available actions',
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'insert';

    if (action === 'insert') {
      const status = body.status || 'ok';
      const result = await insertHealthcheck(status);
      
      return NextResponse.json({
        action: 'insert',
        success: true,
        inserted: result,
      });
    }

    return NextResponse.json({
      error: 'Unknown action',
      availableActions: ['insert'],
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
