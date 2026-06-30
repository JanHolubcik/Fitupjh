// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { BiometricAndGoals } from "./BiometricAndGoals";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockRefresh: vi.fn(),
    mockUpdateUser: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mocks.mockRefresh,
  }),
}));

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    updateUser: (values: {
      weight?: number;
      weightGoal?: number;
      height?: number;
      activityLevel?: string;
      goal?: string;
    }) => mocks.mockUpdateUser(values),
  },
}));

vi.mock("@/utils/toast", () => ({
  showToast: {
    promise: (promise: Promise<void>) => promise,
  },
}));

type MockUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  weight?: number;
  weightGoal?: number;
  height?: number;
  activityLevel?: string;
  goal?: string;
};

describe("BiometricAndGoals Component", () => {
  const mockUser: MockUser = {
    id: "user-123",
    email: "user@example.com",
    emailVerified: true,
    name: "John Doe",
    createdAt: new Date(),
    updatedAt: new Date(),
    weight: 80,
    weightGoal: 75,
    height: 180,
    activityLevel: "lightlyActive",
    goal: "loseWeight",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the biometrics form with initial user values", () => {
    // Cast mockUser as User type
    render(<BiometricAndGoals user={mockUser as never} />);

    expect(screen.getByText("biometricsAndGoals")).toBeInTheDocument();
    
    const weightInput = screen.getByLabelText("currentWeight") as HTMLInputElement;
    const goalWeightInput = screen.getByLabelText("goalWeight") as HTMLInputElement;
    const heightInput = screen.getByLabelText("height") as HTMLInputElement;

    expect(weightInput.value).toBe("80");
    expect(goalWeightInput.value).toBe("75");
    expect(heightInput.value).toBe("180");
    expect(screen.getByText("updateBiometrics")).toBeInTheDocument();
  });

  it("should successfully submit the form with updated biometrics", async () => {
    mocks.mockUpdateUser.mockResolvedValue({
      data: { user: {} },
      error: null,
    });

    const { container } = render(<BiometricAndGoals user={mockUser as never} />);

    // Update weights and height
    fireEvent.change(screen.getByLabelText("currentWeight"), {
      target: { value: "85" },
    });
    fireEvent.change(screen.getByLabelText("goalWeight"), {
      target: { value: "80" },
    });
    fireEvent.change(screen.getByLabelText("height"), {
      target: { value: "182" },
    });

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mocks.mockUpdateUser).toHaveBeenCalledWith({
        weight: 85,
        weightGoal: 80,
        height: 182,
        activityLevel: "lightlyActive",
        goal: "loseWeight",
      });
    });

    await waitFor(() => {
      expect(mocks.mockRefresh).toHaveBeenCalled();
    });
  });

  it("should show validation errors when fields violate limits", async () => {
    const { container } = render(<BiometricAndGoals user={mockUser as never} />);

    // Set invalid height (under 50) and weight (under 20)
    fireEvent.change(screen.getByLabelText("currentWeight"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText("height"), {
      target: { value: "40" },
    });

    fireEvent.blur(screen.getByLabelText("currentWeight"));
    fireEvent.blur(screen.getByLabelText("height"));

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      // These keys should match the validation error translation keys from userValidationSchema
      expect(mocks.mockUpdateUser).not.toHaveBeenCalled();
    });
  });
});
