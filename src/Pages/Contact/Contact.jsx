import React, { useState } from "react";
import { Helmet } from "react-helmet";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiClock,
  HiChat,
  HiSupport,
  HiQuestionMarkCircle,
  HiHeart
} from "react-icons/hi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: HiMail,
      title: "Email Us",
      details: "support@localchefbazaar.com",
      description: "Send us an email anytime"
    },
    {
      icon: HiPhone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: HiLocationMarker,
      title: "Visit Us",
      details: "123 Culinary Street, Food City, FC 12345",
      description: "Our headquarters"
    },
    {
      icon: HiClock,
      title: "Response Time",
      details: "Within 24 hours",
      description: "We'll get back to you quickly"
    }
  ];

  const supportCategories = [
    { value: "general", label: "General Inquiry", icon: HiQuestionMarkCircle },
    { value: "chef", label: "Chef Support", icon: HiSupport },
    { value: "customer", label: "Customer Support", icon: HiChat },
    { value: "technical", label: "Technical Issue", icon: HiMail },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general"
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | LocalChefBazaar</title>
        <meta name="description" content="Get in touch with LocalChefBazaar. We're here to help with any questions about our platform, chefs, or meals." />
      </Helmet>

      <div className="min-h-screen bg-background">
        
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container-modern">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                <HiChat className="w-4 h-4" />
                <span>Contact Us</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-base-content mb-6">
                We'd Love to 
                <span className="text-primary"> Hear from You</span>
              </h1>
              
              <p className="text-xl text-muted leading-relaxed">
                Have questions about our platform? Need help with an order? Want to become a chef? 
                We're here to help and would love to connect with you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 -mt-10">
          <div className="container-modern">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="card-elevated p-6 text-center group hover:shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base-content mb-2">{info.title}</h3>
                  <p className="text-primary font-medium mb-1">{info.details}</p>
                  <p className="text-sm text-muted">{info.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & FAQ */}
        <section className="py-20">
          <div className="container-modern">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="card-modern p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-display font-bold text-base-content mb-2">
                      Send us a Message
                    </h2>
                    <p className="text-muted">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-base-content mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="input-modern"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-base-content mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="input-modern"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="input-modern"
                      >
                        {supportCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="input-modern"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="input-modern resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full inline-flex items-center justify-center bg-gradient-to-r from-primary via-yellow-400 to-accent text-black font-bold px-8 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Pulsing Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
                      
                      {/* Button Content */}
                      <div className="relative flex items-center justify-center space-x-3 z-10">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg font-bold">Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <HiMail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-lg font-bold">Send Message</span>
                            <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                          </>
                        )}
                      </div>
                      
                      {/* Shine Effect */}
                      {!isSubmitting && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      )}
                      
                      {/* Border Animation */}
                      {!isSubmitting && (
                        <div className="absolute inset-0 rounded-2xl border-4 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>

              {/* FAQ & Additional Info */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                
                {/* Quick Help */}
                <div className="card-modern p-6">
                  <h3 className="text-xl font-semibold text-base-content mb-4 flex items-center space-x-2">
                    <HiQuestionMarkCircle className="w-5 h-5 text-primary" />
                    <span>Quick Help</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-elevated rounded-lg">
                      <h4 className="font-medium text-base-content mb-2">For Customers</h4>
                      <p className="text-sm text-muted">
                        Questions about orders, payments, or finding the perfect meal? 
                        We're here to help make your experience amazing.
                      </p>
                    </div>
                    <div className="p-4 bg-surface-elevated rounded-lg">
                      <h4 className="font-medium text-base-content mb-2">For Chefs</h4>
                      <p className="text-sm text-muted">
                        Need help setting up your profile, managing orders, or growing your business? 
                        Our chef support team has you covered.
                      </p>
                    </div>
                    <div className="p-4 bg-surface-elevated rounded-lg">
                      <h4 className="font-medium text-base-content mb-2">Technical Issues</h4>
                      <p className="text-sm text-muted">
                        Experiencing bugs or technical difficulties? Our tech team will 
                        resolve any issues quickly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="card-modern p-6">
                  <h3 className="text-xl font-semibold text-base-content mb-4 flex items-center space-x-2">
                    <HiClock className="w-5 h-5 text-primary" />
                    <span>Support Hours</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-color">
                      <span className="text-base-content">Monday - Friday</span>
                      <span className="text-primary font-medium">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-color">
                      <span className="text-base-content">Saturday</span>
                      <span className="text-primary font-medium">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-base-content">Sunday</span>
                      <span className="text-muted">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm text-primary">
                      <HiHeart className="w-4 h-4 inline mr-1" />
                      Emergency support available 24/7 for critical issues
                    </p>
                  </div>
                </div>

                {/* Alternative Contact */}
                <div className="card-modern p-6 bg-gradient-to-br from-accent/5 to-primary/5">
                  <h3 className="text-xl font-semibold text-base-content mb-4">
                    Prefer to Talk?
                  </h3>
                  <p className="text-muted mb-4">
                    Sometimes it's easier to just have a conversation. Give us a call during 
                    business hours and we'll be happy to help.
                  </p>
                  <motion.a 
                    href="tel:+15551234567"
                    className="group relative inline-flex items-center justify-center bg-surface-elevated hover:bg-primary/10 text-base-content font-bold px-8 py-4 rounded-2xl border-2 border-primary/30 hover:border-primary/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center space-x-3 z-10">
                      <HiPhone className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-lg font-bold group-hover:text-primary transition-colors duration-300">Call Now</span>
                      <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>
                    
                    {/* Border Animation */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300"></div>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;