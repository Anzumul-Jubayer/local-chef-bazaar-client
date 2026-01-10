import { createContext, useContext, useState, useRef, useCallback } from "react";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const timeoutRef = useRef(null);
  const loadingStartTime = useRef(null);

  const showLoading = useCallback((message = "Loading...", maxDuration = 5000) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoadingMessage(message);
    setIsLoading(true);
    loadingStartTime.current = Date.now();

    // Set automatic timeout to hide loading after maxDuration
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setLoadingMessage("Loading...");
      timeoutRef.current = null;
      loadingStartTime.current = null;
    }, maxDuration);
  }, []);

  const hideLoading = useCallback(() => {
    // Clear the timeout if loading is manually hidden
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsLoading(false);
    setLoadingMessage("Loading...");
    loadingStartTime.current = null;
  }, []);

  const value = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    getLoadingDuration: () => {
      return loadingStartTime.current ? Date.now() - loadingStartTime.current : 0;
    }
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;