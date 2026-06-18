import { NextRequest } from "next/server";
import { withAuth } from "../functions";
import { FoodType } from "@/types/Types";
import { GoogleGenAI } from "@google/genai";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

type AIRequest = {
  message: string;
  savedFood: Record<string, FoodType>;
};
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const { message, savedFood } = (await req.json()) as AIRequest;

      if (!message || message.length === 0) {
        return ApiError("Missing or invalid message", 400);
      }

      const structuredPrompt = `    
      Data for Context:
      ${savedFood ? JSON.stringify(savedFood, null, 2) : "No macro data provided."}
    `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: structuredPrompt,
        config: {
          systemInstruction:
            "You are a strict, concise food intake analyzer. Your only job is to review the food the user ate. " +
            "Provide a brief evaluation: praise them for healthy habits, or give a warning about unhealthy habits with actionable advice on what they should do better. " +
            "With message you will also receive an object with food and food macros that the user consumed, try to give him advice about what food he can replace with healthier options." +
            "With macros provided you can also tell user if his intake macros are within healthy ranges." +
            "Response shouldn't be longer than 250 words." +
            "Use mark up, make point about every macro." +
            "CRITICAL RULE: Do not ask any follow-up questions under any circumstances. Provide your review and then stop talking.",
        },
      });

      return ApiSuccess(response.text);
    } catch (error) {
      logger.error("AI Generation Response Error:", error);
      return ApiError("Failed to generate AI response", 500);
    }
  });
}
