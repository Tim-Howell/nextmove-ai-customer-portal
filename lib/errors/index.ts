export { ERROR_CODES, type ErrorCode } from "./codes";
export { ERROR_MESSAGES, getErrorMessage } from "./messages";
export {
  AppError,
  createError,
  isAppError,
  isValidationError,
  type AppErrorOptions,
} from "./app-error";

export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : "";
  
  if (error instanceof Error) {
    console.error(`${prefix} Error:`, error.message);
    if (process.env.NODE_ENV === "development") {
      console.error("Stack:", error.stack);
    }
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}

export function formatErrorForClient(error: unknown): { error: string; code?: string } {
  if (error instanceof Error && "toResponse" in error && typeof error.toResponse === "function") {
    return error.toResponse();
  }
  
  if (error instanceof Error) {
    return { error: error.message };
  }
  
  return { error: "An unexpected error occurred" };
}
