import { NextRequest } from "next/server";
import { withAuth } from "../functions";
import { GoogleGenAI } from "@google/genai";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const { imageBase64,localization } = await req.json();

      if (!imageBase64) {
        return ApiError("Missing or invalid image", 400);
      }

      // Extract the actual base64 data from the data URI if necessary
      const base64Data = imageBase64.replace(
        /^data:image\/(png|jpeg|jpg|webp);base64,/,
        "",
      );

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
              {
                text:
                  "Analyze this image of food and estimate its macros. " +
                  "Use language from parameter here: "+localization+ "Only translate error and name, everything else needs to be in english." +
                  "Return ONLY a valid JSON object. If the image contains a food item, set the 'isFood' field to true and estimate its macros. If the image does NOT contain food, or if the food cannot be recognized, set the 'isFood' field to false and include an 'error' field with a descriptive message explaining what is wrong (e.g. \"The image does not contain any food\", \"The image is too blurry\", etc.).\n" +
                  "Format for food:\n" +
                  "{\n" +
                  "  \"isFood\": true,\n" +
                  "  \"name\": \"Food name\",\n" +
                  "  \"calories_per_100g\": 0,\n" +
                  "  \"fat\": 0,\n" +
                  "  \"protein\": 0,\n" +
                  "  \"sugar\": 0,\n" +
                  "  \"carbohydrates\": 0,\n" +
                  "  \"fiber\": 0,\n" +
                  "  \"salt\": 0\n" +
                  "}\n" +
                  "Format when not food:\n" +
                  "{\n" +
                  "  \"isFood\": false,\n" +
                  "  \"error\": \"Descriptive error message\"\n" +
                  "}",
              },
            ],
          },
        ],
        config: {
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
      return ApiError(error instanceof Error ? error.message : "Failed to analyze image", 500);
    }
  });
}
