import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HiChevronUp } from 'react-icons/hi';
import useSmoothScroll from '../../hooks/useSmoothScroll';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollToTop } = useSmoothScroll();

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    const scrolled = document.documentElement.scrollTop;
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrolled / maxHeight) * 100;
    
    setScrollProgress(progress);
    
    if (scrolled > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="back-to-top"
          onClick={scrollToTop}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Back to top"
          style={{
            '--progress': `${scrollProgress * 3.6}deg`
          }}
        >
          {/* Progress Ring */}
          <div 
            className="back-to-top-progress"
            style={{
              '--progress': `${scrollProgress * 3.6}deg`
            }}
          />
          
          {/* Main Button Content */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="animate-bounce">
              <HiChevronUp className="back-to-top-icon" />
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 opacity-0 active:opacity-100 active:animate-ping" />
        </div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
