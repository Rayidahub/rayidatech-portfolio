import { createClient } from '@/lib/supabase/browser';

const BUCKET_NAME = 'hero-slides';

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateStoragePath(file: File): string {
  const timestamp = Date.now();
  const safeName = sanitizeFileName(file.name);
  return `${timestamp}-${safeName}`;
}

export async function uploadHeroSlideImage(
  file: File,
  path?: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  const filePath = path ?? generateStoragePath(file);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: !!path,
    });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return { url: data.publicUrl, error: null };
}

export function extractStoragePathFromUrl(url: string): string | null {
  try {
    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.slice(index + marker.length);
  } catch {
    return null;
  }
}

export async function deleteHeroSlideImage(url: string): Promise<string | null> {
  const path = extractStoragePathFromUrl(url);
  if (!path) return null;

  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  return error?.message ?? null;
}
