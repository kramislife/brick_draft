import React from "react";

const FooterSocialLinks = ({ links }) => (
  <div className="flex space-x-3">
    {links.map(({ icon: Icon, href, ariaLabel }, index) => (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-foreground text-background dark:bg-muted-foreground/10 dark:text-accent hover:text-accent dark:hover:text-foreground p-3 rounded-full transition-colors duration-300"
        aria-label={ariaLabel}
      >
        <Icon size={20} />
      </a>
    ))}
  </div>
);

export default FooterSocialLinks;