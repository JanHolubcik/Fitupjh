import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import type { Session, User } from "better-auth";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockGenerateContent: vi.fn(),
  },
}));

// Mock withAuth to bypass auth and rate limiting
vi.mock("../functions", () => ({
  withAuth: vi.fn(
    (
      req: NextRequest,
      handler: (
        req: NextRequest,
        authData: { user: User; session: Session },
      ) => Promise<NextResponse>,
    ) => {
      return handler(req, {
        user: { id: "test-user-id" } as User,
        session: { id: "test-session-id" } as Session,
      });
    },
  ),
}));

// Mock the GoogleGenAI SDK
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: (args: Record<string, string | number | boolean | object>) =>
        mocks.mockGenerateContent(args),
    };
  },
}));

type TestFoodImagePayload = {
  imageBase64?: string | null;
  localization?: string | null;
};

describe("POST /api/foodImageAI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: TestFoodImagePayload) => {
    return new NextRequest("http://localhost/api/foodImageAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  // Valid 1x1 pixel PNG base64 string with correct magic bytes
  const validImageBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  it("should return 400 when imageBase64 is missing", async () => {
    const req = createRequest({ localization: "en" });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body).toEqual({ success: false, error: "Missing or invalid image" });
  });

  it("should return 400 when image exceeds 10 MB limit", async () => {
    // Generate a huge string to exceed 10MB
    const hugeString = "a".repeat(10 * 1024 * 1024 + 1);
    const req = createRequest({ imageBase64: hugeString, localization: "en" });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.error).toContain("Image too large");
  });

  it("should return 400 when file magic bytes are invalid (not an image)", async () => {
    // Plain text encoded as base64 (no image signature)
    const invalidImageBase64 = "data:image/png;base64,SGVsbG8gd29ybGQ="; // "Hello world"
    const req = createRequest({ imageBase64: invalidImageBase64, localization: "en" });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.error).toBe("File is not a valid image");
  });

  it("should return 200 and estimated macros when food is recognized by Gemini", async () => {
    const mockResponse = {
      isFood: true,
      name: "Apple",
      calories_per_100g: 52,
      fat: 0.2,
      protein: 0.3,
      sugar: 10.4,
      carbohydrates: 14,
      fiber: 2.4,
      salt: 0,
    };

    mocks.mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockResponse),
    });

    const req = createRequest({ imageBase64: validImageBase64, localization: "sk" });
    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = (await response.json()) as { success: true; data: typeof mockResponse };
    expect(body).toEqual({ success: true, data: mockResponse });
    expect(mocks.mockGenerateContent).toHaveBeenCalled();
  });

  it("should return 400 and AI error message when image does not contain food", async () => {
    const mockResponse = {
      isFood: false,
      error: "Tento obrázok neobsahuje jedlo.",
    };

    mocks.mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockResponse),
    });

    const req = createRequest({ imageBase64: validImageBase64, localization: "sk" });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body).toEqual({ success: false, error: "Tento obrázok neobsahuje jedlo." });
  });

  it("should return 500 when Gemini API fails", async () => {
    mocks.mockGenerateContent.mockRejectedValue(new Error("Gemini quota exceeded"));

    const req = createRequest({ imageBase64: validImageBase64, localization: "en" });
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.error).toBe("Failed to analyze image");
  });
});
