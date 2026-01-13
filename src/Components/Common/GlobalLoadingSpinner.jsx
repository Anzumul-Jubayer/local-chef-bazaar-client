// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "../../Context/LoadingContext";
import { HiRefresh, HiClock } from "react-icons/hi";
import { useState, useEffect } from "react";

const GlobalLoadingSpinner = () => {
  const { isLoading, loadingMessage, getLoadingDuration } = useLoading();
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    
    if (isLoading) {
      interval = setInterval(() => {
        const duration = getLoadingDuration();
        const maxDuration = 5000; // 5 seconds
        const remaining = Math.max(0, maxDuration - duration);
        const progressPercent = Math.min(100, (duration / maxDuration) * 100);
        
        setTimeRemaining(Math.ceil(remaining / 1000));
        setProgress(progressPercent);
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading, getLoadingDuration]);

  // Reset state when loading stops
  useEffect(() => {
    if (!isLoading) {
      setTimeRemaining(5);
      setProgress(0);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Loading Container */}
          <motion.div
            className="flex flex-col items-center space-y-6 p-8 bg-surface rounded-3xl shadow-2xl border border-primary/20 max-w-sm mx-4 loading-content"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Spinner Container */}
            <div className="relative">
              {/* Outer Ring */}
              <motion.div
                className="w-16 h-16 border-4 border-primary/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner Spinning Ring */}
              <motion.div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary border-r-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-accent/30"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-accent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - progress / 100) }}
                  transition={{ duration: 0.1 }}
                />
              </svg>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <HiRefresh className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              
              {/* Pulsing Glow */}
              <motion.div
                className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-2">
              <motion.h3
                className="text-lg font-semibold text-base-content loading-text"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {loadingMessage}
              </motion.h3>
              
              {/* Animated Dots */}
              <div className="flex items-center justify-center space-x-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-primary rounded-full loading-dots"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Timeout Indicator */}
            <div className="w-full space-y-2">
              {/* Progress Bar */}
              <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden loading-progress-bg">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full loading-progress-bar"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              {/* Time Remaining */}
              <div className="flex items-center justify-center space-x-2 text-sm text-muted">
                <HiClock className="w-4 h-4" />
                <span>Auto-hide in {timeRemaining}s</span>
              </div>
            </div>
          </motion.div>

          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoadingSpinner;
