import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { NextRequest, NextResponse } from "next/server";
import type { Session, User } from "better-auth";

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

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockGenerateContent: vi.fn(),
  },
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: (args: Record<string, string | number | boolean | object>) =>
        mocks.mockGenerateContent(args),
    };
  },
}));

describe("GET /api/aitextsearchmacros", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (query: string = "") => {
    return new NextRequest(`http://localhost/api/aitextsearchmacros?query=${encodeURIComponent(query)}`);
  };

  it("should return empty array if query is empty", async () => {
    const req = createRequest("");
    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  it("should parse query using Gemini and return structured food array", async () => {
    mocks.mockGenerateContent.mockResolvedValue({
      text: JSON.stringify([
        {
          name: "Mashed Potatoes",
          weight: 150,
          calories: 120,
          fat: 4.5,
          protein: 2.0,
          carbohydrates: 20,
          fiber: 2.5,
          sugar: 1.5,
          salt: 0.5,
        },
      ]),
    });

    const req = createRequest("mashed potatoes");
    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toBe("Mashed Potatoes");
    expect(body.data[0].weight).toBe(150);
  });
});
