import React, { useState } from 'react';
import { HiUser, HiMail, HiLocationMarker, HiPhone, HiEye, HiEyeOff, HiCheck, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const SimpleProfileForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    photoURL: initialData.photoURL || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Simple validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Password validation (only if new password is provided)
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      
      if (!validatePassword(formData.newPassword)) {
        newErrors.newPassword = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      photoURL: formData.photoURL.trim(),
    };

    // Add password if provided
    if (formData.newPassword) {
      submitData.password = formData.newPassword;
    }

    try {
      await onSubmit(submitData);
      toast.success('Profile updated successfully! Changes will appear in the navbar immediately.');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, required = false }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-base-content">
        {Icon && <Icon className="w-4 h-4 mr-2 text-base-content/70" />}
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={(e) => handleInputChange(name, e.target.value)}
        placeholder={placeholder}
        className={`input input-bordered w-full transition-colors ${
          errors[name] ? 'border-error focus:border-error' : 'focus:border-primary'
        }`}
      />
      
      {errors[name] && (
        <p className="text-error text-sm flex items-center">
          <HiX className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const PasswordField = ({ label, name, placeholder }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-base-content">
        {label}
      </label>
      
      <div className="relative">
        <input
          type={showPasswords[name] ? 'text' : 'password'}
          name={name}
          value={formData[name] || ''}
          onChange={(e) => handleInputChange(name, e.target.value)}
          placeholder={placeholder}
          className={`input input-bordered w-full pr-12 transition-colors ${
            errors[name] ? 'border-error focus:border-error' : 'focus:border-primary'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPasswords(prev => ({ ...prev, [name]: !prev[name] }))}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
        >
          {showPasswords[name] ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
        </button>
      </div>
      
      {errors[name] && (
        <p className="text-error text-sm flex items-center">
          <HiX className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Profile Picture Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-lg">Profile Picture</h3>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
                {formData.photoURL ? (
                  <img
                    src={formData.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HiUser className="w-8 h-8 text-base-content/50" />
                )}
              </div>
              <div className="flex-1">
                <InputField
                  label="Profile Picture URL"
                  name="photoURL"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="name"
                icon={HiUser}
                placeholder="Enter your full name"
                required
              />
              
              <InputField
                label="Email Address"
                name="email"
                type="email"
                icon={HiMail}
                placeholder="Enter your email"
                required
              />
              
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                icon={HiPhone}
                placeholder="Enter your phone number"
              />
              
              <div className="md:col-span-2">
                <InputField
                  label="Address"
                  name="address"
                  icon={HiLocationMarker}
                  placeholder="Enter your full address"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Change Password</h3>
            <div className="alert alert-info mb-4">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Leave password fields empty if you don't want to change your password</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <PasswordField
                label="Current Password"
                name="currentPassword"
                placeholder="Enter your current password"
              />
              
              <PasswordField
                label="New Password"
                name="newPassword"
                placeholder="Enter your new password"
              />
              
              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Confirm your new password"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                photoURL: initialData.photoURL || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
              setErrors({});
            }}
            className="btn btn-outline"
            disabled={loading}
          >
            Reset
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary min-w-32"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <HiCheck className="w-4 h-4 mr-2" />
                Update Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimpleProfileForm;
