import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock URL.createObjectURL since it's not implemented in happy-dom by default
if (typeof window !== "undefined") {
  window.URL.createObjectURL = vi.fn(() => "mocked-object-url");
}
