import React, { useState } from "react";
import { Link } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  // Handle image upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center bg-linear-to-r from-[#1A1A1A] to-[#111111] px-4">
      <div className="max-w-md w-full bg-neutral/90 p-10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Register at LocalChefBazaar
        </h2>

        <form className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-soft-gray mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-soft-gray mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          
          <div className="flex flex-col">
            <label className="text-soft-gray mb-2" htmlFor="profile">
              Profile Image
            </label>
            <input
              type="file"
              id="profile"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {profilePreview && (
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="w-24 h-24 mt-3 object-cover rounded-full border border-primary"
              />
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="text-soft-gray mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter your address"
              className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="text-soft-gray mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            />
            <span
              className="absolute right-3 bottom-4 cursor-pointer text-gray-400 hover:text-primary transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col relative">
            <label className="text-soft-gray mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your password"
              className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            />
            <span
              className="absolute right-3 bottom-4 cursor-pointer text-gray-400 hover:text-primary transition"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-neutral rounded-lg font-semibold hover:bg-[#b9932c] transition"
          >
            Register
          </button>
        </form>

        <p className="text-white mt-5 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
