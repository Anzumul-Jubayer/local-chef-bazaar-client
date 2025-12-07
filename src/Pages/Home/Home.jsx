import React from "react";
import Banner from "../../Components/Home/Banner";
import ExtraSection from "../../Components/Home/ExtraSection";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home | LocalChefBazaar</title>
      </Helmet>
      <Banner />
      <ExtraSection />
    </div>
  );
};

export default Home;
