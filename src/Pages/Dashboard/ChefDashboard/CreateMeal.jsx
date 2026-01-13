import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import { buildApiUrl } from "../../../config/api";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  HiPlus, 
  HiPhotograph, 
  HiCurrencyDollar, 
  HiStar, 
  HiClock,
  HiLocationMarker,
  HiUser,
  HiCollection,
  HiSparkles,
  HiCheck
} from "react-icons/hi";

const CreateMeal = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const imgbbApiKey = "f3c5a5d662d5437946e3078c7e9e3e2b";

  // Watch for image file changes
  const watchImage = watch("image");
  React.useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Upload image to ImgBB
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

      // Create meal object
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

      // Submit meal to server
      const res = await fetch(buildApiUrl("/meals"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Meal created successfully!");
        reset();
        setImagePreview(null);
      } else {
        toast.error("Failed to create meal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const formFields = [
    {
      name: "foodName",
      label: "Food Name",
      type: "text",
      icon: HiCollection,
      placeholder: "Enter delicious meal name",
      required: true,
      description: "Give your meal an appetizing name"
    },
    {
      name: "chefName",
      label: "Chef Name",
      type: "text",
      icon: HiUser,
      placeholder: "Your chef name",
      required: true,
      description: "How customers will know you"
    },
    {
      name: "price",
      label: "Price (৳)",
      type: "number",
      icon: HiCurrencyDollar,
      placeholder: "0.00",
      required: true,
      step: "0.01",
      description: "Set a competitive price"
    },
    {
      name: "rating",
      label: "Initial Rating",
      type: "number",
      icon: HiStar,
      placeholder: "4.5",
      required: true,
      step: "0.1",
      min: "0",
      max: "5",
      description: "Rate your meal (0-5 stars)"
    },
    {
      name: "estimatedDeliveryTime",
      label: "Delivery Time",
      type: "text",
      icon: HiClock,
      placeholder: "30-45 minutes",
      required: true,
      description: "Estimated preparation and delivery time"
    },
    {
      name: "chefExperience",
      label: "Chef Experience",
      type: "text",
      icon: HiSparkles,
      placeholder: "5 years in Italian cuisine",
      required: true,
      description: "Your culinary background"
    },
    {
      name: "deliveryArea",
      label: "Delivery Area",
      type: "text",
      icon: HiLocationMarker,
      placeholder: "Dhaka, Gulshan, Banani",
      required: true,
      description: "Areas where you deliver"
    },
    {
      name: "chefId",
      label: "Chef ID",
      type: "text",
      icon: HiUser,
      placeholder: "chef-12345",
      required: true,
      description: "Your unique chef identifier"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Create Meal | LocalChefBazaar</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full mb-4">
            <HiPlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">New Recipe</span>
          </div>
          <h1 className="text-3xl font-bold text-base-content mb-2">Create New Meal</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Share your culinary masterpiece with food lovers. Fill in the details below to add your meal to the platform.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Image Upload Section */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-base-content mb-6 flex items-center space-x-2">
                <HiPhotograph className="w-5 h-5 text-primary" />
                <span>Meal Image</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Upload Image *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image", { required: "Image is required" })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                      <HiPhotograph className="w-12 h-12 text-muted mx-auto mb-4" />
                      <p className="text-base-content font-medium mb-2">Click to upload image</p>
                      <p className="text-sm text-muted">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  {errors.image && (
                    <p className="text-error text-sm mt-2">{errors.image.message}</p>
                  )}
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Preview
                  </label>
                  <div className="aspect-square rounded-xl overflow-hidden bg-surface-elevated border border-gray-200">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Meal preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <HiPhotograph className="w-16 h-16 text-muted mx-auto mb-4" />
                          <p className="text-muted">Image preview will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-base-content mb-6 flex items-center space-x-2">
                <HiCollection className="w-5 h-5 text-primary" />
                <span>Basic Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.slice(0, 4).map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-muted mb-2">
                      {field.label} {field.required && <span className="text-error">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <field.icon className="w-5 h-5 text-muted" />
                      </div>
                      <input
                        type={field.type}
                        step={field.step}
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder}
                        {...register(field.name, { 
                          required: field.required ? `${field.label} is required` : false 
                        })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    {field.description && (
                      <p className="text-xs text-muted mt-1">{field.description}</p>
                    )}
                    {errors[field.name] && (
                      <p className="text-error text-sm mt-1">{errors[field.name].message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-base-content mb-6 flex items-center space-x-2">
                <HiSparkles className="w-5 h-5 text-primary" />
                <span>Ingredients</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  Ingredients List <span className="text-error">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Rice, Chicken, Onions, Spices, Yogurt (separate with commas)"
                  {...register("ingredients", { required: "Ingredients are required" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                />
                <p className="text-xs text-muted mt-1">
                  List all ingredients separated by commas. Be specific to help customers with allergies.
                </p>
                {errors.ingredients && (
                  <p className="text-error text-sm mt-1">{errors.ingredients.message}</p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-base-content mb-6 flex items-center space-x-2">
                <HiLocationMarker className="w-5 h-5 text-primary" />
                <span>Additional Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.slice(4).map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-muted mb-2">
                      {field.label} {field.required && <span className="text-error">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <field.icon className="w-5 h-5 text-muted" />
                      </div>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name, { 
                          required: field.required ? `${field.label} is required` : false 
                        })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    {field.description && (
                      <p className="text-xs text-muted mt-1">{field.description}</p>
                    )}
                    {errors[field.name] && (
                      <p className="text-error text-sm mt-1">{errors[field.name].message}</p>
                    )}
                  </div>
                ))}

                {/* User Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Chef Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiUser className="w-5 h-5 text-muted" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-surface-elevated text-muted cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-muted mt-1">Your registered email address</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="create-meal-btn flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold min-w-[200px] justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 loading-spinner"></div>
                    <span className="btn-text">Creating Meal...</span>
                  </>
                ) : (
                  <>
                    <HiCheck className="w-5 h-5 btn-icon" />
                    <span className="btn-text">Create Meal</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default CreateMeal;
