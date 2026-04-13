import { NextResponse } from 'next/server';

import { buildR2ObjectKey, getMaxUploadBytes, uploadObjectToR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'uploads');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: 'Missing file. Use multipart/form-data with a file field named "file".' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { ok: false, error: 'File is empty.' },
        { status: 400 }
      );
    }

    const maxUploadBytes = getMaxUploadBytes();
    if (file.size > maxUploadBytes) {
      return NextResponse.json(
        {
          ok: false,
          error: `File is too large. Max allowed is ${maxUploadBytes} bytes.`,
        },
        { status: 413 }
      );
    }

    const key = buildR2ObjectKey({
      folder,
      originalName: file.name,
      mimeType: file.type,
    });

    const uploadResult = await uploadObjectToR2({
      key,
      body: await file.arrayBuffer(),
      contentType: file.type || 'application/octet-stream',
      contentLength: file.size,
      cacheControl: 'public, max-age=31536000, immutable',
    });

    return NextResponse.json({
      ok: true,
      key: uploadResult.key,
      url: uploadResult.url,
      size: file.size,
      type: file.type || 'application/octet-stream',
      originalName: file.name,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upload error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
