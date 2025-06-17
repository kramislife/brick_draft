import React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

const AboutStory = ({ data, animations }) => {
  const { imageAnimation, contentAnimation, paragraphAnimation } = animations;

  return (
    <section className="flex flex-col md:flex-row gap-5 py-10 px-5 bg-secondary/50">
      <motion.div className="md:w-1/2" {...imageAnimation}>
        <img
          src={data.imageUrl}
          alt={data.imageAlt}
          className="rounded-lg shadow-xl"
        />
      </motion.div>

      <motion.div className="md:w-1/2" {...contentAnimation}>
        <Badge variant="accent" className="text-sm font-medium mb-5 py-2 px-5">
          {data.badge}
        </Badge>
        <h2 className="text-3xl font-bold mb-5">{data.title}</h2>
        <div className="space-y-5 leading-relaxed">
          {data.paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              {...paragraphAnimation(index)}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutStory;
