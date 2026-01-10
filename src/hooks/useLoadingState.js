import { useLoading } from "../Context/LoadingContext";
import { useCallback } from "react";

export const useLoadingState = () => {
  const { showLoading, hideLoading } = useLoading();

  // Wrapper for async operations with loading and timeout
  const withLoading = useCallback(async (asyncOperation, message = "Loading...", maxDuration = 5000) => {
    try {
      showLoading(message, maxDuration);
      const result = await asyncOperation();
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  // Wrapper for fetch operations with timeout
  const fetchWithLoading = useCallback(async (url, options = {}, message = "Fetching data...", maxDuration = 5000) => {
    return withLoading(async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, message, maxDuration);
  }, [withLoading]);

  // Manual loading control with timeout
  const startLoading = useCallback((message, maxDuration = 5000) => {
    showLoading(message, maxDuration);
  }, [showLoading]);

  const stopLoading = useCallback(() => {
    hideLoading();
  }, [hideLoading]);

  // Quick loading for fast operations (2 seconds max)
  const withQuickLoading = useCallback(async (asyncOperation, message = "Loading...") => {
    return withLoading(asyncOperation, message, 2000);
  }, [withLoading]);

  // Extended loading for slow operations (10 seconds max)
  const withExtendedLoading = useCallback(async (asyncOperation, message = "Loading...") => {
    return withLoading(asyncOperation, message, 10000);
  }, [withLoading]);

  return {
    withLoading,
    fetchWithLoading,
    startLoading,
    stopLoading,
    withQuickLoading,
    withExtendedLoading,
  };
};

export default useLoadingState;