import { put } from "@vercel/blob";
import { NextRequest } from "next/server";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { withAuth } from "../functions";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

// Magic bytes signatures for allowed image types
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
};

const matchesMagicBytes = (buffer: Uint8Array, mimeType: string): boolean => {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;

  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte),
  );
};

const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_") // strip path traversal & special chars
    .replace(/\.{2,}/g, "."); // collapse consecutive dots
};

export async function POST(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const form = await request.formData();
      const file = form.get("file") as File;

      if (!file) {
        return ApiError("No file provided", 400);
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return ApiError("File too large. Maximum size is 10 MB", 400);
      }

      // Validate MIME type (reject SVG and non-image types)
      const mimeType = file.type.toLowerCase();
      if (!ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])) {
        return ApiError("Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed", 400);
      }

      // Derive a safe extension — if original filename has a valid one, keep it;
      // otherwise fall back to the MIME type (handles compressed blobs with no extension)
      const MIME_TO_EXT: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
      };
      const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];
      const originalExt = file.name.split(".").pop()?.toLowerCase();
      const safeExtension =
        originalExt && ALLOWED_EXTENSIONS.includes(originalExt)
          ? originalExt
          : MIME_TO_EXT[mimeType];

      // Validate magic bytes to prevent MIME type spoofing
      const buffer = new Uint8Array(await file.arrayBuffer());
      if (!matchesMagicBytes(buffer, mimeType)) {
        return ApiError("File content does not match its declared type", 400);
      }

      const baseName = sanitizeFilename(file.name.replace(/\.[^.]+$/, "")) || "upload";
      const safeName = `${baseName}.${safeExtension}`;

      const blob = await put(safeName, new Blob([buffer], { type: mimeType }), {
        access: "public",
        addRandomSuffix: true,
        contentType: mimeType,
      });

      return ApiSuccess({ imageUrl: blob.url });
    } catch (error) {
      logger.error("Upload Error:", error);
      return ApiError("Upload failed", 500);
    }
  });
}
