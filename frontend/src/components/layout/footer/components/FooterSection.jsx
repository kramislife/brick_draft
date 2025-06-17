import React from "react";

const FooterSection = ({ title, children }) => (
  <div>
    <h2 className="font-['Bangers'] text-2xl tracking-wide border-b-2 border-foreground dark:border-accent mb-5 w-max">
      {title}
    </h2>
    {children}
  </div>
);

export default FooterSection;