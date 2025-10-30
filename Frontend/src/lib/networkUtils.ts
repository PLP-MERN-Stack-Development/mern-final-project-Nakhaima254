import { toast } from "@/hooks/use-toast";

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface NetworkError extends Error {
  status?: number;
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

/**
 * Creates a network error with additional metadata
 */
export const createNetworkError = (
  message: string,
  status?: number,
  isTimeout?: boolean
): NetworkError => {
  const error = new Error(message) as NetworkError;
  error.isNetworkError = true;
  error.status = status;
  error.isTimeout = isTimeout;
  return error;
};

/**
 * Determines if an error is retryable
 */
export const isRetryableError = (error: NetworkError): boolean => {
  // Retry on network errors, timeouts, and 5xx server errors
  if (error.isNetworkError || error.isTimeout) return true;
  if (error.status && error.status >= 500 && error.status < 600) return true;
  // Also retry on 429 (Too Many Requests) and 408 (Request Timeout)
  if (error.status === 429 || error.status === 408) return true;
  return false;
};

/**
 * Executes a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoff = true,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if this is the last attempt
      if (attempt === maxRetries) break;

      // Check if error is retryable
      const networkError = error as NetworkError;
      if (!isRetryableError(networkError)) {
        throw error;
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Calculate delay (with optional exponential backoff)
      const delay = backoff ? retryDelay * Math.pow(2, attempt) : retryDelay;
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Shows a user-friendly error toast based on the error type
 */
export const showNetworkError = (error: unknown, customMessage?: string) => {
  const networkError = error as NetworkError;
  
  let title = "Something went wrong";
  let description = customMessage || "Please try again later.";

  if (networkError.isTimeout) {
    title = "Request Timeout";
    description = "The request took too long. Please check your connection and try again.";
  } else if (networkError.isNetworkError) {
    title = "Network Error";
    description = "Unable to connect. Please check your internet connection.";
  } else if (networkError.status) {
    switch (networkError.status) {
      case 400:
        title = "Invalid Request";
        description = "The request contains invalid data. Please check and try again.";
        break;
      case 401:
        title = "Authentication Required";
        description = "Please log in to continue.";
        break;
      case 403:
        title = "Access Denied";
        description = "You don't have permission to perform this action.";
        break;
      case 404:
        title = "Not Found";
        description = "The requested resource could not be found.";
        break;
      case 429:
        title = "Too Many Requests";
        description = "Please wait a moment before trying again.";
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        title = "Server Error";
        description = "Our servers are experiencing issues. Please try again shortly.";
        break;
    }
  }

  toast({
    title,
    description,
    variant: "destructive",
  });
};

/**
 * Wraps a fetch call with timeout
 */
export const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  timeout = 30000
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(createNetworkError("Request timeout", undefined, true));
    }, timeout);

    fetch(url, options)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(createNetworkError(error.message));
      });
  });
};

/**
 * Handles Supabase errors with user-friendly messages
 */
export const handleSupabaseError = (error: any, context?: string) => {
  console.error(`Supabase error${context ? ` in ${context}` : ''}:`, error);
  
  let title = "Database Error";
  let description = "Unable to process your request.";

  if (error?.message) {
    // Check for common Supabase error patterns
    if (error.message.includes("JWT")) {
      title = "Session Expired";
      description = "Please log in again to continue.";
    } else if (error.message.includes("violates row-level security")) {
      title = "Access Denied";
      description = "You don't have permission to access this data.";
    } else if (error.message.includes("duplicate key")) {
      title = "Duplicate Entry";
      description = "This record already exists.";
    } else if (error.message.includes("foreign key")) {
      title = "Invalid Reference";
      description = "The referenced data doesn't exist.";
    }
  }

  toast({
    title,
    description,
    variant: "destructive",
  });
};
