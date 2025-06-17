import React from "react";
import { motion } from "motion/react";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutWorks from "@/components/about/AboutWorks";
import AboutTips from "@/components/about/AboutTips";
import AboutChoose from "@/components/about/AboutChoose";
import { aboutAnimations } from "@/hooks/animationConfig";
import {
  heroData,
  storyData,
  worksData,
  chooseData,
} from "@/constant/aboutData";

const About = () => {
  return (
    <motion.div {...aboutAnimations.page}>
      <AboutHero data={heroData} animations={aboutAnimations.hero} />
      <AboutStory data={storyData} animations={aboutAnimations.story} />
      <AboutWorks data={worksData} animations={aboutAnimations.works} />
      <AboutTips data={worksData} animations={aboutAnimations.works} />
      <AboutChoose data={chooseData} animations={aboutAnimations.choose} />
    </motion.div>
  );
};

export default About;
