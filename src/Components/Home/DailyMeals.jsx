import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DailyMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/meals?limit=6&page=1");
      const data = await res.json();
      setMeals(data.data); 
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="py-12 px-4 bg-neutral min-h-screen">
      <h2 className="text-3xl lg:text-4xl font-bold text-center text-primary mb-10">
        Daily Meals
      </h2>

      {loading ? (
        <p className="text-center text-white">Loading meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-white">No meals found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {meals.map((meal) => (
            <motion.div
              key={meal._id}
              className="bg-neutral/90 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            >
              <img
                src={meal.image}
                alt={meal.foodName}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {meal.foodName}
                </h3>
                <p className="text-gray-300 mb-1">Chef: {meal.chefName}</p>
                <p className="text-gray-300 mb-1">Price: {meal.price} BDT</p>
                <p className="text-gray-300 mb-1">Rating: {meal.rating} ⭐</p>
                <p className="text-gray-300 mb-3">
                  Delivery Area: {meal.deliveryArea}
                </p>
                <button
                  className="w-full py-2 bg-primary text-neutral rounded-lg hover:bg-[#b9932c] transition"
                  onClick={() => {
                    
                    window.location.href = `/meal-details/${meal._id}`;
                  }}
                >
                  See Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyMeals;
