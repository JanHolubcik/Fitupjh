import { put } from "@vercel/blob";
import { NextRequest } from "next/server";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;

    if (!file) {
      return ApiError("No file provided", 400);
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    return ApiSuccess({ imageUrl: blob.url });
  } catch (error) {
    logger.error("Upload Error:", error);
    return ApiError("Upload failed", 500);
  }
}
