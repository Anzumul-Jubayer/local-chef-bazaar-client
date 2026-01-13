// Validation utilities for profile forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return null; // Password is optional for updates
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
  if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character";
  return null;
};

export const validateName = (name) => {
  if (!name || name.trim().length === 0) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters long";
  if (name.trim().length > 50) return "Name must be less than 50 characters";
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Name can only contain letters and spaces";
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return "Please enter a valid phone number";
  }
  return null;
};

export const validateAddress = (address) => {
  if (!address || address.trim().length === 0) return "Address is required";
  if (address.trim().length < 10) return "Please provide a more detailed address";
  if (address.trim().length > 200) return "Address must be less than 200 characters";
  return null;
};

export const validateUrl = (url) => {
  if (!url) return null; // URL is optional
  try {
    new URL(url);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
};

export const validateBio = (bio) => {
  if (!bio) return null; // Bio is optional
  if (bio.length > 500) return "Bio must be less than 500 characters";
  return null;
};

export const validateSpecialty = (specialty) => {
  if (!specialty) return null; // Specialty is optional
  if (specialty.length > 100) return "Specialty must be less than 100 characters";
  return null;
};

export const validateExperience = (experience) => {
  if (!experience) return null; // Experience is optional
  const exp = parseInt(experience);
  if (isNaN(exp) || exp < 0 || exp > 50) {
    return "Experience must be a number between 0 and 50";
  }
  return null;
};

// Password strength checker
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "No password", color: "text-base-content/50" };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  const strengthLevels = {
    0: { label: "Very Weak", color: "text-error" },
    1: { label: "Weak", color: "text-error" },
    2: { label: "Fair", color: "text-warning" },
    3: { label: "Good", color: "text-info" },
    4: { label: "Strong", color: "text-success" },
    5: { label: "Very Strong", color: "text-success" },
  };
  
  return { score, ...strengthLevels[score], checks };
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const validator = rules[field];
    const value = formData[field];
    const error = validator(value);
    if (error) {
      errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// File validation for profile pictures
export const validateProfileImage = (file) => {
  if (!file) return null;
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return "Please upload a valid image file (JPEG, PNG, or WebP)";
  }
  
  if (file.size > maxSize) {
    return "Image size must be less than 5MB";
  }
  
  return null;
};

// Image preview helper
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};