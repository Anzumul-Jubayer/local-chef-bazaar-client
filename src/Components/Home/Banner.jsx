import React from "react";
import { motion } from "framer-motion";
import heroImage from "../../assets/hero-chef.jpg";

const Banner = () => {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-30 bg-linear-to-b from-[#1A1A1A] via-[#222222] to-[#2D2D2D] text-white overflow-hidden">
      
      
      <motion.div
        className="lg:w-1/2 flex flex-col gap-6 z-10"
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
          Taste the <span className="text-primary">Homemade Magic</span>
        </h1>
        <p className="text-gray-300 text-lg lg:text-xl">
          LocalChefBazaar connects you with talented home chefs to enjoy fresh, healthy, homemade meals daily.
        </p>
        <div className="flex gap-4 mt-4">
          <a
            href="/meals"
            className="btn bg-primary hover:bg-[#b9932c] text-neutral border-none shadow-lg"
          >
            Explore Meals
          </a>
          <a
            href="/register"
            className="btn btn-outline text-white border-white hover:bg-white hover:text-neutral shadow-lg"
          >
            Become a Chef
          </a>
        </div>
      </motion.div>

      
      <motion.div
        className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center z-10"
        initial={{ x: 120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <img
          src={heroImage}
          alt="Chef Cooking"
          className="w-full max-w-lg rounded-3xl shadow-2xl border-4 border-primary"
        />
      </motion.div>

     
      <motion.div
        className="absolute top-[-50px] right-[-50px] w-60 h-60 bg-primary rounded-full opacity-30 -z-10"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      ></motion.div>
      <motion.div
        className="absolute bottom-[-40] left-[-40] w-52 h-52 bg-secondary rounded-full opacity-20 -z-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
      ></motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#D4AF37] rounded-full opacity-10 -z-20"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      ></motion.div>
    </section>
  );
};

export default Banner;
