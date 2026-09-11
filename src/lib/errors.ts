export class AppError extends Error {
  constructor(public code: "VALIDATION_ERROR" | "AI_UNAVAILABLE" | "RATE_LIMITED" | "NOT_FOUND" | "UNAUTHORIZED" | "INTERNAL_ERROR", message: string, public retryable = false) {
    super(message);
    this.name = "AppError";
  }
}

export function publicError(error: unknown) {
  if (error instanceof AppError) return { code: error.code, message: error.message, retryable: error.retryable };
  return { code: "INTERNAL_ERROR" as const, message: "Something went wrong. Please try again.", retryable: true };
}
