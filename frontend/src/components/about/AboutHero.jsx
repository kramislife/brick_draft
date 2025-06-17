import React from "react";
import { motion } from "motion/react";

const AboutHero = ({ data, animations }) => {
  const { circleAnimations, titleAnimation, descriptionAnimation } = animations;

  return (
    <section className="relative overflow-hidden py-20 md:py-36">
      <div className="absolute inset-0 opacity-15">
        <motion.div
          {...circleAnimations[0]}
          className="absolute -top-24 -left-24 w-80 h-80 md:w-96 md:h-96 rounded-full bg-accent"
        />
        <motion.div
          {...circleAnimations[1]}
          className="absolute top-1/2 right-1/4 w-52 h-52 md:w-64 md:h-64 rounded-full bg-accent"
        />
        <motion.div
          {...circleAnimations[2]}
          className="absolute -bottom-32 -right-32 w-64 h-64 md:w-80 md:h-80 rounded-full bg-accent"
        />
      </div>
      <div className="relative px-5 text-center">
        <motion.h1
          {...titleAnimation}
          className="text-5xl md:text-6xl lg:leading-tight font-bold mb-5 leading-tight"
        >
          {data.title} <span className="text-accent">{data.titleAccent}</span>{" "}
          <br />
          {data.subtitle}
        </motion.h1>

        <motion.div
          {...descriptionAnimation}
          className="relative mx-auto max-w-xl"
        >
          <p className="mx-auto text-sm md:text-base italic">
            {data.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
