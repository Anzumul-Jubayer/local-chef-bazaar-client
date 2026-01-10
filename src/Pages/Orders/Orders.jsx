import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";
import { Helmet } from "react-helmet";
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
  HiInformationCircle
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
          const res = await fetch(
            `https://local-chef-bazaar-server-flame.vercel.app/meal-details/${id}`
          );
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
        const res = await fetch(
          "https://local-chef-bazaar-server-flame.vercel.app/orders",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
          }
        );

        const data = await res.json();

        if (data.success) {
          await Swal.fire({
            title: "Order Placed Successfully!",
            text: "Your order has been confirmed. You'll receive updates via email.",
            icon: "success",
            confirmButtonText: "View My Orders",
            confirmButtonColor: "#D4AF37",
            background: document.documentElement.getAttribute('data-theme') === 'dark' ? "#171717" : "#ffffff",
            color: document.documentElement.getAttribute('data-theme') === 'dark' ? "#fafafa" : "#171717",
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
        <meta name="description" content={`Place your order for ${meal.foodName} by ${meal.chefName}. Fresh, homemade meals delivered to your door.`} />
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
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-base-content">Place Order</h1>
                  </div>
                  <p className="text-muted">Complete your order details below</p>
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
                  
                  {/* Meal Information Card */}
                  <div className="card-modern p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <HiShoppingCart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-base-content">Order Details</h2>
                        <p className="text-sm text-muted">Review your meal selection</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Meal Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={meal.image}
                          alt={meal.foodName}
                          className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-md"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <div className="flex items-center space-x-1">
                            <HiStar className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs font-bold text-gray-800">{meal.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Meal Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-base-content">{meal.foodName}</h3>
                          <p className="text-sm text-muted">by Chef {meal.chefName}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center space-x-1 text-muted">
                            <HiLocationMarker className="w-4 h-4" />
                            <span>{meal.deliveryArea}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted">
                            <HiClock className="w-4 h-4" />
                            <span>30-45 min delivery</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-primary">৳{meal.price}</div>
                          <div className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                            Fresh & Homemade
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mt-6 pt-6 border-t border-color">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-semibold text-base-content mb-1">Quantity</label>
                          <p className="text-xs text-muted">Maximum 10 items per order</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <motion.button
                            type="button"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="p-2 bg-surface hover:bg-hover border border-color rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: quantity > 1 ? 1.1 : 1 }}
                            whileTap={{ scale: quantity > 1 ? 0.9 : 1 }}
                          >
                            <HiMinus className="w-4 h-4 text-base-content" />
                          </motion.button>
                          
                          <div className="w-16 text-center">
                            <span className="text-xl font-bold text-base-content">{quantity}</span>
                          </div>
                          
                          <motion.button
                            type="button"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= 10}
                            className="p-2 bg-surface hover:bg-hover border border-color rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: quantity < 10 ? 1.1 : 1 }}
                            whileTap={{ scale: quantity < 10 ? 0.9 : 1 }}
                          >
                            <HiPlus className="w-4 h-4 text-base-content" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Card */}
                  <div className="card-modern p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-accent/10 rounded-xl">
                        <HiUser className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-base-content">Customer Information</h2>
                        <p className="text-sm text-muted">Your contact details</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email (Read-only) */}
                      <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                          <HiMail className="inline w-4 h-4 mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="input-modern bg-surface-elevated opacity-75 cursor-not-allowed"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                          <HiPhone className="inline w-4 h-4 mr-2" />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="input-modern"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information Card */}
                  <div className="card-modern p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-secondary/10 rounded-xl">
                        <HiLocationMarker className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-base-content">Delivery Information</h2>
                        <p className="text-sm text-muted">Where should we deliver your order?</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Delivery Address */}
                      <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                          <HiHome className="inline w-4 h-4 mr-2" />
                          Delivery Address *
                        </label>
                        <textarea
                          placeholder="Enter your complete delivery address including house number, street, area, and landmarks..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={3}
                          className="input-modern resize-none"
                          required
                        />
                      </div>

                      {/* Delivery Time */}
                      <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                          <HiClock className="inline w-4 h-4 mr-2" />
                          Preferred Delivery Time
                        </label>
                        <select
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          className="input-modern"
                        >
                          <option value="asap">As soon as possible (30-45 min)</option>
                          <option value="1hour">Within 1 hour</option>
                          <option value="2hours">Within 2 hours</option>
                          <option value="evening">This evening (6-8 PM)</option>
                          <option value="specific">Specific time (call to arrange)</option>
                        </select>
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          placeholder="Any special requests, dietary preferences, or delivery instructions..."
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          rows={2}
                          className="input-modern resize-none"
                        />
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
                        <h2 className="text-xl font-bold text-base-content">Order Summary</h2>
                        <p className="text-sm text-muted">Review your total</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Item Details */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-base-content line-clamp-2">{meal.foodName}</p>
                          <p className="text-sm text-muted">৳{meal.price} × {quantity}</p>
                        </div>
                        <p className="font-bold text-base-content">৳{totalPrice}</p>
                      </div>

                      <div className="border-t border-color pt-4 space-y-3">
                        {/* Subtotal */}
                        <div className="flex justify-between">
                          <span className="text-muted">Subtotal</span>
                          <span className="font-medium text-base-content">৳{totalPrice}</span>
                        </div>

                        {/* Delivery Fee */}
                        <div className="flex justify-between">
                          <span className="text-muted">Delivery Fee</span>
                          <span className={`font-medium ${deliveryFee === 0 ? 'text-success' : 'text-base-content'}`}>
                            {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`}
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
                            <span className="text-lg font-bold text-base-content">Total</span>
                            <span className="text-2xl font-bold text-primary">৳{finalTotal}</span>
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
                        <h3 className="font-bold text-base-content">Payment Methods</h3>
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
                        <h3 className="font-bold text-base-content">Chef {meal.chefName}</h3>
                        <p className="text-xs text-muted">{meal.chefExperience} years experience</p>
                      </div>
                    </div>

                    <div className="text-sm space-y-2">
                      <div className="flex items-center space-x-2 text-muted">
                        <HiStar className="w-4 h-4 text-yellow-500" />
                        <span>{meal.rating} rating • {meal.deliveryArea}</span>
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

        {/* Custom Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 modal-backdrop flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
            >
              <motion.div
                className="bg-background modal-content card-modern p-0 w-full max-w-lg max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 p-6 border-b border-color">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary/20 rounded-full">
                        <HiExclamation className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-base-content">Confirm Your Order</h3>
                        <p className="text-sm text-muted">Please review your order details</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setShowConfirmModal(false)}
                      className="p-2 hover:bg-hover rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <HiX className="w-5 h-5 text-muted" />
                    </motion.button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto modal-scroll">
                  {/* Order Summary Card */}
                  <div className="bg-surface-elevated rounded-xl p-5 border border-color">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <HiShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold text-base-content">Order Summary</h4>
                    </div>

                    <div className="space-y-3">
                      {/* Meal Details */}
                      <div className="flex items-start space-x-4">
                        <img
                          src={meal.image}
                          alt={meal.foodName}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-base-content line-clamp-1">{meal.foodName}</h5>
                          <p className="text-sm text-muted">by Chef {meal.chefName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <HiStar className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-muted">{meal.rating} rating</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Breakdown */}
                      <div className="border-t border-color pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Price per item</span>
                          <span className="font-medium text-base-content">৳{meal.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Quantity</span>
                          <span className="font-medium text-base-content">{quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Subtotal</span>
                          <span className="font-medium text-base-content">৳{totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted">Delivery Fee</span>
                          <span className={`font-medium ${deliveryFee === 0 ? 'text-success' : 'text-base-content'}`}>
                            {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`}
                          </span>
                        </div>
                        <div className="border-t border-color pt-2">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-base-content">Total Amount</span>
                            <span className="text-xl font-bold text-primary">৳{finalTotal}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information Card */}
                  <div className="bg-surface-elevated rounded-xl p-5 border border-color">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <HiLocationMarker className="w-5 h-5 text-accent" />
                      </div>
                      <h4 className="text-lg font-semibold text-base-content">Delivery Details</h4>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-muted">Address:</span>
                        <p className="text-base-content font-medium mt-1 leading-relaxed">{address}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-muted">Phone:</span>
                          <p className="text-base-content font-medium">{phone}</p>
                        </div>
                        <div>
                          <span className="text-muted">Delivery Time:</span>
                          <p className="text-base-content font-medium">
                            {deliveryTime === "asap" ? "ASAP (30-45 min)" : 
                             deliveryTime === "1hour" ? "Within 1 hour" :
                             deliveryTime === "2hours" ? "Within 2 hours" :
                             deliveryTime === "evening" ? "This evening" : "Specific time"}
                          </p>
                        </div>
                      </div>
                      {specialInstructions && (
                        <div>
                          <span className="text-muted">Special Instructions:</span>
                          <p className="text-base-content font-medium mt-1 leading-relaxed">{specialInstructions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-5 border border-primary/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <HiInformationCircle className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold text-base-content">Payment Information</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted">
                        <HiCheckCircle className="w-4 h-4 text-success" />
                        <span>Payment will be collected on delivery</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted">
                        <HiShieldCheck className="w-4 h-4 text-accent" />
                        <span>Your order is secured and protected</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted">
                        <HiTruck className="w-4 h-4 text-primary" />
                        <span>Free delivery on orders over ৳300</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-surface-elevated border-t border-color">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 px-6 py-3 bg-surface border-2 border-color hover:border-muted text-base-content hover:text-muted font-semibold rounded-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <HiArrowLeft className="w-4 h-4" />
                        <span>Review Order</span>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      onClick={handleConfirmOrderSubmit}
                      className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Button Content */}
                      <div className="relative flex items-center justify-center space-x-2">
                        <HiCheck className="w-5 h-5" />
                        <span>Confirm Order - ৳{finalTotal}</span>
                      </div>
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </motion.button>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-muted">
                    <HiShieldCheck className="w-4 h-4 text-accent" />
                    <span>Your order and personal information are secure</span>
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
