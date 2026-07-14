import { NextRequest } from "next/server";
import { withAuth } from "../functions";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  return withAuth(req, async (request, authData) => {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query") || "";

    if (!query.trim()) {
      return ApiSuccess([], 200);
    }

    if (!GEMINI_API_KEY) {
      logger.error("GEMINI_API_KEY environment variable is not defined");
      return ApiError("Gemini API key is not configured", 500);
    }

    try {
      const systemInstruction =
        "You are a precise nutrition analyzer. Your job is to analyze the food items in the query.\n" +
        "1. Identify all food items mentioned in the query (can be multiple items).\n" +
        "2. If a weight or portion size is not specified for a food item (e.g. 'apple' or 'chicken'), guess a standard, single-person portion size and weight (in grams) for that item (e.g., an average red apple weighs 180 grams, a standard chicken breast portion is 150 grams).\n" +
        "3. If a weight is specified (e.g. '200g chicken' or '100g rice'), use that exact weight.\n" +
        "4. Calculate the total calories, protein, carbohydrates, fat, fiber, sugar, and salt in grams for that estimated or specified portion weight.\n" +
        "5. Return a JSON array matching the requested schema.";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Food Query: ${query}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING", description: "Standardized food name" },
                weight: { type: "NUMBER", description: "Weight of the portion in grams" },
                calories: { type: "NUMBER", description: "Total calories for the portion weight in kcal" },
                fat: { type: "NUMBER", description: "Total fat for the portion weight in grams" },
                protein: { type: "NUMBER", description: "Total protein for the portion weight in grams" },
                carbohydrates: { type: "NUMBER", description: "Total carbohydrates for the portion weight in grams" },
                fiber: { type: "NUMBER", description: "Total fiber for the portion weight in grams" },
                sugar: { type: "NUMBER", description: "Total sugar for the portion weight in grams" },
                salt: { type: "NUMBER", description: "Total salt for the portion weight in grams" },
              },
              required: ["name", "weight", "calories", "fat", "protein", "carbohydrates", "fiber", "sugar", "salt"],
            },
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text from Gemini");
      }

      const foods = JSON.parse(text);
      return ApiSuccess(foods, 200);
    } catch (error) {
      logger.error("Failed to analyze food via Gemini", error);
      return ApiError("Internal server error during food analysis", 500);
    }
  });
};
