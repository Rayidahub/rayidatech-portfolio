// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { requireAdminSession } from '@/lib/supabase/auth-guard';

const ALLOWED_FOLDERS = ['services', 'hero', 'blog', 'avatars', 'projects'];

const ALLOWED_MIME_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/svg+xml': ['.svg'],
};

// SVG XSS filter checking for malicious tags and event handlers
function isDangerousSvg(buffer: Buffer): boolean {
  const content = buffer.toString('utf-8').toLowerCase();
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /xlink:href\s*=\s*["']javascript:/i,
    /\bon\w+\s*=/i, // onload, onerror, onclick, etc.
    /<foreignobject/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(content));
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate admin user
    const auth = await requireAdminSession();
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required to upload files.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawFolder = (formData.get('folder') as string) || 'services';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. Strict folder whitelisting (prevents directory traversal)
    const folder = ALLOWED_FOLDERS.includes(rawFolder.toLowerCase().trim())
      ? rawFolder.toLowerCase().trim()
      : 'services';

    // 3. MIME type & extension validation
    const allowedExts = ALLOWED_MIME_EXTENSIONS[file.type];
    if (!allowedExts) {
      return NextResponse.json(
        { error: 'Invalid file format. Allowed formats: PNG, JPG, WebP, GIF, SVG.' },
        { status: 400 }
      );
    }

    const originalName = file.name.toLowerCase();
    const hasValidExt = allowedExts.some((ext) => originalName.endsWith(ext));
    if (!hasValidExt) {
      return NextResponse.json(
        { error: 'File extension does not match expected image MIME type.' },
        { status: 400 }
      );
    }

    // 4. File size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. SVG Sanitization check to prevent Stored XSS
    if (file.type === 'image/svg+xml' && isDangerousSvg(buffer)) {
      return NextResponse.json(
        { error: 'Malicious SVG payload detected. SVG files must not contain scripts or executable handlers.' },
        { status: 400 }
      );
    }

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const filename = `${Date.now()}-${safeName}`;

    // 6. Upload to Supabase Storage if bucket is configured
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

    // 7. Fallback: Save file locally in public/uploads/[folder]
    const uploadDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads', folder);
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
