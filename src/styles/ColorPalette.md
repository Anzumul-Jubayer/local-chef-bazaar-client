# Color Palette Documentation

## Primary Colors (3 + Neutrals)

### 1. Primary - Gold (#D4AF37 / #F4D03F)
- **Light Mode**: #D4AF37 (Darker gold for contrast)
- **Dark Mode**: #F4D03F (Lighter gold for visibility)
- **Usage**: Main brand color, primary buttons, key highlights
- **Contrast**: Excellent against white/dark backgrounds

### 2. Secondary - Red (#7D2E2E / #E74C3C)
- **Light Mode**: #7D2E2E (Deep red)
- **Dark Mode**: #E74C3C (Brighter red)
- **Usage**: Secondary actions, warnings, important alerts
- **Contrast**: High contrast in both modes

### 3. Accent - Green (#2E7D32 / #58D68D)
- **Light Mode**: #2E7D32 (Forest green)
- **Dark Mode**: #58D68D (Bright green)
- **Usage**: Success states, positive actions, accent elements
- **Contrast**: Accessible in both themes

### Neutral Colors
- **50-900 Scale**: Complete neutral palette from light to dark
- **Semantic Variables**: Background, surface, text, border colors
- **Auto-switching**: Automatically adapts based on theme

## Usage Examples

### CSS Custom Properties
```css
/* Use semantic variables for automatic theme switching */
background-color: var(--color-surface);
color: var(--color-text-primary);
border-color: var(--color-border);
```

### Tailwind Classes
```html
<!-- DaisyUI theme-aware classes -->
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-accent">Success Action</button>

<!-- Custom utility classes -->
<div class="bg-surface text-primary-color border-color">
  Content with theme-aware colors
</div>
```

### Custom Button Classes
```html
<button class="btn-primary-custom">Custom Primary</button>
<button class="btn-secondary-custom">Custom Secondary</button>
<button class="btn-accent-custom">Custom Accent</button>
```

## Accessibility

- **WCAG AA Compliance**: All color combinations meet minimum contrast ratios
- **Light Mode**: Dark text on light backgrounds (4.5:1+ contrast)
- **Dark Mode**: Light text on dark backgrounds (4.5:1+ contrast)
- **Color Blindness**: Colors chosen to be distinguishable for common types

## Theme Switching

The theme system supports:
1. **System Preference**: Automatically detects user's OS theme preference
2. **Manual Toggle**: ThemeToggle component for user control
3. **Persistence**: Saves user preference in localStorage
4. **Smooth Transitions**: 0.3s ease transitions between themes

## Implementation Notes

- Uses CSS custom properties for dynamic theming
- DaisyUI integration for component consistency
- Fallback support for browsers without custom property support
- Semantic color naming for maintainability