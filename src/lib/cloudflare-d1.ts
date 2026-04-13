type D1ResponseRow = Record<string, unknown>;

type D1QueryResult = {
  success: boolean;
  results?: D1ResponseRow[];
  meta?: Record<string, unknown>;
};

type D1ApiEnvelope = {
  success: boolean;
  errors?: Array<{ message?: string }>;
  result?: D1QueryResult[];
};

function getD1Config() {
  const accountId = process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || '';
  const databaseId = process.env.CF_D1_DATABASE_ID || process.env.CLOUDFLARE_D1_DATABASE_ID || '';
  const apiToken = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || '';

  if (!accountId || !databaseId || !apiToken) {
    throw new Error('Missing Cloudflare D1 API credentials (CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_API_TOKEN).');
  }

  return { accountId, databaseId, apiToken };
}

export async function d1Query<T extends D1ResponseRow = D1ResponseRow>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const { accountId, databaseId, apiToken } = getD1Config();
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`D1 query failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as D1ApiEnvelope;
  if (!data.success) {
    const message = data.errors?.map((item) => item.message).filter(Boolean).join(', ') || 'Unknown D1 API error';
    throw new Error(message);
  }

  const result = data.result?.[0];
  if (!result?.success) {
    throw new Error('D1 query did not return a successful result.');
  }

  return (result.results ?? []) as T[];
}

export async function d1Execute(sql: string, params: unknown[] = []): Promise<void> {
  await d1Query(sql, params);
}
