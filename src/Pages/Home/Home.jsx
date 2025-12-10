import React from "react";
import Banner from "../../Components/Home/Banner";
import ExtraSection from "../../Components/Home/ExtraSection";
import { Helmet } from "react-helmet";
import DailyMeals from "../../Components/Home/DailyMeals";
import DisplayReviews from "../../Components/Home/DisplayReviews";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home | LocalChefBazaar</title>
      </Helmet>
      <Banner />
      <DailyMeals/>
      <DisplayReviews/>
      <ExtraSection />
    </div>
  );
};

export default Home;
