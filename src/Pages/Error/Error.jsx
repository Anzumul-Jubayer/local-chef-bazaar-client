// src/Pages/ErrorPage.jsx
import React from "react";
import { Link } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiHome, HiExclamation } from "react-icons/hi";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Error Icon */}
        <motion.div
          className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <HiExclamation className="w-12 h-12 text-error" />
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          className="text-8xl md:text-9xl font-display font-bold text-primary mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-base-content">
            Oops! Page Not Found
          </h2>
          <p className="text-muted leading-relaxed">
            The page you are looking for doesn't exist or has been moved. 
            Don't worry, let's get you back on track to discover amazing local meals.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-primary via-yellow-400 to-accent text-black font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden min-w-[180px]"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Pulsing Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
              
              {/* Button Content */}
              <div className="relative flex items-center space-x-3 z-10">
                <HiHome className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-bold">Go to Home</span>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Border Animation */}
              <div className="absolute inset-0 rounded-2xl border-4 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/meals"
              className="group relative inline-flex items-center justify-center bg-surface-elevated hover:bg-primary/10 text-base-content font-bold px-10 py-5 rounded-2xl border-2 border-primary/30 hover:border-primary/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden min-w-[180px]"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Button Content */}
              <div className="relative flex items-center space-x-3 z-10">
                <span className="text-lg font-bold group-hover:text-primary transition-colors duration-300">Browse Meals</span>
                <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>
              
              {/* Border Animation */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300"></div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Help Text */}
        <motion.p
          className="text-sm text-muted mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Need help? <a href="/contact" className="text-primary hover:text-primary/80 font-medium underline decoration-2 underline-offset-4 hover:decoration-primary/60 transition-all duration-300">Contact our support team</a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Error;
