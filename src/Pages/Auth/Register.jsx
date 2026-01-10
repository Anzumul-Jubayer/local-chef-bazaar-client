import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { 
  HiUser, 
  HiMail, 
  HiLockClosed, 
  HiLocationMarker, 
  HiPhotograph,
  HiArrowRight,
  HiUserAdd
} from "react-icons/hi";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Register = () => {
  const { createUser, updateProfileFunc } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", data.profile[0]);

      const apiKey = "f3c5a5d662d5437946e3078c7e9e3e2b";
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!result.success) throw new Error("Image upload failed");

      const photoURL = result.data.url;

      const userCredential = await createUser(data.email, data.password);
      const currentUser = userCredential.user;

      await updateProfileFunc(currentUser, data.name, photoURL);

      const user = {
        name: data.name,
        email: data.email,
        address: data.address,
        password: data.password,
        photoURL,
        status: "active",
        role: "user",
      };

      const saveRes = await fetch(
        "https://local-chef-bazaar-server-flame.vercel.app/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );

      if (!saveRes.ok) throw new Error("Failed to save user");

      toast.success("Registration successful!");
      navigate("/");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | LocalChefBazaar</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <HiUserAdd className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-base-content">
              Join LocalChefBazaar
            </h2>
            <p className="mt-2 text-muted">
              Create your account to start exploring amazing local meals
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="card-elevated p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-base-content mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiUser className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className={`input-modern pl-10 ${errors.name ? 'border-error' : ''}`}
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && (
                  <motion.p 
                    className="mt-2 text-sm text-error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-base-content mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className={`input-modern pl-10 ${errors.email ? 'border-error' : ''}`}
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    className="mt-2 text-sm text-error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Profile Image */}
              <div>
                <label htmlFor="profile" className="block text-sm font-medium text-base-content mb-2">
                  Profile Image
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiPhotograph className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    id="profile"
                    type="file"
                    accept="image/*"
                    className={`input-modern pl-10 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:transition-colors ${errors.profile ? 'border-error' : ''}`}
                    {...register("profile", {
                      required: "Profile image is required",
                    })}
                  />
                </div>
                {errors.profile && (
                  <motion.p 
                    className="mt-2 text-sm text-error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {errors.profile.message}
                  </motion.p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-base-content mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLocationMarker className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    autoComplete="address-line1"
                    placeholder="Enter your address"
                    className={`input-modern pl-10 ${errors.address ? 'border-error' : ''}`}
                    {...register("address", { required: "Address is required" })}
                  />
                </div>
                {errors.address && (
                  <motion.p 
                    className="mt-2 text-sm text-error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {errors.address.message}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-base-content mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    className={`input-modern pl-10 pr-10 ${errors.password ? 'border-error' : ''}`}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                        message: "Must contain 8+ chars, uppercase, lowercase, number & special symbol",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <FaEyeSlash className="h-4 w-4 text-muted hover:text-base-content transition-colors" />
                    ) : (
                      <FaEye className="h-4 w-4 text-muted hover:text-base-content transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    className="mt-2 text-sm text-error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-base-content mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className={`input-modern pl-10 pr-10 ${errors.confirmPassword ? 'border-error' : ''}`}
                    {...register("confirmPassword", {
                      required: "Confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? (
                      <FaEyeSlash className="h-4 w-4 text-muted hover:text-base-content transition-colors" />
                    ) : (
                      <FaEye className="h-4 w-4 text-muted hover:text-base-content transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p 
                    className="mt-2 text-sm text-error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary-modern group"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-color" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-muted">Already have an account?</span>
                </div>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center text-xs text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            By creating an account, you agree to our{" "}
            <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Register;
