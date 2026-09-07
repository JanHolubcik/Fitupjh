// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import WaterTracker from "./WaterTracker";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    mockAddWater: vi.fn(),
    mockRemoveWater: vi.fn(),
    mockClearWater: vi.fn(),
    mockSavedWaterEntries: [] as {
      id: string | number;
      amount: number;
    }[],
    mockTotalWaterMl: 0,
    mockRecommendedWater: 2500,
    mockAge: 25,
    mockGender: "male",
  },
}));

vi.mock("@/hooks/useWaterOperations", () => ({
  default: () => ({
    savedWaterEntries: mocks.mockSavedWaterEntries,
    totalWaterMl: mocks.mockTotalWaterMl,
    addWater: mocks.mockAddWater,
    removeWater: mocks.mockRemoveWater,
    clearWater: mocks.mockClearWater,
  }),
}));

vi.mock("@/hooks/useRecommendedWater", () => ({
  default: () => ({
    recommendedWater: mocks.mockRecommendedWater,
    age: mocks.mockAge,
    gender: mocks.mockGender,
  }),
}));

vi.mock("next-i18next/client", () => ({
  useT: () => ({
    t: (key: string, options?: Record<string, string | number>) => {
      if (key === "waterTracker.cupNotice") return "1 cup = 250 ml";
      if (key === "waterTracker.recommendationNotice") {
        return `Recommended for ${options?.gender}, ${options?.age} yrs: ${options?.amount} ml/day`;
      }
      if (key === "waterTracker.remaining")
        return `${options?.amount} ml remaining`;
      if (key === "waterTracker.goalReached")
        return "Daily hydration goal reached! ";
      if (key === "waterTracker.customPlaceholder") return "e.g. 300";
      return key;
    },
  }),
}));

describe("WaterTracker Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockSavedWaterEntries = [];
    mocks.mockTotalWaterMl = 0;
    mocks.mockRecommendedWater = 2500;
    mocks.mockAge = 25;
    mocks.mockGender = "male";
  });

  it("should render water tracker title and recommended intake", () => {
    render(<WaterTracker />);
    expect(screen.getByText("waterTracker.title")).toBeDefined();
    const badges = screen.getAllByText(/2500/);
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("should display cup preset with 1 cup = 250 ml notice and call addWater(250) on click", () => {
    render(<WaterTracker />);
    expect(screen.getByText("1 cup = 250 ml")).toBeDefined();

    const cupButton = screen
      .getByText("+250 waterTracker.ml")
      .closest("button");
    expect(cupButton).toBeDefined();

    if (cupButton) {
      fireEvent.click(cupButton);
    }
    expect(mocks.mockAddWater).toHaveBeenCalledWith(250);
  });

  it("should call addWater(500) when clicking bottle preset", () => {
    render(<WaterTracker />);
    const bottleButton = screen
      .getByText("+500 waterTracker.ml")
      .closest("button");
    expect(bottleButton).toBeDefined();

    if (bottleButton) {
      fireEvent.click(bottleButton);
    }
    expect(mocks.mockAddWater).toHaveBeenCalledWith(500);
  });

  it("should call addWater(1000) when clicking large bottle preset", () => {
    render(<WaterTracker />);
    const largeBottleButton = screen
      .getByText("+1000 waterTracker.ml")
      .closest("button");
    expect(largeBottleButton).toBeDefined();

    if (largeBottleButton) {
      fireEvent.click(largeBottleButton);
    }
    expect(mocks.mockAddWater).toHaveBeenCalledWith(1000);
  });

  it("should allow entering and submitting a custom ml amount", () => {
    render(<WaterTracker />);
    const input = screen.getByLabelText("waterTracker.customAmount");
    fireEvent.change(input, { target: { value: "350" } });

    const addButton = screen.getByText("waterTracker.add").closest("button");
    expect(addButton).toBeDefined();

    if (addButton) {
      fireEvent.click(addButton);
    }
    expect(mocks.mockAddWater).toHaveBeenCalledWith(350);
  });

  it("should show goal reached when total water intake meets recommended goal", () => {
    mocks.mockTotalWaterMl = 2500;
    mocks.mockRecommendedWater = 2500;

    render(<WaterTracker />);
    expect(screen.getByText(/Daily hydration goal reached/)).toBeDefined();
  });

  it("should render today's logged entries and handle remove", () => {
    mocks.mockSavedWaterEntries = [
      {
        id: "entry-1",
        amount: 250,
      },
    ];
    mocks.mockTotalWaterMl = 250;

    render(<WaterTracker />);

    // Open history
    const historyButton = screen.getByText(/waterTracker.todayEntries/);
    fireEvent.click(historyButton);

    const matches = screen.getAllByText(/250/);
    expect(matches.length).toBeGreaterThanOrEqual(1);

    const deleteButton = screen.getByLabelText("waterTracker.remove");
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    expect(mocks.mockRemoveWater).toHaveBeenCalledWith("entry-1");
  });

  it("should be toggable via accordion trigger", () => {
    render(<WaterTracker />);
    const trigger = screen.getByRole("button", { name: /waterTracker.title/ });
    expect(trigger).toBeDefined();

    fireEvent.click(trigger);
    expect(trigger).toBeDefined();
  });
});
