import { describe, it, expect } from "vitest";
import { signupSchema } from "../signupValidationSchema";

describe("signupSchema Validation", () => {
  it("should validate a valid signup payload successfully", () => {
    const validPayload = {
      username: "john_doe",
      userEmail: "john@example.com",
      password: "password123",
      height: 180,
      weight: 75,
    };

    const result = signupSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("should fail validation when username is too short", () => {
    const invalidPayload = {
      username: "jo",
      userEmail: "john@example.com",
      password: "password123",
      height: 180,
      weight: 75,
    };

    const result = signupSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("username"));
      expect(issue?.message).toBe("validation.usernameMin");
    }
  });

  it("should fail validation when email is invalid", () => {
    const invalidPayload = {
      username: "john_doe",
      userEmail: "invalid-email",
      password: "password123",
      height: 180,
      weight: 75,
    };

    const result = signupSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("userEmail"));
      expect(issue?.message).toBe("validation.emailInvalid");
    }
  });

  it("should fail validation when password is too short", () => {
    const invalidPayload = {
      username: "john_doe",
      userEmail: "john@example.com",
      password: "12345",
      height: 180,
      weight: 75,
    };

    const result = signupSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("password"));
      expect(issue?.message).toBe("validation.passwordMin");
    }
  });

  it("should fail validation when height is out of bounds", () => {
    const invalidPayloadLow = {
      username: "john_doe",
      userEmail: "john@example.com",
      password: "password123",
      height: 49,
      weight: 75,
    };

    const invalidPayloadHigh = {
      username: "john_doe",
      userEmail: "john@example.com",
      password: "password123",
      height: 251,
      weight: 75,
    };

    const resultLow = signupSchema.safeParse(invalidPayloadLow);
    const resultHigh = signupSchema.safeParse(invalidPayloadHigh);

    expect(resultLow.success).toBe(false);
    expect(resultHigh.success).toBe(false);
  });

  it("should fail validation when weight is out of bounds", () => {
    const invalidPayloadLow = {
      username: "john_doe",
      userEmail: "john@example.com",
      password: "password123",
      height: 180,
      weight: 19,
    };

    const invalidPayloadHigh = {
      username: "john_doe",
      userEmail: "john@example.com",
      password: "password123",
      height: 180,
      weight: 401,
    };

    const resultLow = signupSchema.safeParse(invalidPayloadLow);
    const resultHigh = signupSchema.safeParse(invalidPayloadHigh);

    expect(resultLow.success).toBe(false);
    expect(resultHigh.success).toBe(false);
  });
});
