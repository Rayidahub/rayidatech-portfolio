import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'services';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Verify file type
    const validMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload a PNG, JPG, WebP, GIF, or SVG.' },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const filename = `${Date.now()}-${safeName}`;

    // 1. Try uploading to Supabase Storage if bucket is configured
    try {
      const supabase = await createClient();
      const storagePath = `${folder}/${filename}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('hero-slides')
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!storageError && storageData) {
        const { data: publicUrlData } = supabase.storage
          .from('hero-slides')
          .getPublicUrl(storagePath);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            provider: 'supabase',
          });
        }
      }
    } catch {
      // Fallback to local storage below
    }

    // 2. Fallback: Save file locally in public/uploads/[folder]
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      provider: 'local',
    });
  } catch (error: unknown) {
    console.error('File upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
