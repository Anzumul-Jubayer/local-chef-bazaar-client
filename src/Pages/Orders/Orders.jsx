import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import { Helmet } from "react-helmet";
import { buildApiUrl } from "../../config/api";
import {
  HiShoppingCart,
  HiLocationMarker,
  HiMail,
  HiUser,
  HiCurrencyDollar,
  HiPlus,
  HiMinus,
  HiCheck,
  HiClock,
  HiStar,
  HiHeart,
  HiArrowLeft,
  HiShieldCheck,
  HiTruck,
  HiCreditCard,
  HiPhone,
  HiHome,
  HiCalculator,
  HiX,
  HiExclamation,
  HiCheckCircle,
  HiInformationCircle,
  HiChatAlt,
  HiSparkles,
} from "react-icons/hi";
import { useLoadingState } from "../../hooks/useLoadingState";

const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { withLoading } = useLoadingState();

  const [meal, setMeal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("asap");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch meal details
  useEffect(() => {
    const loadMeal = async () => {
      try {
        await withLoading(async () => {
          const res = await fetch(buildApiUrl(`/meal-details/${id}`));
          const data = await res.json();
          setMeal(data);
        }, "Loading meal details...");
      } catch (error) {
        console.error("Error fetching meal details:", error);
        toast.error("Error fetching meal details");
        navigate("/meals");
      }
    };
    loadMeal();
  }, [id, withLoading, navigate]);

  if (!meal) return null;

  const totalPrice = meal.price * quantity;
  const deliveryFee = totalPrice >= 300 ? 0 : 30;
  const finalTotal = totalPrice + deliveryFee;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please provide a contact phone number");
      return;
    }

    // Show custom confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmOrderSubmit = async () => {
    setShowConfirmModal(false);

    const orderData = {
      foodId: meal._id,
      mealName: meal.foodName,
      price: meal.price,
      quantity,
      chefId: meal.chefId,
      chefName: meal.chefName,
      paymentStatus: "Pending",
      userEmail: user.email,
      userAddress: address,
      userPhone: phone,
      specialInstructions,
      deliveryTime,
      deliveryFee,
      totalAmount: finalTotal,
      orderStatus: "pending",
      orderTime: new Date().toISOString(),
    };

    try {
      await withLoading(async () => {
        const res = await fetch(buildApiUrl("/orders"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (data.success) {
          await Swal.fire({
            title: "Order Placed Successfully!",
            text: "Your order has been confirmed. You'll receive updates via email.",
            icon: "success",
            confirmButtonText: "View My Orders",
            confirmButtonColor: "#D4AF37",
            background:
              document.documentElement.getAttribute("data-theme") === "dark"
                ? "#171717"
                : "#ffffff",
            color:
              document.documentElement.getAttribute("data-theme") === "dark"
                ? "#fafafa"
                : "#171717",
          });

          navigate("/dashboard/orders");
        } else {
          throw new Error(data.message || "Failed to place order");
        }
      }, "Placing your order...");
    } catch (error) {
      toast.error(error.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Order {meal.foodName} | LocalChefBazaar</title>
        <meta
          name="description"
          content={`Place your order for ${meal.foodName} by ${meal.chefName}. Fresh, homemade meals delivered to your door.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="py-8 bg-background border-b border-color">
          <div className="container-modern">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => navigate(-1)}
                  className="p-3 bg-surface hover:bg-hover border border-color rounded-xl transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HiArrowLeft className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                </motion.button>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <HiShoppingCart className="w-5 h-5 text-primary" />
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-base-content">
                      Place Order
                    </h1>
                  </div>
                  <p className="text-muted">
                    Complete your order details below
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-muted">
                  <HiShieldCheck className="w-4 h-4 text-accent" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted">
                  <HiTruck className="w-4 h-4 text-primary" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 bg-background">
          <div className="container-modern">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Form - Left Column */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form onSubmit={handleConfirmOrder} className="space-y-6">
                  {/* Modern Meal Information Card */}
                  <div className="bg-gradient-to-br from-surface-elevated to-surface rounded-2xl p-8 border border-color/10 shadow-lg">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-4 bg-primary/10 rounded-2xl shadow-md">
                        <HiShoppingCart className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">
                          Order Details
                        </h2>
                        <p className="text-sm text-muted">
                          Review your delicious meal selection
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Enhanced Meal Image */}
                      <div className="relative flex-shrink-0 group">
                        <div className="relative overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={meal.image}
                            alt={meal.foodName}
                            className="w-full lg:w-40 h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Floating Rating Badge */}
                        <div className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 shadow-lg px-3 py-2 rounded-full border border-color/20">
                          <div className="flex items-center space-x-1">
                            <HiStar className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-bold text-base-content">
                              {meal.rating}
                            </span>
                          </div>
                        </div>
                        
                        {/* Fresh Badge */}
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Fresh & Homemade
                        </div>
                      </div>

                      {/* Enhanced Meal Details */}
                      <div className="flex-1 space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-base-content mb-2">
                            {meal.foodName}
                          </h3>
                          <div className="flex items-center space-x-3 text-muted mb-4">
                            <div className="flex items-center space-x-1">
                              <HiUser className="w-4 h-4" />
                              <span>by Chef {meal.chefName}</span>
                            </div>
                            <div className="w-1 h-1 bg-muted rounded-full"></div>
                            <div className="flex items-center space-x-1">
                              <HiClock className="w-4 h-4" />
                              <span>{meal.chefExperience} years experience</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-background rounded-xl p-4 border border-color/10">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-accent/10 rounded-lg">
                                <HiLocationMarker className="w-4 h-4 text-accent" />
                              </div>
                              <div>
                                <p className="text-xs text-muted">Delivery Area</p>
                                <p className="font-semibold text-base-content">{meal.deliveryArea}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-background rounded-xl p-4 border border-color/10">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <HiClock className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted">Delivery Time</p>
                                <p className="font-semibold text-base-content">30-45 minutes</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
                          <div>
                            <p className="text-sm text-muted">Price per serving</p>
                            <p className="text-3xl font-bold text-primary">৳{meal.price}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-yellow-500 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <HiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(meal.rating) ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted">{meal.rating} rating</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Quantity Selector */}
                    <div className="mt-8 pt-8 border-t border-color/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-lg font-bold text-base-content mb-2">
                            Quantity
                          </label>
                          <p className="text-sm text-muted">
                            Maximum 10 items per order • Perfect for sharing
                          </p>
                        </div>

                        <div className="flex items-center space-x-4 bg-surface-elevated rounded-2xl p-2 border border-color/10">
                          <motion.button
                            type="button"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="p-3 bg-background hover:bg-hover border border-color/20 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                            whileHover={{ scale: quantity > 1 ? 1.1 : 1 }}
                            whileTap={{ scale: quantity > 1 ? 0.9 : 1 }}
                          >
                            <HiMinus className="w-5 h-5 text-base-content group-hover:text-error transition-colors" />
                          </motion.button>

                          <div className="w-20 text-center bg-primary/10 rounded-xl py-3">
                            <span className="text-2xl font-bold text-primary">
                              {quantity}
                            </span>
                          </div>

                          <motion.button
                            type="button"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= 10}
                            className="p-3 bg-background hover:bg-hover border border-color/20 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                            whileHover={{ scale: quantity < 10 ? 1.1 : 1 }}
                            whileTap={{ scale: quantity < 10 ? 0.9 : 1 }}
                          >
                            <HiPlus className="w-5 h-5 text-base-content group-hover:text-success transition-colors" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modern Customer Information Card */}
                  <div className="bg-gradient-to-br from-surface-elevated to-surface rounded-2xl p-8 border border-color/10 shadow-lg">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-4 bg-accent/10 rounded-2xl shadow-md">
                        <HiUser className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">
                          Customer Information
                        </h2>
                        <p className="text-sm text-muted">
                          Your contact details for order updates
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Enhanced Email Field */}
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-base-content">
                          <HiMail className="w-4 h-4 text-accent" />
                          <span>Email Address</span>
                          <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">Verified</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full px-4 py-3 pl-12 bg-surface border-2 border-color/30 rounded-xl text-base-content font-medium opacity-75 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
                          />
                          <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <HiShieldCheck className="w-5 h-5 text-success" />
                          </div>
                        </div>
                        <p className="text-xs text-muted flex items-center space-x-1">
                          <HiInformationCircle className="w-3 h-3" />
                          <span>Order confirmations will be sent here</span>
                        </p>
                      </div>

                      {/* Enhanced Phone Field */}
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-base-content">
                          <HiPhone className="w-4 h-4 text-primary" />
                          <span>Phone Number</span>
                          <span className="text-xs text-error">Required</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 pl-12 bg-background border-2 border-color/30 rounded-xl text-base-content font-medium placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
                            required
                          />
                          <HiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                        </div>
                        <p className="text-xs text-muted flex items-center space-x-1">
                          <HiInformationCircle className="w-3 h-3" />
                          <span>For delivery coordination and updates</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modern Delivery Information Card */}
                  <div className="bg-gradient-to-br from-surface-elevated to-surface rounded-2xl p-8 border border-color/10 shadow-lg">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-4 bg-secondary/10 rounded-2xl shadow-md">
                        <HiLocationMarker className="w-7 h-7 text-secondary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-base-content">
                          Delivery Information
                        </h2>
                        <p className="text-sm text-muted">
                          Where should we deliver your delicious meal?
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Enhanced Delivery Address */}
                      <div className="space-y-4">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-base-content">
                          <HiHome className="w-4 h-4 text-secondary" />
                          <span>Delivery Address</span>
                          <span className="text-xs text-error">Required</span>
                        </label>
                        <div className="relative">
                          <textarea
                            placeholder="Enter your complete delivery address including house number, street, area, and landmarks for easy delivery..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-4 bg-background border-2 border-color/30 rounded-xl text-base-content font-medium placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/50 transition-all duration-300"
                            required
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-muted">
                            <HiLocationMarker className="w-3 h-3 inline mr-1" />
                            Be specific for faster delivery
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Enhanced Delivery Time */}
                        <div className="space-y-4">
                          <label className="flex items-center space-x-2 text-sm font-semibold text-base-content">
                            <HiClock className="w-4 h-4 text-primary" />
                            <span>Preferred Delivery Time</span>
                          </label>
                          <div className="relative">
                            <select
                              value={deliveryTime}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                              className="w-full px-4 py-3 pl-12 bg-background border-2 border-color/30 rounded-xl text-base-content font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 appearance-none cursor-pointer"
                            >
                              <option value="asap">🚀 As soon as possible (30-45 min)</option>
                              <option value="1hour">⏰ Within 1 hour</option>
                              <option value="2hours">🕐 Within 2 hours</option>
                              <option value="evening">🌅 This evening (6-8 PM)</option>
                              <option value="specific">📞 Specific time (call to arrange)</option>
                            </select>
                            <HiClock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Area Info */}
                        <div className="bg-background rounded-xl p-4 border border-color/10">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-accent/10 rounded-lg">
                              <HiTruck className="w-4 h-4 text-accent" />
                            </div>
                            <h4 className="font-semibold text-base-content">Delivery Zone</h4>
                          </div>
                          <p className="text-sm text-muted mb-2">
                            Available in: <span className="font-medium text-base-content">{meal.deliveryArea}</span>
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-success">
                            <HiCheck className="w-3 h-3" />
                            <span>Your area is covered!</span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Special Instructions */}
                      <div className="space-y-4">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-base-content">
                          <HiChatAlt className="w-4 h-4 text-accent" />
                          <span>Special Instructions</span>
                          <span className="text-xs text-muted bg-muted/10 px-2 py-1 rounded-full">Optional</span>
                        </label>
                        <div className="relative">
                          <textarea
                            placeholder="Any special requests, dietary preferences, spice level adjustments, or delivery instructions..."
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-4 bg-background border-2 border-color/30 rounded-xl text-base-content font-medium placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all duration-300"
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-muted">
                            <HiSparkles className="w-3 h-3 inline mr-1" />
                            Help us serve you better
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>

              {/* Order Summary - Right Column */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="sticky top-8 space-y-6">
                  {/* Order Summary Card */}
                  <div className="card-modern p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <HiCalculator className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-base-content">
                          Order Summary
                        </h2>
                        <p className="text-sm text-muted">Review your total</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Item Details */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-base-content line-clamp-2">
                            {meal.foodName}
                          </p>
                          <p className="text-sm text-muted">
                            ৳{meal.price} × {quantity}
                          </p>
                        </div>
                        <p className="font-bold text-base-content">
                          ৳{totalPrice}
                        </p>
                      </div>

                      <div className="border-t border-color pt-4 space-y-3">
                        {/* Subtotal */}
                        <div className="flex justify-between">
                          <span className="text-muted">Subtotal</span>
                          <span className="font-medium text-base-content">
                            ৳{totalPrice}
                          </span>
                        </div>

                        {/* Delivery Fee */}
                        <div className="flex justify-between">
                          <span className="text-muted">Delivery Fee</span>
                          <span
                            className={`font-medium ${
                              deliveryFee === 0
                                ? "text-success"
                                : "text-base-content"
                            }`}
                          >
                            {deliveryFee === 0 ? "FREE" : `৳${deliveryFee}`}
                          </span>
                        </div>

                        {/* Free Delivery Notice */}
                        {totalPrice < 300 && (
                          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                            <p className="text-xs text-primary">
                              <HiTruck className="inline w-3 h-3 mr-1" />
                              Add ৳{300 - totalPrice} more for free delivery!
                            </p>
                          </div>
                        )}

                        {/* Total */}
                        <div className="border-t border-color pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-base-content">
                              Total
                            </span>
                            <span className="text-2xl font-bold text-primary">
                              ৳{finalTotal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <motion.button
                      type="submit"
                      onClick={handleConfirmOrder}
                      className="w-full mt-6 group relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Button Content */}
                      <div className="relative flex items-center justify-center space-x-2">
                        <HiCheck className="w-5 h-5" />
                        <span>Place Order - ৳{finalTotal}</span>
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.button>

                    {/* Security Notice */}
                    <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-muted">
                      <HiShieldCheck className="w-4 h-4 text-accent" />
                      <span>Secure checkout • Your data is protected</span>
                    </div>
                  </div>

                  {/* Payment Methods Card */}
                  <div className="card-modern p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <HiCreditCard className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base-content">
                          Payment Methods
                        </h3>
                        <p className="text-xs text-muted">Available options</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted">
                        <HiCheck className="w-4 h-4 text-success" />
                        <span>Cash on Delivery</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted">
                        <HiCheck className="w-4 h-4 text-success" />
                        <span>Mobile Banking (bKash, Nagad)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted">
                        <HiCheck className="w-4 h-4 text-success" />
                        <span>Bank Transfer</span>
                      </div>
                    </div>
                  </div>

                  {/* Chef Info Card */}
                  <div className="card-modern p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                        <HiUser className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base-content">
                          Chef {meal.chefName}
                        </h3>
                        <p className="text-xs text-muted">
                          {meal.chefExperience} years experience
                        </p>
                      </div>
                    </div>

                    <div className="text-sm space-y-2">
                      <div className="flex items-center space-x-2 text-muted">
                        <HiStar className="w-4 h-4 text-yellow-500" />
                        <span>
                          {meal.rating} rating • {meal.deliveryArea}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted">
                        <HiHeart className="w-4 h-4 text-red-500" />
                        <span>Specializes in authentic homemade meals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Modern Custom Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
            >
              <motion.div
                className="bg-background border border-color/20 shadow-2xl rounded-3xl p-0 w-full max-w-2xl max-h-[95vh] overflow-hidden"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modern Modal Header */}
                <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-8 border-b border-color/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-primary/20 rounded-2xl shadow-lg">
                        <HiCheckCircle className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-base-content mb-1">
                          Confirm Your Order
                        </h3>
                        <p className="text-sm text-muted">
                          Review your order details before placing
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setShowConfirmModal(false)}
                      className="p-3 hover:bg-surface-elevated rounded-2xl transition-all duration-300 group"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <HiX className="w-6 h-6 text-muted group-hover:text-error transition-colors" />
                    </motion.button>
                  </div>
                </div>

                {/* Modern Modal Content */}
                <div className="p-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                  {/* Enhanced Order Summary Card */}
                  <div className="bg-gradient-to-br from-surface-elevated to-surface rounded-2xl p-6 border border-color/10 shadow-lg">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <HiShoppingCart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-base-content">
                          Order Summary
                        </h4>
                        <p className="text-sm text-muted">Your delicious meal awaits</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Enhanced Meal Details */}
                      <div className="flex items-start space-x-5 p-4 bg-background rounded-xl border border-color/10">
                        <div className="relative">
                          <img
                            src={meal.image}
                            alt={meal.foodName}
                            className="w-20 h-20 object-cover rounded-xl shadow-md"
                          />
                          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                            {quantity}x
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-base-content text-lg line-clamp-1 mb-1">
                            {meal.foodName}
                          </h5>
                          <p className="text-sm text-muted mb-2">
                            by Chef {meal.chefName}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <HiStar className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-muted">
                                {meal.rating} rating
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted">Unit Price</p>
                              <p className="font-bold text-primary">৳{meal.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Pricing Breakdown */}
                      <div className="bg-background rounded-xl p-5 border border-color/10 space-y-4">
                        <h5 className="font-semibold text-base-content flex items-center space-x-2">
                          <HiCalculator className="w-4 h-4 text-accent" />
                          <span>Price Breakdown</span>
                        </h5>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted">Price per item</span>
                            <span className="font-medium text-base-content">৳{meal.price}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted">Quantity</span>
                            <span className="font-medium text-base-content">{quantity}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted">Subtotal</span>
                            <span className="font-medium text-base-content">৳{totalPrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted">Delivery Fee</span>
                            <span className={`font-medium ${deliveryFee === 0 ? "text-success" : "text-base-content"}`}>
                              {deliveryFee === 0 ? (
                                <span className="flex items-center space-x-1">
                                  <HiCheck className="w-4 h-4" />
                                  <span>FREE</span>
                                </span>
                              ) : (
                                `৳${deliveryFee}`
                              )}
                            </span>
                          </div>
                          
                          {/* Free Delivery Progress */}
                          {totalPrice < 300 && (
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <HiTruck className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">
                                  Add ৳{300 - totalPrice} more for free delivery!
                                </span>
                              </div>
                              <div className="w-full bg-primary/20 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(totalPrice / 300) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          <div className="border-t border-color pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-base-content">
                                Total Amount
                              </span>
                              <span className="text-2xl font-bold text-primary">
                                ৳{finalTotal}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Delivery Information Card */}
                  <div className="bg-gradient-to-br from-surface-elevated to-surface rounded-2xl p-6 border border-color/10 shadow-lg">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-accent/10 rounded-xl">
                        <HiLocationMarker className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-base-content">
                          Delivery Details
                        </h4>
                        <p className="text-sm text-muted">Where we'll deliver your order</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="bg-background rounded-xl p-4 border border-color/10">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-accent/10 rounded-lg mt-1">
                            <HiHome className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-muted">Delivery Address:</span>
                            <p className="text-base-content font-medium mt-1 leading-relaxed">
                              {address}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background rounded-xl p-4 border border-color/10">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <HiPhone className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted">Phone:</span>
                              <p className="text-base-content font-medium">{phone}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-background rounded-xl p-4 border border-color/10">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                              <HiClock className="w-4 h-4 text-secondary" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted">Delivery Time:</span>
                              <p className="text-base-content font-medium">
                                {deliveryTime === "asap"
                                  ? "ASAP (30-45 min)"
                                  : deliveryTime === "1hour"
                                  ? "Within 1 hour"
                                  : deliveryTime === "2hours"
                                  ? "Within 2 hours"
                                  : deliveryTime === "evening"
                                  ? "This evening"
                                  : "Specific time"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {specialInstructions && (
                        <div className="bg-background rounded-xl p-4 border border-color/10">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg mt-1">
                              <HiChatAlt className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-muted">Special Instructions:</span>
                              <p className="text-base-content font-medium mt-1 leading-relaxed">
                                {specialInstructions}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Payment Information */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20 shadow-lg">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <HiCreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-base-content">
                          Payment & Security
                        </h4>
                        <p className="text-sm text-muted">Safe and secure ordering</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <HiCheckCircle className="w-4 h-4 text-success" />
                          <span className="text-muted">Payment on delivery</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <HiShieldCheck className="w-4 h-4 text-accent" />
                          <span className="text-muted">Order secured & protected</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <HiTruck className="w-4 h-4 text-primary" />
                          <span className="text-muted">Free delivery over ৳300</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <HiHeart className="w-4 h-4 text-red-400" />
                          <span className="text-muted">Fresh & homemade</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modern Modal Footer */}
                <div className="p-8 bg-surface-elevated border-t border-color/10">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 px-6 py-4 bg-surface border-2 border-color/20 hover:border-muted/50 text-base-content hover:text-muted font-semibold rounded-2xl transition-all duration-300 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Review Order</span>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={handleConfirmOrderSubmit}
                      className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary via-primary to-accent text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button Background Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Button Content */}
                      <div className="relative flex items-center justify-center space-x-2">
                        <HiCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-lg">Confirm Order - ৳{finalTotal}</span>
                        <HiSparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" />
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.button>
                  </div>

                  {/* Enhanced Security Notice */}
                  <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-muted">
                    <div className="flex items-center space-x-1">
                      <HiShieldCheck className="w-4 h-4 text-accent" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="w-1 h-1 bg-muted rounded-full"></div>
                    <div className="flex items-center space-x-1">
                      <HiHeart className="w-4 h-4 text-red-400" />
                      <span>Made with Love</span>
                    </div>
                    <div className="w-1 h-1 bg-muted rounded-full"></div>
                    <div className="flex items-center space-x-1">
                      <HiTruck className="w-4 h-4 text-primary" />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Orders;
