import React from "react";
import FooterSection from "@/components/layout/footer/components/FooterSection";
import FooterNavLinks from "@/components/layout/footer/components/FooterNavLinks";
import FooterSupportLinks from "@/components/layout/footer/components/FooterSupportLinks";
import FooterSocialLinks from "@/components/layout/footer/components/FooterSocialLinks";
import FooterCopyright from "@/components/layout/footer/components/FooterCopyright";
import {
  publicNavLinks,
  accountLinks,
  supportInfo,
  socialLinks,
} from "@/constant/userNavigation";

const Footer = () => {
  return (
    <footer className="bg-accent text-foreground gradient-blue-darker p-5">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10 max-w-screen-2xl mx-auto">
        <FooterSection title="Account">
          <FooterNavLinks links={accountLinks} />
        </FooterSection>

        <FooterSection title="Quick Links">
          <FooterNavLinks links={publicNavLinks} />
        </FooterSection>

        <div className="col-span-2 md:col-span-1">
          <FooterSection title="Support">
            <FooterSupportLinks items={supportInfo} />
          </FooterSection>
        </div>

        <div className="col-span-2 md:col-span-1">
          <FooterSection title="Brick Draft">
            <p className="text-sm leading-6 mb-4">
              Connect with us for updates on new releases and promotions, or
              reach out via email for any inquiries or support needs.
            </p>
            <FooterSocialLinks links={socialLinks} />
          </FooterSection>
        </div>
      </div>

      <FooterCopyright />
    </footer>
  );
};

export default Footer;
