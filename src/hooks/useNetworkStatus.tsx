import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string | null;
}

/**
 * Hook to monitor network connectivity status
 * Shows offline banner and handles reconnection
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
    connectionType: null,
  });

  const updateNetworkStatus = useCallback(() => {
    const isOnline = navigator.onLine;

    // Check connection quality if available
    let isSlowConnection = false;
    let connectionType: string | null = null;

    // @ts-expect-error - Navigator.connection is not in standard TypeScript types
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      connectionType = connection.effectiveType || connection.type;
      isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    }

    setStatus({
      isOnline,
      isSlowConnection,
      connectionType,
    });
  }, []);

  useEffect(() => {
    // Initial check
    updateNetworkStatus();

    // Add event listeners
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Check connection change
    // @ts-expect-error - Navigator.connection is not in standard TypeScript types
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, [updateNetworkStatus]);

  return status;
}

/**
 * Component to show offline banner
 */
export function OfflineBanner() {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when coming back online
  useEffect(() => {
    if (isOnline && !isSlowConnection) {
      setDismissed(false);
    }
  }, [isOnline, isSlowConnection]);

  if (dismissed) return null;

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white px-4 py-3 text-center shadow-lg">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
          <span className="font-medium">You&apos;re offline. Some features may not work.</span>
        </div>
      </div>
    );
  }

  if (isSlowConnection) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-black px-4 py-2 text-center">
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-sm">Slow connection detected. Some features may take longer to load.</span>
          <button
            onClick={() => setDismissed(true)}
            className="ml-4 text-black/70 hover:text-black"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
