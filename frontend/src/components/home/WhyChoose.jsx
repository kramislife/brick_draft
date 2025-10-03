import React from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

const WhyChoose = ({ data, animations }) => {
  const { headerAnimation, featureAnimation } = animations;

  return (
    <section className="py-10 px-5 bg-secondary/50">
      {/* Header */}
      <motion.div {...headerAnimation} className="text-center mb-10">
        <h2 className="text-5xl font-black mb-3">
          Brick <span className="text-accent">Draft Perks</span>
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          {data.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {data.features.map((feature, index) => (
          <motion.div key={index} {...featureAnimation(index)}>
            <Card className="h-full hover:shadow-lg transition-shadow dark:border-none">
              <CardContent className="p-5 flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className="mb-5">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-accent" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChoose;
