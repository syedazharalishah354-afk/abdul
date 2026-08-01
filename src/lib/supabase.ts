import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'YOUR_SUPABASE_URL' && 
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a base64 image or File object to a Supabase Storage bucket and returns its public URL.
 * Falls back to returning the preview data URL if Supabase client/bucket is unavailable.
 */
export async function uploadImageToSupabaseStorage(
  fileOrBase64: File | string | undefined | null,
  bucketName: 'cnic-documents' | 'payment-proofs',
  fileNamePrefix: string
): Promise<string | undefined> {
  if (!fileOrBase64) return undefined;

  // If already a remote URL, return as is
  if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('http')) {
    return fileOrBase64;
  }

  if (!isSupabaseConfigured() || !supabase) {
    // If Supabase not configured, store/return base64 string directly
    return typeof fileOrBase64 === 'string' ? fileOrBase64 : undefined;
  }

  try {
    let fileToUpload: Blob;
    let extension = 'png';

    if (fileOrBase64 instanceof File) {
      fileToUpload = fileOrBase64;
      extension = fileOrBase64.name.split('.').pop() || 'png';
    } else if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:image/')) {
      // Convert base64 Data URL to Blob
      const parts = fileOrBase64.split(';');
      const mime = parts[0].split(':')[1];
      extension = mime.split('/')[1] || 'png';
      const base64Data = atob(parts[1].split(',')[1]);
      const arrayBuffer = new ArrayBuffer(base64Data.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < base64Data.length; i++) {
        uint8Array[i] = base64Data.charCodeAt(i);
      }
      fileToUpload = new Blob([uint8Array], { type: mime });
    } else {
      return typeof fileOrBase64 === 'string' ? fileOrBase64 : undefined;
    }

    const uniquePath = `${fileNamePrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(uniquePath, fileToUpload, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Supabase Storage upload warning (${bucketName}):`, uploadError.message);
      return typeof fileOrBase64 === 'string' ? fileOrBase64 : undefined;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uploadData.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Error uploading file to Supabase storage:', err);
    return typeof fileOrBase64 === 'string' ? fileOrBase64 : undefined;
  }
}
