import React from "react";
import { CircleSmall } from "lucide-react";
import { motion } from "motion/react";
import { legalPageAnimations } from "@/hooks/animationConfig";
import { useScrollSectionTracker } from "@/components/layout/scroll/ScrollToTop";
import { privacyData, termsData } from "@/constant/legalData";
import { Button } from "@/components/ui/button";

const LegalPage = ({ type }) => {
  const data = type === "privacy" ? privacyData : termsData;
  const initialSection = type === "privacy" ? "collect" : "acceptance";

  const { activeSection, scrollToSection } =
    useScrollSectionTracker(initialSection);
  const { container, header, section, listItem } = legalPageAnimations;

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-4 gap-5 p-5 font-[Inter]"
      {...container}
    >
      {/* Left Navigation */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <nav className="space-y-5">
            {data.sections.map((section, index) => (
              <Button
                variant="legal"
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`py-5 ${
                  activeSection !== section.id &&
                  "bg-inherit hover:bg-ring/20 text-muted-foreground"
                }`}
              >
                <div>{index + 1}.</div>
                <span>{section.title}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 md:border-l">
        <div className="p-5">
          {/* Header */}
          <motion.div className="mb-10" {...header}>
            <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
            <p className="text-muted-foreground text-sm">{data.lastUpdated}</p>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-10">
            {data.sections.map((sectionData, sectionIndex) => (
              <motion.div
                key={sectionData.id}
                id={sectionData.id}
                data-section={sectionData.id}
                {...section(sectionIndex)}
              >
                <div className="mb-3">
                  <h2 className="text-2xl font-bold mb-1">
                    {sectionData.title}
                  </h2>
                  <div className="w-12 h-0.5 bg-accent"></div>
                </div>

                {Array.isArray(sectionData.content) ? (
                  <div className="space-y-5">
                    {sectionData.content.map((item, idx) => (
                      <motion.div
                        key={idx}
                        {...listItem(idx)}
                        className="flex items-start gap-2 ml-5"
                      >
                        <CircleSmall size={16} className="shrink-0 mt-1" />

                        <span className="font-semibold">
                          {item.subtitle}{" "}
                          <span className="text-muted-foreground font-normal">
                            - {item.text}
                          </span>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    - {sectionData.content}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LegalPage;
