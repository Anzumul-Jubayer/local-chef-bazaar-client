import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

const MyMeals = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMeal, setEditingMeal] = useState(null);

  // Fetch meals
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-flame.vercel.app/meals-by-chef/${user?.email}`
        );
        const data = await res.json();
        if (data.success) setMeals(data.data);
        else toast.error("Failed to load meals");
      } catch (err) {
        toast.error("Server error");
      }
      setLoading(false);
    };
    if (user?.email) loadMeals();
  }, [user]);

  // Delete meal
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-flame.vercel.app/meals/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();

        if (data.success) {
          Swal.fire("Deleted!", "Your meal has been deleted.", "success");
          setMeals((prev) => prev.filter((m) => m._id !== id));
        } else {
          Swal.fire("Error!", data.message || "Deletion failed", "error");
        }
      } catch (err) {
        Swal.fire("Error!", "Server error", "error");
      }
    }
  };

  // Update meal
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedMeal = {
      foodName: form.foodName.value,
      price: parseFloat(form.price.value),
      rating: parseFloat(form.rating.value),
      estimatedDeliveryTime: form.estimatedDeliveryTime.value,
      ingredients: form.ingredients.value.split(",").map((i) => i.trim()),
    };

    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-flame.vercel.app/meals/${editingMeal._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMeal),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Meal updated!");
        setMeals(
          meals.map((m) =>
            m._id === editingMeal._id ? { ...m, ...updatedMeal } : m
          )
        );
        setEditingMeal(null);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading)
    return <p className="text-white mt-20 text-center">Loading...</p>;

  return (
    <>
      <Helmet>
        <title>My Meals | LocalChefBazaar</title>
      </Helmet>

      <div className="min-h-screen bg-neutral text-white p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">
          My Meals
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <motion.div
              key={meal._id}
              className="bg-neutral/80 border border-gray-700 p-4 rounded-xl flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={meal.image}
                alt={meal.foodName}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{meal.foodName}</h3>
              <p>Chef: {meal.chefName}</p>
              <p>Chef ID: {meal.chefId}</p>
              <p>Price: ${meal.price}</p>
              <p>Rating: {meal.rating}</p>
              <p>Delivery: {meal.estimatedDeliveryTime} min</p>
              <p className="text-sm">
                Ingredients: {meal.ingredients.join(", ")}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleDelete(meal._id)}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingMeal(meal)}
                  className="px-3 py-1 bg-primary rounded hover:bg-[#b9932c] text-neutral"
                >
                  Update
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {editingMeal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral p-6 rounded-xl w-full max-w-lg border border-gray-700">
              <h3 className="text-2xl mb-4 font-bold text-primary">
                Update Meal
              </h3>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <input
                  type="text"
                  name="foodName"
                  defaultValue={editingMeal.foodName}
                  className="w-full p-2 rounded bg-gray-200 text-black"
                />
                <input
                  type="number"
                  name="price"
                  defaultValue={editingMeal.price}
                  className="w-full p-2 rounded bg-gray-200 text-black"
                />
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  max="5"
                  defaultValue={editingMeal.rating}
                  className="w-full p-2 rounded bg-gray-200 text-black"
                />
                <input
                  type="text"
                  name="estimatedDeliveryTime"
                  defaultValue={editingMeal.estimatedDeliveryTime}
                  className="w-full p-2 rounded bg-gray-200 text-black"
                />
                <textarea
                  name="ingredients"
                  defaultValue={editingMeal.ingredients.join(", ")}
                  className="w-full p-2 rounded bg-gray-200 text-black"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingMeal(null)}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-neutral rounded hover:bg-[#b9932c]"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyMeals;
