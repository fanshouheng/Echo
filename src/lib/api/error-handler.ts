/**
 * Centralized Error Handler
 * Provides consistent error handling and user-friendly messages in Chinese
 */

export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  
  // API errors
  API_ERROR = "API_ERROR",
  GENERATION_FAILED = "GENERATION_FAILED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  API_KEY_INVALID = "API_KEY_INVALID",
  
  // Network errors
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",
  
  // Application errors
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  
  // Unknown
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly userMessage: string;
  public readonly originalError?: Error;

  constructor(
    code: ErrorCode,
    userMessage: string,
    originalError?: Error
  ) {
    super(userMessage);
    this.code = code;
    this.userMessage = userMessage;
    this.originalError = originalError;
    this.name = "AppError";
  }
}

/**
 * Convert unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // OpenAI specific errors
    if (error.message.includes("rate limit") || error.message.includes("Rate limit")) {
      return new AppError(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        "请求过于频繁，请稍后再试",
        error
      );
    }

    if (error.message.includes("API key") || error.message.includes("Incorrect API key")) {
      return new AppError(
        ErrorCode.API_KEY_INVALID,
        "API密钥无效，请检查配置",
        error
      );
    }

    if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
      return new AppError(
        ErrorCode.TIMEOUT,
        "请求超时，请检查网络连接",
        error
      );
    }

    if (error.message.includes("network") || error.message.includes("ECONNREFUSED")) {
      return new AppError(
        ErrorCode.NETWORK_ERROR,
        "网络连接失败，请检查网络",
        error
      );
    }

    // Generic error
    return new AppError(
      ErrorCode.UNKNOWN_ERROR,
      error.message || "发生未知错误",
      error
    );
  }

  // Non-error object
  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    "发生未知错误"
  );
}

/**
 * Get user-friendly error message in Chinese
 */
export function getUserErrorMessage(error: unknown): string {
  const appError = toAppError(error);
  return appError.userMessage;
}

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context: {
    operation: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }
): void {
  const appError = toAppError(error);
  
  console.error({
    timestamp: new Date().toISOString(),
    operation: context.operation,
    userId: context.userId,
    errorCode: appError.code,
    errorMessage: appError.message,
    userMessage: appError.userMessage,
    metadata: context.metadata,
    stack: appError.stack,
  });
}

/**
 * Handle API route error
 * Returns appropriate HTTP response
 */
export function handleAPIError(error: unknown): {
  status: number;
  body: {
    error: string;
    errorCode: string;
    message: string;
  };
} {
  const appError = toAppError(error);

  let status = 500;

  switch (appError.code) {
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.INVALID_INPUT:
      status = 400;
      break;
    case ErrorCode.UNAUTHORIZED:
      status = 401;
      break;
    case ErrorCode.FORBIDDEN:
      status = 403;
      break;
    case ErrorCode.NOT_FOUND:
      status = 404;
      break;
    case ErrorCode.RATE_LIMIT_EXCEEDED:
      status = 429;
      break;
    case ErrorCode.API_ERROR:
    case ErrorCode.GENERATION_FAILED:
    case ErrorCode.NETWORK_ERROR:
    case ErrorCode.TIMEOUT:
      status = 503; // Service Unavailable
      break;
    default:
      status = 500;
  }

  return {
    status,
    body: {
      error: appError.name,
      errorCode: appError.code,
      message: appError.userMessage,
    },
  };
}

/**
 * Retry helper function
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    exponentialBackoff?: boolean;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    exponentialBackoff = true,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = exponentialBackoff
          ? delayMs * Math.pow(2, attempt - 1)
          : delayMs;

        if (onRetry) {
          onRetry(attempt, lastError);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

