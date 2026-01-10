import { useCallback } from 'react';

/**
 * Custom hook for smooth scrolling functionality
 * @returns {Object} Object containing scroll functions
 */
const useSmoothScroll = () => {
  // Scroll to top of the page
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Scroll to a specific element by ID
  const scrollToElement = useCallback((elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Scroll to a specific position
  const scrollToPosition = useCallback((position) => {
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }, []);

  // Scroll by a specific amount
  const scrollBy = useCallback((amount) => {
    window.scrollBy({
      top: amount,
      behavior: 'smooth'
    });
  }, []);

  // Scroll to next section (useful for hero sections)
  const scrollToNextSection = useCallback(() => {
    const currentSection = document.elementFromPoint(
      window.innerWidth / 2, 
      window.innerHeight / 2
    )?.closest('section');
    
    if (currentSection) {
      const nextSection = currentSection.nextElementSibling;
      if (nextSection && nextSection.tagName === 'SECTION') {
        nextSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      } else {
        // Fallback: scroll by viewport height
        scrollBy(window.innerHeight);
      }
    }
  }, [scrollBy]);

  // Get current scroll position
  const getCurrentScrollPosition = useCallback(() => {
    return window.pageYOffset || document.documentElement.scrollTop;
  }, []);

  // Check if element is in viewport
  const isElementInViewport = useCallback((element) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, []);

  return {
    scrollToTop,
    scrollToElement,
    scrollToPosition,
    scrollBy,
    scrollToNextSection,
    getCurrentScrollPosition,
    isElementInViewport
  };
};

export default useSmoothScroll;