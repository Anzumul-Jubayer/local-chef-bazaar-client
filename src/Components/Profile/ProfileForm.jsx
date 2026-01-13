import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiUser, 
  HiMail, 
  HiLocationMarker, 
  HiPhone,
  HiCamera,
  HiEye,
  HiEyeOff,
  HiCheck,
  HiX,
  HiExclamation,
  HiInformationCircle
} from 'react-icons/hi';
import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validatePhone, 
  validateAddress,
  validateBio,
  validateSpecialty,
  validateExperience,
  validateUrl,
  validateProfileImage,
  getPasswordStrength,
  createImagePreview
} from '../../utils/validation';
import toast from 'react-hot-toast';

const ProfileForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false, 
  userRole = 'user',
  showPasswordFields = true 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    specialty: '',
    experience: '',
    website: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.photoURL || '');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...initialData }));
    setImagePreview(initialData.photoURL || '');
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Real-time validation for specific fields
    if (field === 'email') {
      const emailError = validateEmail(value);
      if (emailError) {
        setErrors(prev => ({ ...prev, email: emailError }));
      }
    }
    
    if (field === 'name') {
      const nameError = validateName(value);
      if (nameError) {
        setErrors(prev => ({ ...prev, name: nameError }));
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageError = validateProfileImage(file);
    if (imageError) {
      setErrors(prev => ({ ...prev, profileImage: imageError }));
      return;
    }

    try {
      const preview = await createImagePreview(file);
      setProfileImage(file);
      setImagePreview(preview);
      setErrors(prev => ({ ...prev, profileImage: null }));
      setIsDirty(true);
    } catch (error) {
      toast.error('Failed to process image');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const addressError = validateAddress(formData.address);
    if (addressError) newErrors.address = addressError;

    // Role-specific validation
    if (userRole === 'chef') {
      const bioError = validateBio(formData.bio);
      if (bioError) newErrors.bio = bioError;

      const specialtyError = validateSpecialty(formData.specialty);
      if (specialtyError) newErrors.specialty = specialtyError;

      const experienceError = validateExperience(formData.experience);
      if (experienceError) newErrors.experience = experienceError;

      const websiteError = validateUrl(formData.website);
      if (websiteError) newErrors.website = websiteError;
    }

    // Password validation (only if passwords are provided)
    if (showPasswordFields && formData.newPassword) {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) newErrors.newPassword = passwordError;

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to set a new password";
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

    const submitData = new FormData();
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      if (formData[key] && key !== 'confirmPassword') {
        submitData.append(key, formData[key]);
      }
    });

    // Add profile image if selected
    if (profileImage) {
      submitData.append('profileImage', profileImage);
    }

    try {
      await onSubmit(submitData);
      setIsDirty(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const InputField = ({ 
    label, 
    name, 
    type = 'text', 
    icon: Icon, 
    placeholder, 
    required = false,
    multiline = false,
    rows = 3,
    description = null
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-base-content">
        {Icon && <Icon className="w-4 h-4 mr-2 text-base-content/70" />}
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      {multiline ? (
        <textarea
          name={name}
          value={formData[name] || ''}
          onChange={(e) => handleInputChange(name, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`textarea textarea-bordered w-full transition-colors ${
            errors[name] ? 'border-error focus:border-error' : 'focus:border-primary'
          }`}
        />
      ) : (
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
      )}
      
      {description && (
        <p className="text-xs text-base-content/60 flex items-center">
          <HiInformationCircle className="w-3 h-3 mr-1" />
          {description}
        </p>
      )}
      
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-error text-sm flex items-center"
          >
            <HiExclamation className="w-4 h-4 mr-1" />
            {errors[name]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  const PasswordField = ({ label, name, placeholder }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-base-content">
        {label}
        <span className="text-error ml-1">*</span>
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
      
      {name === 'newPassword' && formData.newPassword && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/70">Password Strength:</span>
            <span className={`font-medium ${passwordStrength.color}`}>
              {passwordStrength.label}
            </span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                passwordStrength.score <= 1 ? 'bg-error' :
                passwordStrength.score <= 2 ? 'bg-warning' :
                passwordStrength.score <= 3 ? 'bg-info' : 'bg-success'
              }`}
              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-error text-sm flex items-center"
          >
            <HiExclamation className="w-4 h-4 mr-1" />
            {errors[name]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Image Section */}
      <div className="card-modern p-6">
        <h3 className="text-lg font-semibold text-base-content mb-4">Profile Picture</h3>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-base-300 shadow-lg">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-base-200 flex items-center justify-center">
                  <HiUser className="w-8 h-8 text-base-content/50" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
              <HiCamera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="text-center sm:text-left">
            <p className="text-sm text-base-content/70 mb-2">
              Upload a new profile picture. Recommended size: 400x400px
            </p>
            <p className="text-xs text-base-content/50">
              Supported formats: JPEG, PNG, WebP (max 5MB)
            </p>
            {errors.profileImage && (
              <p className="text-error text-sm mt-2 flex items-center">
                <HiExclamation className="w-4 h-4 mr-1" />
                {errors.profileImage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="card-modern p-6">
        <h3 className="text-lg font-semibold text-base-content mb-6">Basic Information</h3>
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
            description="This will be used for login and notifications"
          />
          
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            icon={HiPhone}
            placeholder="Enter your phone number"
            description="Optional - for order notifications"
          />
          
          <div className="md:col-span-2">
            <InputField
              label="Address"
              name="address"
              icon={HiLocationMarker}
              placeholder="Enter your full address"
              required
              multiline
              rows={2}
              description="This will be used for delivery purposes"
            />
          </div>
        </div>
      </div>

      {/* Role-specific fields */}
      {userRole === 'chef' && (
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold text-base-content mb-6">Chef Information</h3>
          <div className="space-y-6">
            <InputField
              label="Bio"
              name="bio"
              placeholder="Tell customers about yourself and your cooking style"
              multiline
              rows={4}
              description="Share your culinary journey and what makes your food special"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Specialty"
                name="specialty"
                placeholder="e.g., Italian Cuisine, Vegan Dishes"
                description="Your main cooking specialty or cuisine type"
              />
              
              <InputField
                label="Years of Experience"
                name="experience"
                type="number"
                placeholder="0"
                description="How many years have you been cooking professionally?"
              />
            </div>
            
            <InputField
              label="Website"
              name="website"
              type="url"
              placeholder="https://your-website.com"
              description="Optional - link to your personal website or social media"
            />
          </div>
        </div>
      )}

      {userRole === 'admin' && (
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold text-base-content mb-6">Admin Information</h3>
          <div className="space-y-6">
            <InputField
              label="Department"
              name="department"
              placeholder="e.g., Operations, Customer Service"
              description="Your department or area of responsibility"
            />
            
            <InputField
              label="Employee ID"
              name="employeeId"
              placeholder="Enter your employee ID"
              description="Internal employee identification number"
            />
          </div>
        </div>
      )}

      {/* Password Section */}
      {showPasswordFields && (
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold text-base-content mb-6">Change Password</h3>
          <div className="space-y-6">
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-info flex items-center">
                <HiInformationCircle className="w-4 h-4 mr-2" />
                Leave password fields empty if you don't want to change your password
              </p>
            </div>
            
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
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 text-sm text-base-content/60">
          {isDirty && (
            <>
              <HiExclamation className="w-4 h-4 text-warning" />
              <span>You have unsaved changes</span>
            </>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData({ ...initialData });
              setErrors({});
              setIsDirty(false);
              setImagePreview(initialData.photoURL || '');
              setProfileImage(null);
            }}
            className="btn btn-outline"
            disabled={loading || !isDirty}
          >
            Reset Changes
          </button>
          
          <button
            type="submit"
            disabled={loading || !isDirty}
            className="btn btn-primary min-w-32"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <HiCheck className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
