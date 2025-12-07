// src/Pages/LoadingPage.jsx
import React from "react";
import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-[#1A1A1A] to-[#111111] px-4">
      
      {/* Spinner */}
      <motion.div
        className="w-20 h-20 border-4 border-t-primary border-b-primary border-l-gray-700 border-r-gray-700 rounded-full mb-6"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      ></motion.div>

      {/* Loading Text */}
      <motion.p
        className="text-white text-lg lg:text-2xl font-semibold"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      >
        Loading LocalChefBazaar...
      </motion.p>
    </div>
  );
};

export default LoadingPage;
