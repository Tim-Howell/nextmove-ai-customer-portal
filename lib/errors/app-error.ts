import { type ErrorCode } from "./codes";
import { getErrorMessage } from "./messages";

export interface AppErrorOptions {
  code: ErrorCode;
  message?: string;
  details?: string;
  field?: string;
  cause?: Error;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: string;
  readonly field?: string;
  readonly timestamp: string;

  constructor(options: AppErrorOptions) {
    const message = options.message || getErrorMessage(options.code);
    super(message);
    
    this.name = "AppError";
    this.code = options.code;
    this.details = options.details;
    this.field = options.field;
    this.timestamp = new Date().toISOString();
    
    if (options.cause) {
      this.cause = options.cause;
    }

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: process.env.NODE_ENV === "development" ? this.details : undefined,
        field: this.field,
        timestamp: this.timestamp,
      },
    };
  }

  toResponse(): { error: string; code?: string } {
    return {
      error: this.message,
      code: this.code,
    };
  }
}

export function createError(
  code: ErrorCode,
  options?: Partial<Omit<AppErrorOptions, "code">>
): AppError {
  return new AppError({ code, ...options });
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isValidationError(error: unknown): boolean {
  if (!isAppError(error)) return false;
  return error.code.includes("-VAL-") || error.field !== undefined;
}
