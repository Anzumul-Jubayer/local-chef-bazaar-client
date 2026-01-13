import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import {
  HiUser,
  HiMail,
  HiLockClosed,
  HiLocationMarker,
  HiPhotograph,
  HiArrowRight,
  HiUserAdd,
  HiExclamationCircle,
  HiCheckCircle,
  HiSparkles,
  HiShieldCheck,
} from "react-icons/hi";
import { AuthContext } from "../../Context/AuthContext";
import { useLoadingState } from "../../hooks/useLoadingState";
import { buildApiUrl } from "../../config/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const { createUser, updateProfileFunc, signInWithGoogle } =
    useContext(AuthContext);
  const { startLoading, stopLoading } = useLoadingState();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Watch form values for real-time validation feedback
  const nameValue = watch("name");
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const addressValue = watch("address");
  const profileValue = watch("profile");

  // Enhanced error handling
  const getErrorMessage = (error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "An account with this email already exists. Please sign in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled. Please contact support.";
      case "auth/weak-password":
        return "Password is too weak. Please choose a stronger password.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      default:
        return (
          error.message || "An unexpected error occurred. Please try again."
        );
    }
  };

  // Handle file input change with preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("profile", {
          type: "manual",
          message: "File size must be less than 5MB",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("profile", {
          type: "manual",
          message: "Please select a valid image file",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      clearErrors("profile");
    }
  };

  const onSubmit = async (data) => {
    setAuthError("");
    startLoading("Creating your account...");

    try {
      // Upload image first
      const formData = new FormData();
      formData.append("image", data.profile[0]);

      const apiKey = "f3c5a5d662d5437946e3078c7e9e3e2b";
      const imageResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const imageResult = await imageResponse.json();
      if (!imageResult.success) {
        throw new Error("Failed to upload profile image. Please try again.");
      }

      const photoURL = imageResult.data.url;

      // Create user account
      const userCredential = await createUser(data.email, data.password);
      const currentUser = userCredential.user;

      // Update profile
      await updateProfileFunc(currentUser, data.name, photoURL);

      // Save user to database
      const userData = {
        name: data.name,
        email: data.email,
        address: data.address,
        photoURL,
        status: "active",
        role: "user",
        provider: "email",
        createdAt: new Date().toISOString(),
      };

      const saveResponse = await fetch(buildApiUrl("/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save user information. Please try again.");
      }

      toast.success(
        "Account created successfully! Welcome to LocalChefBazaar! 🎉",
        {
          duration: 5000,
          icon: "🚀",
        }
      );
      navigate("/");
      reset();
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      toast.error(errorMessage);

      // Set specific field errors
      if (error.code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "Email already registered",
        });
      } else if (error.code === "auth/weak-password") {
        setError("password", {
          type: "manual",
          message: "Password is too weak",
        });
      }
    } finally {
      stopLoading();
    }
  };

  const handleGoogleSignUp = async () => {
    setAuthError("");
    setIsGoogleLoading(true);
    startLoading("Creating account with Google...");

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user already exists in database
      const checkUserResponse = await fetch(
        buildApiUrl(`/users/email/${user.email}`)
      );

      if (!checkUserResponse.ok && checkUserResponse.status === 404) {
        // User doesn't exist, create new user
        const userData = {
          name: user.displayName || "Google User",
          email: user.email,
          photoURL: user.photoURL || "",
          status: "active",
          role: "user",
          provider: "google",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        const createUserResponse = await fetch(buildApiUrl("/users"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!createUserResponse.ok) {
          throw new Error("Failed to save user information. Please try again.");
        }

        toast.success("Welcome to LocalChefBazaar! 🎉", {
          duration: 5000,
          icon: "🚀",
        });
      } else if (checkUserResponse.ok) {
        // User already exists, just update last login
        const updateLoginResponse = await fetch(
          buildApiUrl(`/users/email/${user.email}`),
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lastLoginAt: new Date().toISOString(),
            }),
          }
        );

        if (!updateLoginResponse.ok) {
          console.warn("Failed to update last login time");
        }

        toast.success("Welcome back! 🎉", {
          duration: 4000,
          icon: "👋",
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Google sign-up error:", error);
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
      stopLoading();
    }
  };

  const handleInputChange = () => {
    if (authError) {
      setAuthError("");
      clearErrors();
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | LocalChefBazaar - Join Our Community</title>
        <meta
          name="description"
          content="Join LocalChefBazaar to discover amazing local meals, connect with talented chefs, and become part of our culinary community."
        />
      </Helmet>

      <div className="auth-container flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
              <HiUserAdd className="h-8 w-8 text-primary relative z-10" />
            </div>
            <h1 className="text-4xl font-display font-bold text-base-content mb-2">
              Join LocalChefBazaar
            </h1>
            <p className="text-lg text-muted">
              Create your account to start your culinary adventure
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="auth-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Global Error Message */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiExclamationCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-error mb-1">
                      Registration Failed
                    </h4>
                    <p className="text-sm text-error/80">{authError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div
                className={`form-group ${
                  errors.name
                    ? "error"
                    : nameValue && !errors.name
                    ? "success"
                    : ""
                }`}
              >
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="relative">
                  <HiUser className="form-icon" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className={`form-input ${
                      errors.name
                        ? "error"
                        : nameValue && !errors.name
                        ? "success"
                        : ""
                    }`}
                    {...register("name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Name can only contain letters and spaces",
                      },
                    })}
                    onChange={handleInputChange}
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.name.message}
                    </motion.div>
                  )}
                  {nameValue && !errors.name && (
                    <motion.div
                      className="form-success"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiCheckCircle className="h-4 w-4 flex-shrink-0" />
                      Name looks good!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Email */}
              <div
                className={`form-group ${
                  errors.email
                    ? "error"
                    : emailValue && !errors.email
                    ? "success"
                    : ""
                }`}
              >
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="relative">
                  <HiMail className="form-icon" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    className={`form-input ${
                      errors.email
                        ? "error"
                        : emailValue && !errors.email
                        ? "success"
                        : ""
                    }`}
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                    onChange={handleInputChange}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.email.message}
                    </motion.div>
                  )}
                  {emailValue && !errors.email && (
                    <motion.div
                      className="form-success"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiCheckCircle className="h-4 w-4 flex-shrink-0" />
                      Email looks good!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Image */}
              <div
                className={`form-group ${
                  errors.profile
                    ? "error"
                    : profileValue?.[0] && !errors.profile
                    ? "success"
                    : ""
                }`}
              >
                <label htmlFor="profile" className="form-label">
                  Profile Image
                </label>
                <div className="relative">
                  <HiPhotograph className="form-icon" />
                  <input
                    id="profile"
                    type="file"
                    accept="image/*"
                    className={`form-file-input ${
                      errors.profile
                        ? "error"
                        : profileValue?.[0] && !errors.profile
                        ? "success"
                        : ""
                    }`}
                    {...register("profile", {
                      required: "Profile image is required",
                    })}
                    onChange={(e) => {
                      handleFileChange(e);
                      handleInputChange();
                    }}
                  />
                </div>
                {imagePreview && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                    />
                  </div>
                )}
                <AnimatePresence>
                  {errors.profile && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.profile.message}
                    </motion.div>
                  )}
                  {profileValue?.[0] && !errors.profile && (
                    <motion.div
                      className="form-success"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiCheckCircle className="h-4 w-4 flex-shrink-0" />
                      Image selected successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Address */}
              <div
                className={`form-group ${
                  errors.address
                    ? "error"
                    : addressValue && !errors.address
                    ? "success"
                    : ""
                }`}
              >
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <div className="relative">
                  <HiLocationMarker className="form-icon" />
                  <input
                    id="address"
                    type="text"
                    autoComplete="address-line1"
                    placeholder="Enter your address"
                    className={`form-input ${
                      errors.address
                        ? "error"
                        : addressValue && !errors.address
                        ? "success"
                        : ""
                    }`}
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 10,
                        message: "Please provide a complete address",
                      },
                    })}
                    onChange={handleInputChange}
                  />
                </div>
                <AnimatePresence>
                  {errors.address && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.address.message}
                    </motion.div>
                  )}
                  {addressValue && !errors.address && (
                    <motion.div
                      className="form-success"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiCheckCircle className="h-4 w-4 flex-shrink-0" />
                      Address looks good!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div
                className={`form-group ${
                  errors.password
                    ? "error"
                    : passwordValue && !errors.password
                    ? "success"
                    : ""
                }`}
              >
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <HiLockClosed className="form-icon" />
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={`form-input ${
                      errors.password
                        ? "error"
                        : passwordValue && !errors.password
                        ? "success"
                        : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                        message:
                          "Password must contain 8+ characters, uppercase, lowercase, number & special character",
                      },
                    })}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.password.message}
                    </motion.div>
                  )}
                  {passwordValue && !errors.password && (
                    <motion.div
                      className="form-success"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiCheckCircle className="h-4 w-4 flex-shrink-0" />
                      Strong password!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password */}
              <div
                className={`form-group ${
                  errors.confirmPassword
                    ? "error"
                    : confirmPasswordValue && !errors.confirmPassword
                    ? "success"
                    : ""
                }`}
              >
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="relative">
                  <HiLockClosed className="form-icon" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className={`form-input ${
                      errors.confirmPassword
                        ? "error"
                        : confirmPasswordValue && !errors.confirmPassword
                        ? "success"
                        : ""
                    }`}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    aria-label={
                      showConfirmPass ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPass ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.confirmPassword.message}
                    </motion.div>
                  )}
                  {confirmPasswordValue && !errors.confirmPassword && (
                    <motion.div
                      className="form-success"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <HiCheckCircle className="h-4 w-4 flex-shrink-0" />
                      Passwords match!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className="btn-auth-primary group relative overflow-hidden"
              >
                {isSubmitting ? (
                  <div className="btn-auth-loading">
                    <div className="btn-auth-spinner"></div>
                    <span className="relative z-10">Creating account...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Create Account</span>
                    <HiArrowRight className="btn-auth-icon" />
                  </>
                )}
              </button>
            </form>

            {/* Social Authentication Section */}
            <div className="social-auth-section">
              <div className="social-auth-title">Or continue with</div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isSubmitting}
                className="btn-google-auth"
              >
                {isGoogleLoading ? (
                  <div className="btn-auth-loading">
                    <div className="btn-auth-spinner"></div>
                    <span>Creating account with Google...</span>
                  </div>
                ) : (
                  <>
                    <FaGoogle className="btn-google-auth-icon text-red-500" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface text-muted">
                    Already have an account?
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors group"
                >
                  Sign in here
                  <HiShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center text-sm text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            By creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Privacy Policy
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Register;
