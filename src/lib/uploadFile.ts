export interface UploadResult {
  url: string;
  filename: string;
  mime_type: string;
  size: number;
}

/**
 * Upload a file to Cloudinary (unsigned) and return the hosted metadata.
 * Falls back to a plain object URL (blob) for local preview only if
 * Cloudinary is not configured — callers should detect the fallback and
 * warn the user that the link won't persist across sessions.
 */
export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary n'est pas configuré.\n" +
      "Ajoute NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET dans .env.local.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    xhr.upload.onprogress = e => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url:       data.secure_url,
          filename:  file.name,
          mime_type: file.type || "application/octet-stream",
          size:      data.bytes ?? file.size,
        });
      } else {
        reject(new Error(`Cloudinary error ${xhr.status}: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Erreur réseau lors de l'upload."));
    xhr.send(formData);
  });
}

export const cloudinaryConfigured =
  !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
