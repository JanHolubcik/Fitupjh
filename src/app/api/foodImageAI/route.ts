import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../functions";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
    try {
      const { imageBase64 } = await req.json();

      if (!imageBase64) {
        return new NextResponse("Missing or invalid image", { status: 400 });
      }

      // Extract the actual base64 data from the data URI if necessary
      const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
              { text: "Analyze this image of food and estimate its macros. Return ONLY a valid JSON object in the following format, with no markdown or extra text: {\"name\": \"Food name\", \"calories_per_100g\": 0, \"fat\": 0, \"protein\": 0, \"sugar\": 0, \"carbohydrates\": 0, \"fiber\": 0, \"salt\": 0}. If it is not food, return an object with zeros." }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response from AI");
      }
      
      const result = JSON.parse(responseText);

      return NextResponse.json(result);
    } catch (error) {
      console.error("AI Image Analysis Error:", error);
      return NextResponse.json(
        { error: "Failed to analyze image" },
        { status: 500 }
      );
    }
  });
}
