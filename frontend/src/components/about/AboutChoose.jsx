import React from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

const AboutChoose = ({ data, animations }) => {
  const { headerAnimation, featureAnimation } = animations;

  return (
    <section className="py-10 px-5">
      <motion.div {...headerAnimation} className="text-center mb-5 md:mb-10">
        <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          {data.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.features.map((feature, index) => (
          <motion.div key={index} {...featureAnimation(index)}>
            <Card className="group hover:border-accent cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300"
                  >
                    <feature.icon className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutChoose;