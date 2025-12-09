import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/meal-details/${id}`);
        if (!res.ok) throw new Error("Meal not found");
        const data = await res.json();
        setMeal(data);
      } catch (error) {
        console.error(error);
        toast.error("Meal not found");
        navigate("/meals"); 
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id, navigate]);

  if (loading) {
    return <p className="text-center text-white mt-20">Loading meal details...</p>;
  }

  if (!meal) return null;

  return (
    <>
    <Helmet>
        <title>Meal Details | LocalChefBazaar</title>
      </Helmet>
    <div className="py-12 px-4 bg-neutral min-h-screen">
      <motion.div
        className="max-w-4xl mx-auto bg-neutral/90 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={meal.image}
          alt={meal.foodName}
          className="w-full h-80 object-cover"
        />
        <div className="p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">{meal.foodName}</h2>
          <p className="mb-2">Chef: {meal.chefName}</p>
          <p className="mb-2">Chef ID: {meal.chefId}</p>
          <p className="mb-2">Price: {meal.price} BDT</p>
          <p className="mb-2">Rating: {meal.rating} ⭐</p>
          <p className="mb-2">Delivery Area: {meal.deliveryArea}</p>
          <p className="mb-2">Estimated Delivery Time: {meal.estimatedDeliveryTime}</p>
          <p className="mb-2">Chef's Experience: {meal.chefExperience}</p>
          <p className="mb-2">Ingredients: {meal.ingredients.join(", ")}</p>

          <button
            className="mt-5 w-full py-3 bg-primary text-neutral rounded-lg font-semibold hover:bg-[#b9932c] transition"
            onClick={() => navigate(`/order/${meal._id}`)}
          >
            Order Now
          </button>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default MealDetails;
