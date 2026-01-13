
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiClock,
  HiHeart,
  HiUserGroup,
  HiArrowRight,
  HiCheckCircle
} from "react-icons/hi";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaLinkedinIn
} from "react-icons/fa";
import toast from "react-hot-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const contactInfo = [
    { icon: HiLocationMarker, text: "Dhaka, Bangladesh" },
    { icon: HiPhone, text: "+880 1234-567890" },
    { icon: HiMail, text: "support@localchefbazaar.com" }
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", label: "YouTube" }
  ];

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Chefs", href: "/meals" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" }
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubscribed(true);
      toast.success("Successfully subscribed to our newsletter! 🎉", {
        duration: 4000,
        icon: "📧",
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
      
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-surface border-t border-gray-200">
      <div className="container-modern">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <HiHeart className="w-4 h-4 text-primary" />
                </div>
                <div className="font-display">
                  <span className="text-lg font-bold text-primary">Local</span>
                  <span className="text-lg font-bold text-secondary">Chef</span>
                  <span className="text-lg font-bold text-accent">Bazaar</span>
                </div>
              </div>
              <p className="text-muted leading-relaxed mb-6">
                Connecting food lovers with talented local chefs. Experience authentic homemade meals 
                delivered with love and care to your doorstep.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-surface-elevated hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <social.icon className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-base-content mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted hover:text-primary transition-colors inline-flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-current rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-base-content mb-4">Contact Info</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-surface-elevated rounded-lg flex items-center justify-center">
                      <info.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted">{info.text}</span>
                  </div>
                ))}
                
                {/* Working Hours */}
                <div className="mt-6 p-4 bg-surface-elevated rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <HiClock className="w-4 h-4 text-primary" />
                    <span className="font-medium text-base-content">Working Hours</span>
                  </div>
                  <div className="text-sm text-muted space-y-1">
                    <p>Sunday – Thursday: 10:00 AM – 10:00 PM</p>
                    <p>Friday – Saturday: 10:00 AM – 11:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-base-content mb-4">Stay Updated</h3>
              <p className="text-muted mb-6">
                Get the latest updates about new meals, special offers, and chef spotlights.
              </p>
              
              <div className="newsletter-form">
                {!isSubscribed ? (
                  <form onSubmit={handleNewsletterSubmit}>
                    <div className="newsletter-input-group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="newsletter-input"
                        required
                      />
                      <HiMail className="newsletter-input-icon" />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`newsletter-submit-btn ${isSubmitting ? 'loading' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="newsletter-loading-spinner"></div>
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe to Newsletter</span>
                          <HiArrowRight className="newsletter-submit-icon" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="newsletter-success">
                    <HiCheckCircle className="newsletter-success-icon" />
                    <div className="newsletter-success-text">
                      Welcome to our newsletter! 🎉
                    </div>
                    <div className="text-xs text-success/80 mt-1">
                      Check your email for confirmation
                    </div>
                  </div>
                )}
                
                <div className="newsletter-stats">
                  <div className="newsletter-stats-content">
                    <HiUserGroup className="newsletter-stats-icon" />
                    <span>Join <span className="newsletter-stats-number">5,000+</span> food lovers getting weekly updates!</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted">
              © {currentYear} LocalChefBazaar. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-muted hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
