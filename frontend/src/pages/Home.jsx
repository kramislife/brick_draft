import React from "react";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Banner from "@/components/home/Banner";
import LotterySet from "@/components/home/LotterySet";
import WhyChoose from "@/components/home/WhyChoose";
import UpcomingDraw from "@/components/home/UpcomingDraw";
import CollectionGrid from "@/components/home/components/CollectionGrid";
import AboutWorks from "@/components/about/AboutWorks";
import { aboutAnimations } from "@/hooks/animationConfig";
import { whyChooseData, worksData } from "@/constant/aboutData";

const Home = () => {
  return (
    <>
      <AnnouncementBar />
      <Banner />
      <LotterySet />
      <div id="how-it-works">
        <AboutWorks data={worksData} animations={aboutAnimations.works} />
      </div>
      {/* <UpcomingDraw /> */}
      {/* <CollectionGrid showViewAll={true} limit={8} /> */}
      <WhyChoose data={whyChooseData} animations={aboutAnimations.choose} />
    </>
  );
};

export default Home;
