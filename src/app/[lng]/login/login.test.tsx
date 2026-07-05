// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Login from "./page";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockPush: vi.fn(),
    mockSignInEmail: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.mockPush,
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
    signIn: {
      email: (credentials: { email: string; password: string; callbackURL?: string }) =>
        mocks.mockSignInEmail(credentials),
    },
  },
}));

vi.mock("@/components/SignOAuth/SignOauth", () => ({
  default: () => null,
}));

vi.mock("@/components/Navbar/components/LanguagePicker", () => ({
  default: () => null,
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the login form correctly", () => {
    render(<Login />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByLabelText("emailLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("passwordLabel")).toBeInTheDocument();
    expect(screen.getByText("signInButton")).toBeInTheDocument();
    expect(screen.getByText("byContinuing")).toBeInTheDocument();
    expect(screen.getByText("termsOfUseLinkText")).toBeInTheDocument();
    expect(screen.getByText("andText")).toBeInTheDocument();
    expect(screen.getByText("privacyPolicyLinkText")).toBeInTheDocument();
    expect(screen.getByText("agreePeriod")).toBeInTheDocument();
  });

  it("should successfully sign in and redirect to dashboard", async () => {
    mocks.mockSignInEmail.mockResolvedValue({
      data: { session: {} },
      error: null,
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "password123" },
    });

    const form = screen.getByRole("main").querySelector("form");
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mocks.mockSignInEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        callbackURL: "/dashboard",
      });
    });

    await waitFor(() => {
      expect(mocks.mockPush).toHaveBeenCalledWith("/en/dashboard");
    });
  });

  it("should display an error message when sign in fails", async () => {
    mocks.mockSignInEmail.mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "wrongpassword" },
    });

    const form = screen.getByRole("main").querySelector("form");
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mocks.mockSignInEmail).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("invalidEmailPassword")).toBeInTheDocument();
      expect(mocks.mockPush).not.toHaveBeenCalled();
    });
  });
});
