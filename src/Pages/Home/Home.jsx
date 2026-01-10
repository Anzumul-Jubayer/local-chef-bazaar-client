import React from "react";
import Banner from "../../Components/Home/Banner";
import ExtraSection from "../../Components/Home/ExtraSection";
import { Helmet } from "react-helmet";
import DailyMeals from "../../Components/Home/DailyMeals";
import DisplayReviews from "../../Components/Home/DisplayReviews";
import FeaturesSection from "../../Components/Home/FeaturesSection";
import HowItWorksSection from "../../Components/Home/HowItWorksSection";
import StatsSection from "../../Components/Home/StatsSection";
import ChefsSection from "../../Components/Home/ChefsSection";
import AppSection from "../../Components/Home/AppSection";
import TestimonialsSection from "../../Components/Home/TestimonialsSection";

const Home = () => {
  return (
    <div className="bg-base-100 min-h-screen">
      <Helmet>
        <title>Home | LocalChefBazaar</title>
      </Helmet>
      
      <Banner />
      <DailyMeals />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <ChefsSection />
      <TestimonialsSection />
      <AppSection />
      <DisplayReviews />
      <ExtraSection />
    </div>
  );
};

export default Home;
