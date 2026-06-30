import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { FoodType } from "@/types/Types";
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

type TestAIRequest = {
  message?: string | null;
  savedFood?: Record<string, FoodType> | null;
};

describe("POST /api/generateResponseAI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: TestAIRequest) => {
    return new NextRequest("http://localhost/api/generateResponseAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  it("should return 400 when message is missing or empty", async () => {
    const req = createRequest({ savedFood: {} });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { success: false; error: string };
    expect(body).toEqual({ success: false, error: "Missing or invalid message" });
  });

  it("should return 200 and the AI generated evaluation message", async () => {
    const mockAiResponseText = "Great job eating high protein today! Try to reduce your sugar intake.";
    mocks.mockGenerateContent.mockResolvedValue({
      text: mockAiResponseText,
    });

    const payload: TestAIRequest = {
      message: "Evaluate my intake",
      savedFood: {
        "2026-06-30": {
          breakfast: [],
          lunch: [],
          dinner: [],
        },
      },
    };

    const req = createRequest(payload);
    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = (await response.json()) as { success: true; data: string };
    expect(body).toEqual({ success: true, data: mockAiResponseText });
    expect(mocks.mockGenerateContent).toHaveBeenCalled();
  });

  it("should return 500 when Gemini API fails", async () => {
    mocks.mockGenerateContent.mockRejectedValue(new Error("API internal error"));

    const payload: TestAIRequest = {
      message: "Evaluate my intake",
      savedFood: {},
    };

    const req = createRequest(payload);
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = (await response.json()) as { success: false; error: string };
    expect(body.error).toBe("Failed to generate AI response");
  });
});
