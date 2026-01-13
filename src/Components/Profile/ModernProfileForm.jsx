import React, { useState, useRef, useCallback } from 'react';
import { HiUser, HiMail, HiLocationMarker, HiPhone, HiCamera, HiCheck, HiX, HiUpload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// InputField component defined outside of render
const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  icon: Icon, 
  placeholder, 
  required = false, 
  disabled = false,
  description,
  value,
  onChange,
  error,
  roleColors
}) => (
  <motion.div 
    className="space-y-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="flex items-center text-sm font-semibold text-base-content">
      {Icon && <Icon className="w-4 h-4 mr-2 text-base-content/70" />}
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
    
    {description && (
      <p className="text-xs text-base-content/60">{description}</p>
    )}
    
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
          bg-base-100 text-base-content placeholder-base-content/50
          focus:outline-none focus:ring-4 focus:ring-primary/20
          disabled:bg-base-200 disabled:cursor-not-allowed disabled:opacity-60
          ${error 
            ? 'border-error focus:border-error' 
            : disabled 
              ? 'border-base-300' 
              : `${roleColors.accent}`
          }
        `}
      />
      
      {/* Success/Error indicators */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {error ? (
          <HiX className="w-5 h-5 text-error" />
        ) : value && !disabled ? (
          <HiCheck className="w-5 h-5 text-success" />
        ) : null}
      </div>
    </div>
    
    {error && (
      <motion.p 
        className="text-error text-sm flex items-center"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <HiX className="w-4 h-4 mr-1" />
        {error}
      </motion.p>
    )}
  </motion.div>
);

const ModernProfileForm = ({ initialData = {}, onSubmit, loading = false, userRole = 'user' }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    photoURL: initialData.photoURL || '',
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(initialData.photoURL || '');
  const fileInputRef = useRef(null);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
    return null;
  };

  const validatePhone = (phone) => {
    if (phone && !/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-()]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  };

  const validatePhotoURL = (url) => {
    if (!url) return null; // Photo URL is optional
    try {
      new URL(url);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  };

  const validateAddress = (address) => {
    if (!address.trim()) return 'Address is required';
    if (address.trim().length < 10) return 'Please provide a more detailed address (at least 10 characters)';
    if (address.trim().length > 200) return 'Address must be less than 200 characters';
    return null;
  };

  // Handle input changes with real-time validation
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    let error = null;
    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'photoURL':
        error = validatePhotoURL(value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setFormData(prev => ({ ...prev, photoURL: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle image URL input
  const handleImageUrlChange = (url) => {
    setFormData(prev => ({ ...prev, photoURL: url }));
    setImagePreview(url);
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    newErrors.name = validateName(formData.name);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.address = validateAddress(formData.address);
    newErrors.photoURL = validatePhotoURL(formData.photoURL);
    
    // Remove null errors
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key] === null) delete newErrors[key];
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorFields = Object.keys(errors).filter(key => errors[key]);
      const errorMessage = errorFields.length === 1 
        ? `Please fix the error in the ${errorFields[0]} field`
        : `Please fix the errors in the following fields: ${errorFields.join(', ')}`;
      
      toast.error(errorMessage);
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        photoURL: formData.photoURL.trim(),
      });
      
      toast.success('Profile Updated Successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  // Get role-specific styling
  const getRoleColors = () => {
    switch (userRole) {
      case 'admin':
        return {
          primary: 'from-red-500 to-pink-500',
          accent: 'border-red-200 focus:border-red-400',
          button: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
        };
      case 'chef':
        return {
          primary: 'from-orange-500 to-amber-500',
          accent: 'border-orange-200 focus:border-orange-400',
          button: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
        };
      default:
        return {
          primary: 'from-blue-500 to-indigo-500',
          accent: 'border-blue-200 focus:border-blue-400',
          button: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
        };
    }
  };

  const roleColors = getRoleColors();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Validation Status Banner */}
      {Object.keys(errors).some(key => errors[key]) && (
        <motion.div
          className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <HiX className="w-5 h-5 text-error" />
            <div>
              <h4 className="font-semibold text-error">Please fix the following errors:</h4>
              <ul className="text-sm text-error/80 mt-1 list-disc list-inside">
                {Object.keys(errors).filter(key => errors[key]).map(key => (
                  <li key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {errors[key]}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Profile Picture Section */}
        <motion.div
          className="card bg-base-100 shadow-xl border border-base-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="card-body">
            <div className={`flex items-center space-x-3 mb-6 pb-4 border-b border-base-200`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${roleColors.primary} flex items-center justify-center`}>
                <HiCamera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-base-content">Profile Picture</h3>
                <p className="text-sm text-base-content/60">Upload or provide a URL for your profile picture</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Profile Picture Preview */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-base-200 border-4 border-base-300 group-hover:border-primary/50 transition-all duration-300">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiUser className="w-12 h-12 text-base-content/30" />
                      </div>
                    )}
                  </div>
                  
                  {/* Upload overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <HiCamera className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    px-6 py-2 rounded-xl text-white font-medium transition-all duration-300
                    ${roleColors.button} shadow-lg hover:shadow-xl transform hover:scale-105
                    focus:outline-none focus:ring-4 focus:ring-primary/20
                  `}
                >
                  <HiUpload className="w-4 h-4 mr-2 inline" />
                  Upload Image
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* URL Input */}
              <div className="flex-1 w-full">
                <InputField
                  label="Profile Picture URL"
                  name="photoURL"
                  placeholder="https://example.com/your-photo.jpg"
                  description="Alternatively, you can provide a direct URL to your profile picture"
                  value={formData.photoURL}
                  onChange={handleInputChange}
                  error={errors.photoURL}
                  roleColors={roleColors}
                />
                
                {formData.photoURL && formData.photoURL !== imagePreview && (
                  <button
                    type="button"
                    onClick={() => handleImageUrlChange(formData.photoURL)}
                    className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Preview URL Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          className="card bg-base-100 shadow-xl border border-base-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="card-body">
            <div className={`flex items-center space-x-3 mb-6 pb-4 border-b border-base-200`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${roleColors.primary} flex items-center justify-center`}>
                <HiUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-base-content">Basic Information</h3>
                <p className="text-sm text-base-content/60">Update your personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="name"
                icon={HiUser}
                placeholder="Enter your full name"
                required
                description="This name will be displayed in the navbar and throughout the application"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                roleColors={roleColors}
              />
              
              <InputField
                label="Email Address"
                name="email"
                type="email"
                icon={HiMail}
                placeholder="Your email address"
                disabled
                description="Email cannot be changed for security reasons"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                roleColors={roleColors}
              />
              
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                icon={HiPhone}
                placeholder="Enter your phone number"
                description="Optional - for contact purposes"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                roleColors={roleColors}
              />
              
              <div className="lg:col-span-2">
                <InputField
                  label="Address"
                  name="address"
                  icon={HiLocationMarker}
                  placeholder="Enter your full address"
                  required
                  description="Your location for delivery and contact purposes"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                  roleColors={roleColors}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                photoURL: initialData.photoURL || '',
              });
              setImagePreview(initialData.photoURL || '');
              setErrors({});
            }}
            className="px-8 py-3 rounded-xl border-2 border-base-300 text-base-content font-medium hover:bg-base-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-base-300/20"
            disabled={loading}
          >
            Reset Changes
          </button>
          
          <button
            type="submit"
            disabled={loading || Object.keys(errors).some(key => errors[key])}
            className={`
              px-8 py-3 rounded-xl text-white font-bold transition-all duration-300
              ${roleColors.button} shadow-lg hover:shadow-xl transform hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-primary/20
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              min-w-40 flex items-center justify-center
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <HiCheck className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default ModernProfileForm;
