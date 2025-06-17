import React from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

const AboutTips = ({ data, animations }) => {
  const { tipsHeaderAnimation, tipAnimation } = animations;

  return (
    <section className="py-10 px-5 bg-secondary/50">
      <motion.div {...tipsHeaderAnimation} className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{data.tipsTitle}</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          {data.tipsDescription}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.tips.map((tip, index) => (
          <motion.div key={index} {...tipAnimation(index)}>
            <Card className="h-full dark:border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <tip.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutTips;