import { NextRequest } from "next/server";
import { withAuth } from "../functions";
import { GoogleGenAI } from "@google/genai";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const ALLOWED_LOCALES = ["en", "sk"] as const;
const MAX_BASE64_SIZE = 10 * 1024 * 1024; // 10 MB

const ANALYSIS_PROMPT =
  "Analyze this image of food and estimate its macros. " +
  "Return ONLY a valid JSON object. If the image contains a food item, set the 'isFood' field to true and estimate its macros. If the image does NOT contain food, or if the food cannot be recognized, set the 'isFood' field to false and include an 'error' field with a descriptive message explaining what is wrong (e.g. \"The image does not contain any food\", \"The image is too blurry\", etc.).\n" +
  "Format for food:\n" +
  "{\n" +
  '  "isFood": true,\n' +
  '  "name": "Food name",\n' +
  '  "calories_per_100g": 0,\n' +
  '  "fat": 0,\n' +
  '  "protein": 0,\n' +
  '  "sugar": 0,\n' +
  '  "carbohydrates": 0,\n' +
  '  "fiber": 0,\n' +
  '  "salt": 0\n' +
  "}\n" +
  "Format when not food:\n" +
  "{\n" +
  '  "isFood": false,\n' +
  '  "error": "Descriptive error message"\n' +
  "}";

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const { imageBase64, localization } = await req.json();

      if (!imageBase64 || typeof imageBase64 !== "string") {
        return ApiError("Missing or invalid image", 400);
      }

      // Validate base64 payload size to prevent memory exhaustion
      if (imageBase64.length > MAX_BASE64_SIZE) {
        return ApiError("Image too large. Maximum size is 10 MB", 400);
      }

      // Validate localization against allow-list to prevent prompt injection
      const safeLocale = ALLOWED_LOCALES.includes(
        localization as (typeof ALLOWED_LOCALES)[number],
      )
        ? (localization as string)
        : "en";

      // Extract the actual base64 data from the data URI if necessary
      const base64Data = imageBase64.replace(
        /^data:image\/(png|jpeg|jpg|webp|gif);base64,/,
        "",
      );

      // Decode base64 and validate magic bytes to ensure it's actually an image
      const binaryStr = atob(base64Data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const IMAGE_SIGNATURES: [number[], string][] = [
        [[0xff, 0xd8, 0xff], "image/jpeg"],
        [[0x89, 0x50, 0x4e, 0x47], "image/png"],
        [[0x52, 0x49, 0x46, 0x46], "image/webp"],
        [[0x47, 0x49, 0x46, 0x38], "image/gif"],
      ];

      const detectedMime = IMAGE_SIGNATURES.find(([sig]) =>
        sig.every((b, i) => bytes[i] === b),
      )?.[1];

      if (!detectedMime) {
        return ApiError("File is not a valid image", 400);
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { data: base64Data, mimeType: detectedMime } },
              { text: ANALYSIS_PROMPT },
            ],
          },
        ],
        config: {
          systemInstruction:
            `You respond in the language: ${safeLocale}. Only translate the "error" and "name" fields, everything else must be in English. ` +
            "All JSON keys must remain in English.",
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response from AI");
      }

      const result = JSON.parse(responseText);

      if (result.isFood === false) {
        return ApiError(result.error || "The image does not contain food.", 400);
      }

      return ApiSuccess(result);
    } catch (error) {
      logger.error("AI Image Analysis Error:", error);
      return ApiError("Failed to analyze image", 500);
    }
  });
}
