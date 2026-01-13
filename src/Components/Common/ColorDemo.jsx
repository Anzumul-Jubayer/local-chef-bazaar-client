import React from 'react';
import { HiCheck } from 'react-icons/hi';

const ColorDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-display font-bold text-primary">Modern Button System Demo</h2>
      
      {/* Button Variants */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-base-content">Button Variants</h3>
        
        {/* Primary Buttons */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-base-content">Primary Buttons</h4>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary-modern">Primary Button</button>
            <button className="btn-primary-modern btn-sm">Small Primary</button>
            <button className="btn-primary-modern btn-lg">Large Primary</button>
            <button className="btn-primary-modern" disabled>Disabled Primary</button>
          </div>
        </div>

        {/* Secondary Buttons */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-base-content">Secondary Buttons</h4>
          <div className="flex flex-wrap gap-4">
            <button className="btn-secondary-modern">Secondary Button</button>
            <button className="btn-secondary-modern btn-sm">Small Secondary</button>
            <button className="btn-secondary-modern btn-lg">Large Secondary</button>
            <button className="btn-secondary-modern" disabled>Disabled Secondary</button>
          </div>
        </div>

        {/* Accent & Danger Buttons */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-base-content">Accent & Danger Buttons</h4>
          <div className="flex flex-wrap gap-4">
            <button className="btn-accent-modern">Accent Button</button>
            <button className="btn-danger-modern">Danger Button</button>
            <button className="btn-ghost-modern">Ghost Button</button>
            <button className="btn-outline-modern">Outline Button</button>
          </div>
        </div>

        {/* Icon Buttons */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-base-content">Icon Buttons</h4>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="btn-icon-modern btn-primary-modern">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="btn-icon-modern btn-secondary-modern">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button className="btn-icon-sm btn-accent-modern">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Button Group */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-base-content">Button Group</h4>
          <div className="btn-group">
            <button className="btn-secondary-modern">Left</button>
            <button className="btn-secondary-modern">Center</button>
            <button className="btn-secondary-modern">Right</button>
          </div>
        </div>
      </div>

      {/* Surface Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-base-content">Surface Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-modern p-6">
            <h4 className="font-semibold text-base-content mb-2">Primary Surface</h4>
            <p className="text-muted text-sm mb-4">Main background surface</p>
            <button className="btn-primary-modern btn-sm">Action</button>
          </div>
          <div className="card-elevated p-6">
            <h4 className="font-semibold text-base-content mb-2">Elevated Surface</h4>
            <p className="text-muted text-sm mb-4">Elevated surface with shadow</p>
            <button className="btn-secondary-modern btn-sm">Action</button>
          </div>
          <div className="bg-surface-elevated p-6 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-base-content mb-2">Custom Surface</h4>
            <p className="text-muted text-sm mb-4">Theme-aware surface</p>
            <button className="btn-accent-modern btn-sm">Action</button>
          </div>
        </div>
      </div>

      {/* Interactive States Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-base-content">Interactive States</h3>
        <div className="card-modern p-6">
          <p className="text-muted mb-4">Hover over buttons to see smooth transitions and effects:</p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary-modern">Hover Me</button>
            <button className="btn-secondary-modern">Focus Me</button>
            <button className="btn-accent-modern">Click Me</button>
          </div>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-base-content">Accessibility Features</h3>
        <div className="card-modern p-6 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-base-content flex items-center space-x-2">
              <HiCheck className="w-5 h-5 text-green-500" />
              <span>Minimum Touch Target (44px)</span>
            </h4>
            <p className="text-sm text-muted">All buttons meet WCAG guidelines for touch targets</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-base-content flex items-center space-x-2">
              <HiCheck className="w-5 h-5 text-green-500" />
              <span>Focus Indicators</span>
            </h4>
            <p className="text-sm text-muted">Visible focus rings for keyboard navigation</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-base-content flex items-center space-x-2">
              <HiCheck className="w-5 h-5 text-green-500" />
              <span>Color Contrast</span>
            </h4>
            <p className="text-sm text-muted">WCAG AA compliant contrast ratios in both themes</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-base-content flex items-center space-x-2">
              <HiCheck className="w-5 h-5 text-green-500" />
              <span>Disabled States</span>
            </h4>
            <p className="text-sm text-muted">Clear visual indication when buttons are disabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorDemo;
