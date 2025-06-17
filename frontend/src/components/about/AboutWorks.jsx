import React from "react";
import { motion } from "motion/react";
import Arrow from "@/components/ui/arrow";

const ProcessStep = ({ step, index, totalSteps }) => {
  const IconComponent = step.icon;
  const isFirstRow = index < 4;
  const isLastInRow = isFirstRow ? index === 3 : index === totalSteps - 1;

  return (
    <motion.div className="flex flex-col items-center text-center">
      {/* Icon Circle */}
      <div className="mb-6">
        <div
          className={`w-20 h-20 rounded-full ${step.iconBg} flex items-center justify-center mb-2`}
        >
          <IconComponent className={`w-10 h-10 ${step.iconColor}`} />
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
      <p className="text-sm text-muted-foreground px-4 whitespace-pre-line">
        {step.description}
      </p>

      {/* Arrow connector */}
      {!isLastInRow && (
        <div
          className="hidden md:block absolute top-16 transform -translate-y-1/2"
          style={{
            left: isFirstRow
              ? `calc(${25 * (index + 1)}% - 1rem)`
              : "calc(50% - 0.5rem)",
          }}
        >
          <Arrow />
        </div>
      )}
    </motion.div>
  );
};

const AboutWorks = ({ data, animations }) => {
  const { headerAnimation, stepAnimation } = animations;

  return (
    <section className="py-10 px-5">
      <motion.div {...headerAnimation} className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-3">{data.title}</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          {data.description}
        </p>
      </motion.div>

      {/* Main Process Steps */}
      <div className="max-w-7xl mx-auto">
        <div className="grid">
          {data.steps.map((step, index) => {
            const isFirstRow = index < 4;

            return (
              <div
                key={index}
                className={`${
                  isFirstRow ? "col-span-full" : "mx-auto max-w-2xl w-full"
                }`}
              >
                {index === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 gap-y-8 relative mb-8">
                    {data.steps
                      .slice(0, 4)
                      .map((firstRowStep, firstRowIndex) => (
                        <motion.div
                          key={firstRowIndex}
                          {...stepAnimation(firstRowIndex)}
                        >
                          <ProcessStep
                            step={firstRowStep}
                            index={firstRowIndex}
                            totalSteps={data.steps.length}
                          />
                        </motion.div>
                      ))}
                  </div>
                )}
                {index === 4 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-8 relative">
                    {data.steps
                      .slice(4)
                      .map((secondRowStep, secondRowIndex) => (
                        <motion.div
                          key={secondRowIndex + 4}
                          {...stepAnimation(secondRowIndex + 4)}
                        >
                          <ProcessStep
                            step={secondRowStep}
                            index={secondRowIndex + 4}
                            totalSteps={data.steps.length}
                          />
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutWorks;
