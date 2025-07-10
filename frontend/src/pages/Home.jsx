import React from "react";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Banner from "@/components/home/Banner";
import LotterySet from "@/components/home/LotterySet";
import WhyChoose from "@/components/home/WhyChoose";
import UpcomingDraw from "@/components/home/UpcomingDraw";
import CollectionGrid from "@/components/home/components/CollectionGrid";
import { aboutAnimations } from "@/hooks/animationConfig";
import { whyChooseData } from "@/constant/aboutData";

const Home = () => {
  return (
    <>
      <AnnouncementBar />
      <Banner />
      <LotterySet />
      <UpcomingDraw />
      <CollectionGrid showViewAll={true} limit={8} />
      <WhyChoose data={whyChooseData} animations={aboutAnimations.choose} />
    </>
  );
};

export default Home;
