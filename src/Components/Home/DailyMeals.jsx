import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiStar, HiClock, HiLocationMarker, HiArrowRight, HiHeart } from "react-icons/hi";
import { useLoadingState } from "../../hooks/useLoadingState";
import { buildApiUrl } from "../../config/api";

const DailyMeals = () => {
  const [meals, setMeals] = useState([]);
  const { fetchWithLoading } = useLoadingState();

  const fetchMeals = async () => {
    try {
      const data = await fetchWithLoading(
        buildApiUrl("/meals?limit=6&page=1"),
        {},
        "Loading delicious meals..."
      );
      setMeals(data.data);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const MealCard = ({ meal, index }) => (
    <motion.div
      className="group card-modern overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={meal.image}
          alt={meal.foodName}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite Button */}
        <motion.button 
          className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
          whileHover={{ rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <HiHeart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
        </motion.button>

        {/* Rating Badge */}
        <motion.div 
          className="absolute top-4 left-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-yellow-200"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <HiStar className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
          <span className="text-sm font-bold text-gray-800">{meal.rating}</span>
        </motion.div>

        {/* Quick View Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <motion.button
            onClick={() => window.location.href = `/meal-details/${meal._id}`}
            className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button Background Glow */}
            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center space-x-2">
              <span className="text-sm font-bold">View Details</span>
              <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-500"></div>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {meal.foodName}
          </h3>
          <p className="text-sm text-muted mt-1">by {meal.chefName}</p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-muted">
              <HiLocationMarker className="w-4 h-4" />
              <span>{meal.deliveryArea}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted">
              <HiClock className="w-4 h-4" />
              <span>30 min</span>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 min-h-[60px] price-container">
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-primary price-with-currency transition-all duration-200">৳{meal.price}</span>
            </div>
            <span className="text-xs text-success font-medium mt-1">Free delivery</span>
          </div>
          
          <motion.button
            onClick={() => window.location.href = `/meal-details/${meal._id}`}
            className="group relative bg-gradient-to-r from-accent to-green-500 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button Content */}
            <div className="relative flex items-center space-x-1.5 sm:space-x-2">
              <span className="text-xs sm:text-sm font-bold whitespace-nowrap">Order Now</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Pulse Effect */}
            <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-20 bg-surface">
      <div className="container-modern">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <span className="text-sm font-medium text-primary">Today's Special</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-base-content mb-4">
            Daily Fresh Meals
          </h2>
          
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Discover handcrafted meals prepared by passionate local chefs using the freshest ingredients. 
            Each dish tells a story of tradition and flavor.
          </p>
        </motion.div>

        {/* Meals Grid */}
        {meals.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiStar className="w-12 h-12 text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-2">No meals available</h3>
            <p className="text-muted">Check back later for fresh daily meals from our chefs.</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals.map((meal, index) => (
                <MealCard key={meal._id} meal={meal} index={index} />
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.a
                href="/meals"
                className="group relative inline-flex items-center justify-center bg-surface border-2 border-primary/30 hover:border-primary text-base-content hover:text-primary font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 active:translate-y-0 min-w-[200px] overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center space-x-3">
                  <span className="text-lg font-bold">View All Meals</span>
                  <div className="relative">
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                  </div>
                </div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 scale-100 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </motion.a>
              
              {/* Additional Info */}
              <motion.p
                className="text-sm text-muted mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Discover <span className="font-semibold text-primary">500+</span> more delicious meals from local chefs
              </motion.p>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default DailyMeals;
