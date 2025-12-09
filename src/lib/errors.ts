/**
 * Error handling utilities for AaoCab
 * Provides user-friendly error messages and logging
 */

// Custom error types
export class NetworkError extends Error {
  constructor(message = 'Unable to connect. Please check your internet connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// User-friendly error messages mapping
const errorMessages: Record<string, string> = {
  // Network errors
  'Failed to fetch': 'Unable to connect to the server. Please check your internet connection and try again.',
  'NetworkError': 'You appear to be offline. Please check your connection and try again.',
  'TypeError: Failed to fetch': 'Connection failed. Please try again later.',

  // Auth errors
  'Invalid login credentials': 'The email or password you entered is incorrect. Please try again.',
  'Email not confirmed': 'Please verify your email address before signing in. Check your inbox for a confirmation link.',
  'User already registered': 'An account with this email already exists. Please sign in instead.',
  'Password should be at least 6 characters': 'Your password must be at least 6 characters long.',
  'Email rate limit exceeded': 'Too many attempts. Please wait a few minutes before trying again.',

  // Booking errors
  'Booking not found': 'We couldn\'t find this booking. It may have been deleted or the link is incorrect.',
  'Unauthorized': 'You don\'t have permission to view this page. Please sign in.',

  // Generic errors
  'Internal Server Error': 'Something went wrong on our end. Our team has been notified. Please try again later.',
  'Service Unavailable': 'Our service is temporarily unavailable. Please try again in a few minutes.',
};

/**
 * Convert technical errors to user-friendly messages
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof NetworkError) {
    return error.message;
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Check for known error messages
    for (const [key, friendlyMessage] of Object.entries(errorMessages)) {
      if (error.message.includes(key)) {
        return friendlyMessage;
      }
    }

    // Development: show actual error, Production: show generic message
    if (process.env.NODE_ENV === 'development') {
      return error.message;
    }
  }

  return 'Something unexpected happened. Please try again or contact support if the problem persists.';
}

/**
 * Log errors appropriately based on environment
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${timestamp}]${contextStr} Error:`, error);
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } else {
    // In production, you would send to error tracking service
    // Example: Sentry.captureException(error);
    console.error(`[${timestamp}]${contextStr}`, error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Check if error is a network-related error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof TypeError && error.message.includes('fetch')) return true;
  if (error instanceof Error) {
    const networkIndicators = ['network', 'offline', 'connection', 'ECONNREFUSED', 'ETIMEDOUT'];
    return networkIndicators.some(indicator =>
      error.message.toLowerCase().includes(indicator.toLowerCase())
    );
  }
  return false;
}

/**
 * Wrapper for async API calls with error handling
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  context?: string
): Promise<{ data: T | null; error: string | null }> {
  try {
    // Check if offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new NetworkError();
    }

    const data = await apiCall();
    return { data, error: null };
  } catch (err) {
    logError(err, context);
    const message = getUserFriendlyMessage(err);
    return { data: null, error: message };
  }
}

/**
 * Form validation helpers
 */
export const validators = {
  email: (value: string): string | null => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return 'Phone number is required';
    const cleaned = value.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      return 'Please enter a valid 10-digit mobile number';
    }
    return null;
  },

  name: (value: string): string | null => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return null;
  },

  location: (value: string): string | null => {
    if (!value.trim()) return 'Location is required';
    if (value.trim().length < 3) return 'Please enter a valid location';
    return null;
  },

  date: (value: string, minHoursAhead = 4): string | null => {
    if (!value) return 'Date is required';
    const selectedDate = new Date(value);
    const now = new Date();
    const minDate = new Date(now.getTime() + minHoursAhead * 60 * 60 * 1000);

    if (selectedDate < minDate) {
      return `Bookings must be made at least ${minHoursAhead} hours in advance`;
    }
    return null;
  },
};

/**
 * Validate multiple fields at once
 */
export function validateForm(
  data: Record<string, string>,
  rules: Record<string, (value: string) => string | null>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field] || '');
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}
