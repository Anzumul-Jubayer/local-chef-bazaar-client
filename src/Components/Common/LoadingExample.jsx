import { useState } from "react";
import { useLoadingState } from "../../hooks/useLoadingState";

const LoadingExample = () => {
  const [data, setData] = useState(null);
  const { withLoading, fetchWithLoading, startLoading, stopLoading, withQuickLoading, withExtendedLoading } = useLoadingState();

  // Example 1: Standard loading with 5-second timeout
  const handleStandardLoading = async () => {
    try {
      const result = await withLoading(async () => {
        // Simulate a 7-second operation (will timeout at 5 seconds)
        await new Promise(resolve => setTimeout(resolve, 7000));
        return { message: "Operation completed!" };
      }, "Processing your request...");
      
      setData(result);
    } catch (error) {
      console.error("Error:", error);
      setData({ message: "Operation timed out or failed" });
    }
  };

  // Example 2: Quick loading with 2-second timeout
  const handleQuickLoading = async () => {
    try {
      const result = await withQuickLoading(async () => {
        // Simulate a 3-second operation (will timeout at 2 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));
        return { message: "Quick operation completed!" };
      }, "Quick processing...");
      
      setData(result);
    } catch (error) {
      console.error("Error:", error);
      setData({ message: "Quick operation timed out" });
    }
  };

  // Example 3: Extended loading with 10-second timeout
  const handleExtendedLoading = async () => {
    try {
      const result = await withExtendedLoading(async () => {
        // Simulate a 6-second operation (will complete before 10-second timeout)
        await new Promise(resolve => setTimeout(resolve, 6000));
        return { message: "Extended operation completed!" };
      }, "Extended processing...");
      
      setData(result);
    } catch (error) {
      console.error("Error:", error);
      setData({ message: "Extended operation failed" });
    }
  };

  // Example 4: API call with timeout
  const handleFetchWithTimeout = async () => {
    try {
      const result = await fetchWithLoading(
        "https://jsonplaceholder.typicode.com/posts/1",
        {},
        "Fetching data from API...",
        3000 // 3-second timeout
      );
      setData(result);
    } catch (error) {
      console.error("Error:", error);
      setData({ message: "API call timed out or failed" });
    }
  };

  // Example 5: Manual loading with custom timeout
  const handleManualLoading = async () => {
    startLoading("Manual loading with 8-second timeout...", 8000);
    
    try {
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds (will timeout at 8)
      setData({ message: "Manual loading completed!" });
    } catch (error) {
      console.error("Error:", error);
      setData({ message: "Manual loading failed" });
    } finally {
      stopLoading();
    }
  };

  // Example 6: Fast operation that completes before timeout
  const handleFastOperation = async () => {
    try {
      const result = await withLoading(async () => {
        // Fast operation that completes in 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { message: "Fast operation completed!" };
      }, "Fast processing...");
      
      setData(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-base-content mb-4">
          Global Loading System with Timeout
        </h2>
        <p className="text-lg text-muted">
          Demonstrates automatic timeout functionality - all loading spinners disappear after their timeout duration
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <button
            onClick={handleStandardLoading}
            className="w-full btn-primary-modern"
          >
            Standard Loading
          </button>
          <p className="text-xs text-muted">5s timeout, 7s operation</p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleQuickLoading}
            className="w-full btn-secondary-modern"
          >
            Quick Loading
          </button>
          <p className="text-xs text-muted">2s timeout, 3s operation</p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleExtendedLoading}
            className="w-full btn-accent-modern"
          >
            Extended Loading
          </button>
          <p className="text-xs text-muted">10s timeout, 6s operation</p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleFetchWithTimeout}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            API Call
          </button>
          <p className="text-xs text-muted">3s timeout, real API</p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleManualLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Manual Loading
          </button>
          <p className="text-xs text-muted">8s timeout, 10s operation</p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleFastOperation}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Fast Operation
          </button>
          <p className="text-xs text-muted">5s timeout, 1s operation</p>
        </div>
      </div>
      
      {data && (
        <div className="card-modern p-6 mt-8">
          <h3 className="font-semibold text-base-content mb-4 flex items-center space-x-2">
            <span>Result:</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </h3>
          <div className="bg-surface-elevated rounded-lg p-4">
            <pre className="text-sm text-muted whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-xl font-bold text-base-content mb-4">
          Timeout Features:
        </h3>
        <ul className="space-y-2 text-muted">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span><strong>Automatic Timeout:</strong> Loading disappears after maximum duration</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span><strong>Progress Indicator:</strong> Visual countdown shows time remaining</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span><strong>Flexible Durations:</strong> Custom timeout for different operations</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span><strong>Early Completion:</strong> Hides immediately when operation completes</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoadingExample;