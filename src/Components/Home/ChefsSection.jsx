// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiStar, 
  HiHeart, 
  HiLocationMarker, 
  HiArrowRight 
} from "react-icons/hi";
import sarahImage from "../../assets/Sara.webp";
import fatemaImage from "../../assets/fatema.jpg";

const ChefsSection = () => {
  const chefs = [
    {
      id: 1,
      name: "Sarah Ahmed",
      specialty: "Traditional Bengali Cuisine",
      rating: 4.9,
      reviews: 245,
      location: "Dhaka",
      image: sarahImage,
      experience: "8 years",
      signature: "Biriyani & Curry"
    },
    {
      id: 2,
      name: "Mohammad Rahman",
      specialty: "Fusion & International",
      rating: 4.8,
      reviews: 189,
      location: "Chittagong",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      experience: "12 years",
      signature: "Pasta & Grilled Items"
    },
    {
      id: 3,
      name: "Fatima Khan",
      specialty: "Desserts & Sweets",
      rating: 4.9,
      reviews: 312,
      location: "Sylhet",
      image: fatemaImage,
      experience: "6 years",
      signature: "Cakes & Traditional Sweets"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container-modern">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Meet Our Chefs</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-base-content mb-6">
            Talented 
            <span className="text-primary"> Local Chefs</span>
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Discover the passionate chefs behind your favorite meals. Each brings unique flavors, 
            traditional recipes, and years of culinary expertise to your table.
          </p>
        </motion.div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chefs.map((chef, index) => (
            <motion.div
              key={chef.id}
              className="group card-modern overflow-hidden hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
            >
              {/* Chef Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  <HiStar className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-800">{chef.rating}</span>
                </div>

                {/* Favorite Button */}
                <motion.button 
                  className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                  whileHover={{ rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiHeart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                </motion.button>

                {/* Experience Badge */}
                <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-bold text-black">{chef.experience}</span>
                </div>
              </div>

              {/* Chef Info */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors duration-300">
                    {chef.name}
                  </h3>
                  <p className="text-primary font-medium">{chef.specialty}</p>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted">
                      <HiLocationMarker className="w-4 h-4" />
                      <span>{chef.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted">
                      <HiStar className="w-4 h-4 text-yellow-500" />
                      <span>{chef.reviews} reviews</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted">
                    <span className="font-medium">Signature:</span> {chef.signature}
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 hover:from-primary/20 hover:via-accent/20 hover:to-primary/20 text-primary font-bold py-5 px-6 rounded-2xl border-2 border-primary/30 hover:border-primary/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  {/* Pulsing Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-0 group-hover/btn:opacity-60 transition-opacity duration-500 -z-10"></div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center justify-center space-x-3 z-10">
                    <span className="text-lg font-bold">View Chef's Meals</span>
                    <div className="flex items-center space-x-2">
                      <HiArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                      <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 delay-100"></div>
                    </div>
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-800"></div>
                  
                  {/* Border Animation */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover/btn:border-primary/40 transition-all duration-300"></div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-surface card-modern p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              Want to Become a Chef Partner?
            </h3>
            <p className="text-muted mb-6">
              Join our community of talented chefs and share your culinary passion with food lovers in your area.
            </p>
            
            <motion.a
              href="/register"
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-accent via-green-400 to-emerald-500 text-white font-bold px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-accent to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Pulsing Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-emerald-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
              
              {/* Button Content */}
              <div className="relative flex items-center space-x-4 z-10">
                <span className="text-xl font-bold">Apply as Chef</span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                  <HiArrowRight className="w-5 h-5" />
                </div>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Border Animation */}
              <div className="absolute inset-0 rounded-2xl border-4 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChefsSection;