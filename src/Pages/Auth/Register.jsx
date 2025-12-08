import React, { useState, useContext } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";


const Register = () => {
  const { createUser, updateProfileFunc } = useContext(AuthContext);

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

      // 3️⃣ Backend data save (commented)
      /*
      const user = {
        name: data.name,
        email: data.email,
        address: data.address,
        password: data.password, // production এ hashed password use করো
        photoURL,
        status: "active",
      };

      const saveRes = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!saveRes.ok) throw new Error("Failed to save user");
      */

      toast.success("Registration successful!");
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

      <div className="min-h-screen py-20 flex items-center justify-center bg-linear-to-r from-[#1A1A1A] to-[#111111] px-4">
        <div className="max-w-md w-full bg-neutral/90 p-10 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-primary text-center mb-6">
            Register at LocalChefBazaar
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-soft-gray mb-2">Full Name</label>
              <input
                placeholder="Enter your full name"
                className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-soft-gray mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Profile Image */}
            <div className="flex flex-col">
              <label className="text-soft-gray mb-2">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="p-2 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("profile", { required: "Profile image is required" })}
              />
              {errors.profile && <p className="text-red-500 text-sm">{errors.profile.message}</p>}
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-soft-gray mb-2">Address</label>
              <input
                placeholder="Enter your address"
                className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label className="text-soft-gray mb-2">Password</label>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                    message:
                      "Must contain 8+ chars, uppercase, lowercase, number & special symbol",
                  },
                })}
              />
              <span
                className="absolute right-3 bottom-4 cursor-pointer text-gray-400 hover:text-primary"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col relative">
              <label className="text-soft-gray mb-2">Confirm Password</label>
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm your password"
                className="p-3 rounded-lg border border-gray-700 bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              <span
                className="absolute right-3 bottom-4 cursor-pointer text-gray-400 hover:text-primary"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-neutral rounded-lg font-semibold hover:bg-[#b9932c] transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-white mt-5 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
