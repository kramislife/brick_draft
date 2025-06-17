import React from "react";
import { motion } from "motion/react";
import ContactHero from "@/components/contact/ContactHero";
import ContactFormSection from "@/components/contact/ContactFormSection";
import ContactSidebar from "@/components/contact/ContactSidebar";
import { contactAnimations } from "@/hooks/animationConfig";
import {
  contactHeroData,
  faqData,
  formFieldsData,
  socialsData,
} from "@/constant/contactData";

const Contact = () => {
  return (
    <motion.div {...contactAnimations.page}>
      <ContactHero data={contactHeroData} animations={contactAnimations.hero} />
      <div className="bg-secondary/50 grid grid-cols-1 lg:grid-cols-3 px-5 py-10 gap-5">
        <ContactFormSection
          data={formFieldsData}
          animations={contactAnimations.form}
        />
        <ContactSidebar
          faqData={faqData}
          socialsData={socialsData}
          animations={contactAnimations.sidebar}
        />
      </div>
    </motion.div>
  );
};

export default Contact;
