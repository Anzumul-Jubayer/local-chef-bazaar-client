// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiUsers, 
  HiCollection, 
  HiStar, 
  HiLocationMarker 
} from "react-icons/hi";

const StatsSection = () => {
  const stats = [
    {
      icon: HiUsers,
      number: "10,000+",
      label: "Happy Customers",
      description: "Satisfied food lovers",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: HiCollection,
      number: "500+",
      label: "Delicious Meals",
      description: "Variety of cuisines",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: HiStar,
      number: "4.8/5",
      label: "Average Rating",
      description: "Customer satisfaction",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: HiLocationMarker,
      number: "25+",
      label: "Cities Covered",
      description: "Nationwide delivery",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 bg-surface-elevated">
      <div className="container-modern">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-secondary">Our Impact</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-base-content mb-6">
            Numbers That 
            <span className="text-secondary"> Speak</span>
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            See how LocalChefBazaar has transformed the way people enjoy homemade meals. 
            Our growing community speaks for itself.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="card-modern p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
                </div>

                {/* Number */}
                <motion.div
                  className="mb-4"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                </motion.div>

                {/* Label */}
                <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-300">
                  {stat.label}
                </h3>
                
                <p className="text-muted text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-muted mb-6 max-w-2xl mx-auto">
              Be part of the food revolution. Connect with local chefs, discover amazing meals, 
              and enjoy the convenience of homemade food delivered to your door.
            </p>
            
            <motion.a
              href="/register"
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-primary via-yellow-400 to-accent text-black font-bold px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden min-w-[220px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Pulsing Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
              
              {/* Button Content */}
              <div className="relative flex items-center space-x-4 z-10">
                <span className="text-xl font-bold">Get Started Today</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                  <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
                  <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300"></div>
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

export default StatsSection;
