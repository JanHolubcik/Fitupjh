import { NextResponse } from "next/server";

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string | any;
};

/**
 * Returns a standardized JSON success response.
 * @param data The data payload.
 * @param status The HTTP status code (default: 200).
 */
export function ApiSuccess<T>(data: T, status: number = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(response, { status });
}

/**
 * Returns a standardized JSON error response.
 * @param error The error message or object.
 * @param status The HTTP status code (default: 400).
 */
export function ApiError(error: string | any, status: number = 400) {
  const response: ApiResponse<never> = {
    success: false,
    error: error instanceof Error ? error.message : error,
  };
  return NextResponse.json(response, { status });
}
