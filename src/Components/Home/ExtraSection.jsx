import React from "react";
import { motion } from "framer-motion";
import { 
  HiCake, 
  HiHeart, 
  HiTruck, 
  HiShieldCheck,
  HiStar,
  HiUsers
} from "react-icons/hi";

const ExtraSection = () => {
  const features = [
    {
      icon: HiCake,
      title: "Authentic Recipes",
      description: "Enjoy homemade meals prepared with traditional recipes passed down through generations by our talented local chefs.",
      color: "primary"
    },
    {
      icon: HiHeart,
      title: "Fresh Ingredients",
      description: "All meals are made from fresh, locally sourced ingredients ensuring the best taste and nutritional value.",
      color: "accent"
    },
    {
      icon: HiTruck,
      title: "Fast Delivery",
      description: "Get your meals delivered hot and on time directly to your doorstep with our reliable delivery network.",
      color: "secondary"
    }
  ];

  const stats = [
    { number: "500+", label: "Local Chefs", icon: HiUsers },
    { number: "10K+", label: "Happy Customers", icon: HiHeart },
    { number: "4.8", label: "Average Rating", icon: HiStar },
    { number: "99%", label: "On-Time Delivery", icon: HiShieldCheck }
  ];

  return (
    <section className="py-20 bg-surface-elevated relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-modern">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
            <HiShieldCheck className="w-4 h-4" />
            <span>Why Choose Us</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-display font-bold text-base-content mb-6">
            Why Choose 
            <span className="text-primary"> LocalChefBazaar</span>
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            We're more than just a food delivery platform. We're a community that celebrates 
            culinary diversity, supports local talent, and brings authentic flavors to your table.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card-modern p-8 text-center group hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold text-base-content mb-4">
                {feature.title}
              </h3>
              
              <p className="text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="card-elevated p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold text-base-content mb-2">
              Trusted by Thousands
            </h3>
            <p className="text-muted">
              Join our growing community of food lovers and talented chefs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-base-content mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExtraSection;
