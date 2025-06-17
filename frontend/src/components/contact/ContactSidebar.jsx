import React from "react";
import { motion } from "motion/react";
import ContactSocials from "@/components/contact/ContactSocials";
import ContactFaq from "@/components/contact/ContactFaq";

const ContactSidebar = ({ faqData, socialsData, animations }) => {
  return (
    <motion.div {...animations} className="lg:col-span-1">
      <div className="space-y-5">
        <ContactSocials data={socialsData} />
        <ContactFaq data={faqData} />
      </div>
    </motion.div>
  );
};

export default ContactSidebar;
