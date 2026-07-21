// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Signup from "./page";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockPush: vi.fn(),
    mockRefresh: vi.fn(),
    mockSignUpEmail: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.mockPush,
    refresh: mocks.mockRefresh,
  }),
  useParams: () => ({
    lng: "en",
  }),
}));

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signUp: {
      email: (data: Record<string, string | number | boolean>) => mocks.mockSignUpEmail(data),
    },
  },
}));

vi.mock("@/components/SignOAuth/SignOauth", () => ({
  default: () => null,
}));

vi.mock("@/components/Navbar/components/LanguagePicker", () => ({
  default: () => null,
}));

describe("Signup Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the signup form correctly", () => {
    render(<Signup />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByLabelText("usernameLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("emailLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("passwordLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("heightLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("weightLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("yearOfBirthLabel")).toBeInTheDocument();
    expect(screen.getAllByText("genderLabel")[0]).toBeInTheDocument();
    expect(screen.getByText("agreeText")).toBeInTheDocument();
    expect(screen.getByText("signUpButton")).toBeInTheDocument();
  });

  it("should keep the submit button disabled until terms are accepted", () => {
    render(<Signup />);

    const submitBtn = screen.getByText("signUpButton").closest("button");
    const checkbox = screen.getByRole("checkbox");

    expect(submitBtn).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    // Accept terms
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(submitBtn).not.toBeDisabled();
  });

  it("should show validation errors when fields are invalid", async () => {
    render(<Signup />);

    // Enter short username, invalid email, short password, out-of-bound height, weight & yearOfBirth
    fireEvent.change(screen.getByLabelText("usernameLabel"), {
      target: { value: "jo" }, // too short
    });
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "123" }, // too short
    });
    fireEvent.change(screen.getByLabelText("heightLabel"), {
      target: { value: "40" }, // too low
    });
    fireEvent.change(screen.getByLabelText("weightLabel"), {
      target: { value: "10" }, // too low
    });
    fireEvent.change(screen.getByLabelText("yearOfBirthLabel"), {
      target: { value: "1800" }, // too low
    });

    // Trigger blur to run validation
    fireEvent.blur(screen.getByLabelText("usernameLabel"));
    fireEvent.blur(screen.getByLabelText("emailLabel"));
    fireEvent.blur(screen.getByLabelText("passwordLabel"));
    fireEvent.blur(screen.getByLabelText("heightLabel"));
    fireEvent.blur(screen.getByLabelText("weightLabel"));
    fireEvent.blur(screen.getByLabelText("yearOfBirthLabel"));

    await waitFor(() => {
      expect(screen.getByText("validation.usernameMin")).toBeInTheDocument();
      expect(screen.getByText("validation.emailInvalid")).toBeInTheDocument();
      expect(screen.getByText("validation.passwordMin")).toBeInTheDocument();
      expect(screen.getByText("validation.heightMin")).toBeInTheDocument();
      expect(screen.getByText("validation.weightMin")).toBeInTheDocument();
      expect(screen.getByText("validation.yearOfBirthMin")).toBeInTheDocument();
    });
  });

  it("should successfully submit the form and trigger signUp", async () => {
    mocks.mockSignUpEmail.mockResolvedValue({
      data: { user: {} },
      error: null,
    });

    render(<Signup />);

    // Fill in valid data
    fireEvent.change(screen.getByLabelText("usernameLabel"), {
      target: { value: "john_doe" },
    });
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("heightLabel"), {
      target: { value: "180" },
    });
    fireEvent.change(screen.getByLabelText("weightLabel"), {
      target: { value: "75" },
    });
    fireEvent.change(screen.getByLabelText("yearOfBirthLabel"), {
      target: { value: "1995" },
    });

    // Accept terms
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit form
    const form = screen.getByRole("main").querySelector("form");
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mocks.mockSignUpEmail).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
        name: "john_doe",
        image: "",
        callbackURL: "/dashboard",
        height: 180,
        weight: 75,
        yearOfBirth: 1995,
        gender: "male",
        termsAccepted: true,
      });
      expect(mocks.mockRefresh).toHaveBeenCalled();
      expect(mocks.mockPush).toHaveBeenCalledWith("/en/dashboard");
    });
  });

  it("should display a server error message when signUp fails", async () => {
    mocks.mockSignUpEmail.mockResolvedValue({
      data: null,
      error: { message: "Email already in use" },
    });

    render(<Signup />);

    // Fill in valid data
    fireEvent.change(screen.getByLabelText("usernameLabel"), {
      target: { value: "john_doe" },
    });
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("heightLabel"), {
      target: { value: "180" },
    });
    fireEvent.change(screen.getByLabelText("weightLabel"), {
      target: { value: "75" },
    });
    fireEvent.change(screen.getByLabelText("yearOfBirthLabel"), {
      target: { value: "1995" },
    });

    // Accept terms
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit form
    const form = screen.getByRole("main").querySelector("form");
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mocks.mockSignUpEmail).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Email already in use")).toBeInTheDocument();
    });
  });
});
