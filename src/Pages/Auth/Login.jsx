import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import {
  HiMail,
  HiLockClosed,
  HiArrowRight,
  HiExclamationCircle,
  HiCheckCircle,
  HiShieldCheck,
  HiSparkles,
  HiUser,
  HiCake,
  HiUserGroup,
} from "react-icons/hi";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
import { useLoadingState } from "../../hooks/useLoadingState";
import toast from "react-hot-toast";
import { buildApiUrl } from "../../config/api";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const { startLoading, stopLoading } = useLoadingState();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Watch form values for real-time validation feedback
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Demo credentials
  const demoCredentials = {
    admin: {
      email: "admin@gmail.com",
      password: "Abcdef1@",
      role: "Admin",
      icon: HiShieldCheck,
      color: "secondary",
    },
    chef: {
      email: "chef@gmail.com",
      password: "Abcdef1@",
      role: "Chef",
      icon: HiCake,
      color: "primary",
    },
    user: {
      email: "user@gmail.com",
      password: "Abcdef1@",
      role: "User",
      icon: HiUser,
      color: "accent",
    },
  };

  // Handle demo login
  const handleDemoLogin = (role) => {
    const credentials = demoCredentials[role];
    setValue("email", credentials.email);
    setValue("password", credentials.password);
    clearErrors();
    setAuthError("");

    toast.success(`Demo ${credentials.role} credentials loaded! 🎯`, {
      duration: 3000,
      icon: "🔑",
    });
  };

  // Enhanced error handling
  const getErrorMessage = (error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/invalid-credential":
        return "Invalid email or password. Please check your credentials.";
      default:
        return (
          error.message || "An unexpected error occurred. Please try again."
        );
    }
  };

  const onSubmit = async (data) => {
    setAuthError("");
    startLoading("Signing you in...");

    try {
      await signIn(data.email, data.password);
      toast.success("Welcome back! 🎉", {
        duration: 4000,
        icon: "👋",
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      toast.error(errorMessage);

      // Set specific field errors
      if (error.code === "auth/user-not-found") {
        setError("email", { type: "manual", message: "Email not found" });
      } else if (error.code === "auth/wrong-password") {
        setError("password", { type: "manual", message: "Incorrect password" });
      }
    } finally {
      stopLoading();
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setIsGoogleLoading(true);
    startLoading("Signing in with Google...");

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user exists in database, if not create them
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
          console.warn(
            "Failed to save user data, but authentication succeeded"
          );
        }
      } else if (checkUserResponse.ok) {
        // User exists, update last login
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
      }

      toast.success("Welcome back! 🎉", {
        duration: 4000,
        icon: "👋",
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google sign-in error:", error);
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
        <title>Sign In | LocalChefBazaar - Welcome Back</title>
        <meta
          name="description"
          content="Sign in to your LocalChefBazaar account to discover amazing local meals and connect with talented chefs."
        />
      </Helmet>

      <div className="auth-container flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="mx-auto h-20 w-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <HiShieldCheck className="h-10 w-10 text-primary relative z-10" />
            </motion.div>
            <motion.h1
              className="text-5xl font-display font-bold text-base-content mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p
              className="text-xl text-muted font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Sign in to continue your culinary journey
            </motion.p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="auth-card p-10"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Global Error Message */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  className="mb-8 p-5 bg-error/10 border border-error/20 rounded-2xl flex items-start gap-4 backdrop-blur-sm"
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <HiExclamationCircle className="h-6 w-6 text-error flex-shrink-0 mt-0.5" />
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-bold text-error mb-2">
                      Sign In Failed
                    </h4>
                    <p className="text-sm text-error/90 leading-relaxed">
                      {authError}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email/Password Form */}
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <motion.div
                className={`form-group ${
                  errors.email
                    ? "error"
                    : emailValue && !errors.email
                    ? "success"
                    : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
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
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.email.message}
                    </motion.div>
                  )}
                  {emailValue && !errors.email && (
                    <motion.div
                      className="form-success"
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HiCheckCircle className="h-4 w-4 flex-shrink-0" />
                      Email looks good!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div
                className={`form-group ${
                  errors.password
                    ? "error"
                    : passwordValue && !errors.password
                    ? "success"
                    : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <HiLockClosed className="form-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`form-input ${
                      errors.password
                        ? "error"
                        : passwordValue && !errors.password
                        ? "success"
                        : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    onChange={handleInputChange}
                  />
                  <motion.button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                      {errors.password.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="form-checkbox"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 text-sm font-medium text-muted"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className="btn-auth-primary group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="btn-auth-loading">
                    <div className="btn-auth-spinner"></div>
                    <span className="relative z-10">Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Sign In</span>
                    <HiArrowRight className="btn-auth-icon" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Social Authentication Section */}
            <motion.div
              className="social-auth-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className="social-auth-title">Or continue with</div>

              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isSubmitting}
                className="btn-google-auth"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGoogleLoading ? (
                  <div className="btn-auth-loading">
                    <div className="btn-auth-spinner"></div>
                    <span>Signing in with Google...</span>
                  </div>
                ) : (
                  <>
                    <FaGoogle className="btn-google-auth-icon text-red-500" />
                    <span>Continue with Google</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Demo Login Section */}
            <motion.div
              className="demo-login-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <div className="demo-login-title">
                <HiSparkles className="inline w-4 h-4 mr-2 text-primary" />
                Quick Demo Access
              </div>

              <div className="demo-buttons-grid">
                {Object.entries(demoCredentials).map(
                  ([key, credentials], index) => {
                    const IconComponent = credentials.icon;
                    return (
                      <motion.button
                        key={key}
                        type="button"
                        onClick={() => handleDemoLogin(key)}
                        disabled={isSubmitting || isGoogleLoading}
                        className={`btn-demo btn-demo-${key}`}
                        aria-label={`Demo login as ${credentials.role}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent className="demo-icon" />
                        <div className="flex flex-col items-center">
                          <span className="demo-role-label">
                            {credentials.role}
                          </span>
                          <span className="demo-email-label">
                            {credentials.email}
                          </span>
                        </div>
                      </motion.button>
                    );
                  }
                )}
              </div>

              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <p className="text-xs text-muted leading-relaxed">
                  Click any role to auto-fill login credentials for testing
                </p>
              </motion.div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-surface text-muted font-medium">
                    New to LocalChefBazaar?
                  </span>
                </div>
              </div>
              <motion.div className="mt-6" whileHover={{ scale: 1.05 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 font-bold text-primary hover:text-primary/80 transition-all duration-300 group text-lg"
                >
                  Create your account
                  <HiSparkles className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center text-sm text-muted leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            By signing in, you agree to our{" "}
            <Link
              to="/terms"
              className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200 hover:underline"
            >
              Privacy Policy
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
