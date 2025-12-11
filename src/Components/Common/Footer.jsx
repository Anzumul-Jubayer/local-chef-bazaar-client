
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral text-white pt-12 pb-6 px-6 lg:px-20">

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

       
        <div>
          <h2 className="text-xl font-bold text-primary mb-3">Contact Us</h2>
          <p className="text-base">📍 Dhaka, Bangladesh</p>
          <p className="text-base">📞 +880 1234-567890</p>
          <p className="text-base">📧 support@localchefbazaar.com</p>
        </div>

        
        <div>
          <h2 className="text-xl font-bold text-primary mb-3">Follow Us</h2>
          <div className="flex items-center gap-4 text-2xl">
            <a className="hover:text-primary transition"><FaFacebookF /></a>
            <a className="hover:text-primary transition"><FaInstagram /></a>
            <a className="hover:text-primary transition"><FaTwitter /></a>
            <a className="hover:text-primary transition"><FaYoutube /></a>
          </div>
        </div>

        
        <div>
          <h2 className="text-xl font-bold text-primary mb-3">Working Hours</h2>
          <p className="text-base">🍽 Sunday – Thursday</p>
          <p className="text-base">⏰ 10:00 AM – 10:00 PM</p>
          <p className="text-base">📦 Home Delivery Available</p>
        </div>

        
        <div>
          <h2 className="text-xl font-bold text-primary mb-3">Stay Updated</h2>
          <p className="text-base mb-2">Get updates about our new meals & offers.</p>

          <input
            type="email"
            placeholder="Enter your email"
            className="input input-sm w-full mt-1 bg-base-200 text-black"
          />
          <button className="btn btn-sm bg-primary text-neutral mt-3 hover:bg-[#b9932c]">
            Subscribe
          </button>
        </div>
      </div>

      <div className="divider my-8 border-white/20"></div>

      
      <div className="text-center text-sm text-white/80">
        © {new Date().getFullYear()} LocalChefBazaar — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
