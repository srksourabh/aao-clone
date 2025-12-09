import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-4">
          We're sorry for the inconvenience. The application encountered an unexpected error.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-red-50 rounded-md text-left">
            <p className="text-xs font-mono text-red-800 break-all">
              {error.message}
            </p>
          </div>
        )}
        <div className="mt-6 space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Go to homepage
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          If the problem persists, please contact support at{" "}
          <a href="tel:+917890302302" className="text-purple-600 hover:underline">
            +91 78903 02302
          </a>
        </p>
      </div>
    </div>
  );
}

function logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
  // Log to console in development
  console.error("Error caught by boundary:", error, errorInfo);
  
  // In production, you could send to error tracking service:
  // Sentry.captureException(error, { contexts: { react: errorInfo } });
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logErrorToService}
      onReset={() => {
        // Reset any app state here if needed
        window.location.href = "/";
      }}
    >
      <Component {...pageProps} />
      <Toaster />
    </ErrorBoundary>
  );
}
