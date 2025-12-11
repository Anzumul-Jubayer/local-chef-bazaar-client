import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import { Helmet } from "react-helmet";

const CreateMeal = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const imgbbApiKey = "f3c5a5d662d5437946e3078c7e9e3e2b";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const imgData = await imgbbRes.json();

      if (!imgData.success) {
        toast.error("Image upload failed!");
        setLoading(false);
        return;
      }

      const meal = {
        foodName: data.foodName,
        chefName: data.chefName,
        image: imgData.data.url,
        price: parseFloat(data.price),
        rating: parseFloat(data.rating),
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        deliveryArea: data.deliveryArea,
        chefId: data.chefId,
        userEmail: user?.email,
        createdAt: new Date(),
      };

      const res = await fetch("http://localhost:3000/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Meal created successfully!");
        reset();
      } else {
        toast.error("Failed to create meal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Create Meal | LocalChefBazaar</title>
      </Helmet>

      {/* Main Wrapper */}
      <div className="min-h-screen bg-neutral text-white py-8 px-4 overflow-x-hidden">

        {/* Card Container */}
        <div className="max-w-3xl w-full mx-auto bg-neutral/80 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">

          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-primary">
            Create Meal
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Food Name */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Food Name</label>
              <input
                type="text"
                {...register("foodName", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.foodName && <span className="text-red-500">Required</span>}
            </div>

            {/* Chef Name */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Chef Name</label>
              <input
                type="text"
                {...register("chefName", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.chefName && <span className="text-red-500">Required</span>}
            </div>

            {/* Food Image */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Food Image</label>
              <input
                type="file"
                accept="image/*"
                {...register("image", { required: true })}
                className="p-2 rounded text-black bg-white w-full"
              />
              {errors.image && <span className="text-red-500">Required</span>}
            </div>

            {/* Price */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.price && <span className="text-red-500">Required</span>}
            </div>

            {/* Rating */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register("rating", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.rating && <span className="text-red-500">Required</span>}
            </div>

            {/* Ingredients */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Ingredients (comma separated)</label>
              <input
                type="text"
                {...register("ingredients", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.ingredients && <span className="text-red-500">Required</span>}
            </div>

            {/* Estimated Delivery Time */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Estimated Delivery Time</label>
              <input
                type="text"
                {...register("estimatedDeliveryTime", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.estimatedDeliveryTime && (
                <span className="text-red-500">Required</span>
              )}
            </div>

            {/* Chef Experience */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Chef Experience</label>
              <input
                type="text"
                {...register("chefExperience", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.chefExperience && (
                <span className="text-red-500">Required</span>
              )}
            </div>

            {/* Delivery Area */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Delivery Area</label>
              <input
                type="text"
                {...register("deliveryArea", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.deliveryArea && (
                <span className="text-red-500">Required</span>
              )}
            </div>

            {/* Chef ID */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Chef ID</label>
              <input
                type="text"
                {...register("chefId", { required: true })}
                className="p-2 rounded text-black bg-gray-200 w-full"
              />
              {errors.chefId && <span className="text-red-500">Required</span>}
            </div>

            {/* User Email */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">User Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="p-2 rounded text-black bg-gray-200 cursor-not-allowed w-full"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 px-6 py-2 bg-primary text-neutral rounded-lg font-semibold hover:bg-[#b9932c] transition"
            >
              {loading ? "Creating..." : "Create Meal"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateMeal;
