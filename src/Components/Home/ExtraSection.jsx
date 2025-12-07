import React from "react";
import { motion } from "framer-motion";
import { FaUtensils, FaLeaf, FaTruck } from "react-icons/fa";

const ExtraSection = () => {
  const features = [
    {
      icon: <FaUtensils className="text-primary text-4xl" />,
      title: "Authentic Recipes",
      desc: "Enjoy homemade meals prepared with traditional recipes by local chefs.",
    },
    {
      icon: <FaLeaf className="text-primary text-4xl" />,
      title: "Fresh Ingredients",
      desc: "All meals are made from fresh, locally sourced ingredients for best taste.",
    },
    {
      icon: <FaTruck className="text-primary text-4xl" />,
      title: "Fast Delivery",
      desc: "Get your meals delivered hot and on time directly to your doorstep.",
    },
  ];

  return (
    <section className="bg-[#1C1C1C] text-white py-20 px-6 lg:px-20">
      <motion.h2
        className="text-4xl lg:text-5xl font-bold text-center mb-12 text-primary"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Why Choose LocalChefBazaar
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-[#2C2C2C] p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
          >
            <div className="mb-6 flex justify-center">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-300">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExtraSection;
