import { useState, useEffect } from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return savedTheme || systemTheme;
  });

  const applyTheme = (newTheme) => {
    // Apply to document element for DaisyUI
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Apply to html element as well for broader compatibility
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    // Update CSS custom properties manually for immediate effect
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.style.setProperty('--color-primary', '#F4D03F');
      root.style.setProperty('--color-secondary', '#E74C3C');
      root.style.setProperty('--color-accent', '#58D68D');
      root.style.setProperty('--color-background', '#171717');
      root.style.setProperty('--color-surface', '#262626');
      root.style.setProperty('--color-text-primary', '#f5f5f5');
      root.style.setProperty('--color-text-secondary', '#a3a3a3');
      root.style.setProperty('--color-border', '#404040');
    } else {
      root.style.setProperty('--color-primary', '#D4AF37');
      root.style.setProperty('--color-secondary', '#7D2E2E');
      root.style.setProperty('--color-accent', '#2E7D32');
      root.style.setProperty('--color-background', '#fafafa');
      root.style.setProperty('--color-surface', '#ffffff');
      root.style.setProperty('--color-text-primary', '#171717');
      root.style.setProperty('--color-text-secondary', '#525252');
      root.style.setProperty('--color-border', '#e5e5e5');
    }
  };

  useEffect(() => {
    // Apply the initial theme
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn-icon-modern btn-ghost-modern group relative"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        {theme === 'light' ? (
          <IoMoon className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
        ) : (
          <IoSunny className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-surface-elevated border border-color rounded-lg text-xs text-base-content opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </div>
    </button>
  );
};

export default ThemeToggle;