# Global Loading System Documentation

## Overview

The Global Loading System provides a centralized, modern, and visually appealing loading indicator for the entire React application. It shows whenever data is being fetched or pages are loading, with a full-screen overlay to prevent user interaction during loading states.

## Features

- ✅ **Centralized Management**: Single loading state for the entire application
- ✅ **Modern Design**: Visually appealing spinner with animations and effects
- ✅ **Theme Friendly**: Works seamlessly with both Light and Dark modes
- ✅ **Full-Screen Overlay**: Prevents interaction while loading
- ✅ **Customizable Messages**: Different loading messages for different operations
- ✅ **Accessibility**: Proper ARIA labels and reduced motion support
- ✅ **Performance Optimized**: Hardware-accelerated animations

## Components

### 1. LoadingContext (`src/Context/LoadingContext.jsx`)

Provides global loading state management using React Context.

```javascript
import { useLoading } from "../Context/LoadingContext";

const { isLoading, loadingMessage, showLoading, hideLoading } = useLoading();
```

### 2. GlobalLoadingSpinner (`src/Components/Common/GlobalLoadingSpinner.jsx`)

The visual loading component with modern animations and effects.

Features:
- Animated spinner with multiple rings
- Pulsing glow effects
- Loading text with animated dots
- Progress bar animation
- Background blur overlay

### 3. useLoadingState Hook (`src/hooks/useLoadingState.js`)

Custom hook that provides convenient methods for managing loading states.

```javascript
import { useLoadingState } from "../hooks/useLoadingState";

const { withLoading, fetchWithLoading, startLoading, stopLoading } = useLoadingState();
```

## Usage Examples

### 1. Using `withLoading` for Async Operations

```javascript
const { withLoading } = useLoadingState();

const handleAsyncOperation = async () => {
  try {
    const result = await withLoading(async () => {
      // Your async operation here
      const response = await someAsyncFunction();
      return response;
    }, "Processing your request...");
    
    // Handle result
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 2. Using `fetchWithLoading` for API Calls

```javascript
const { fetchWithLoading } = useLoadingState();

const loadData = async () => {
  try {
    const data = await fetchWithLoading(
      "https://api.example.com/data",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      },
      "Loading data..."
    );
    
    setData(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 3. Manual Loading Control

```javascript
const { startLoading, stopLoading } = useLoadingState();

const handleManualOperation = async () => {
  startLoading("Processing...");
  
  try {
    // Your operation here
    await someOperation();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    stopLoading();
  }
};
```

## Implementation in Components

### Before (Component-Level Loading)

```javascript
const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{/* Component content */}</div>;
};
```

### After (Global Loading System)

```javascript
import { useLoadingState } from "../hooks/useLoadingState";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const { fetchWithLoading } = useLoadingState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWithLoading(
          "/api/data",
          {},
          "Loading data..."
        );
        setData(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [fetchWithLoading]);

  return <div>{/* Component content */}</div>;
};
```

## Setup Instructions

### 1. Install Dependencies

The system uses `framer-motion` for animations:

```bash
npm install framer-motion
```

### 2. Add to Main App

Update your `main.jsx` or `App.jsx`:

```javascript
import { LoadingProvider } from "./Context/LoadingContext";
import GlobalLoadingSpinner from "./Components/Common/GlobalLoadingSpinner";

function App() {
  return (
    <LoadingProvider>
      <YourAppContent />
      <GlobalLoadingSpinner />
    </LoadingProvider>
  );
}
```

### 3. Use in Components

Import and use the hook in any component:

```javascript
import { useLoadingState } from "../hooks/useLoadingState";

const MyComponent = () => {
  const { withLoading, fetchWithLoading } = useLoadingState();
  
  // Use the loading methods as needed
};
```

## Styling and Theming

The loading spinner automatically adapts to your theme using CSS custom properties:

```css
/* CSS Custom Properties Used */
--color-primary
--color-accent
--color-background
--color-surface
--color-surface-elevated
--color-text-primary
--color-border
```

### Dark Mode Support

The spinner automatically adjusts colors and opacity for dark mode when using the theme system.

### Reduced Motion Support

Respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation-duration: 2s;
  }
}
```

## Performance Considerations

- **Hardware Acceleration**: Uses `transform` and `opacity` for smooth animations
- **Efficient Rendering**: Only renders when `isLoading` is true
- **Memory Management**: Properly cleans up animations and timers
- **Bundle Size**: Minimal impact on bundle size

## Accessibility Features

- **Screen Reader Support**: Proper ARIA labels and announcements
- **Keyboard Navigation**: Doesn't interfere with keyboard accessibility
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Maintains focus context during loading

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Migration Guide

### From Component-Level Loading

1. Remove local loading states (`useState` for loading)
2. Remove loading UI components
3. Import `useLoadingState` hook
4. Replace fetch calls with `fetchWithLoading`
5. Replace async operations with `withLoading`

### From Other Loading Libraries

1. Remove existing loading library dependencies
2. Remove loading components and providers
3. Follow setup instructions above
4. Update components to use new hooks

## Troubleshooting

### Loading Doesn't Show

- Ensure `LoadingProvider` wraps your app
- Check that `GlobalLoadingSpinner` is included
- Verify hook usage is correct

### Styling Issues

- Check CSS custom properties are defined
- Ensure theme system is properly configured
- Verify z-index conflicts

### Performance Issues

- Check for memory leaks in async operations
- Ensure `stopLoading()` is called in finally blocks
- Monitor for excessive re-renders

## Best Practices

1. **Use Descriptive Messages**: Provide clear loading messages
2. **Handle Errors**: Always wrap in try-catch blocks
3. **Cleanup**: Use finally blocks or proper cleanup
4. **Avoid Nested Loading**: Don't trigger loading within loading
5. **Test Thoroughly**: Test loading states in different scenarios

## Future Enhancements

- [ ] Progress percentage support
- [ ] Multiple concurrent loading states
- [ ] Custom loading animations
- [ ] Loading state persistence
- [ ] Analytics integration