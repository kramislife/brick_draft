import React from "react";
import { Link } from "react-router-dom";

const FooterSupportLinks = ({ items }) => (
  <div className="flex flex-col space-y-5">
    {items.map((item, index) => {
      if (item.type === "routerLink") {
        return (
          <Link
            key={index}
            to={item.path}
            className="hover:text-background dark:hover:text-accent transition-colors duration-300 flex items-center gap-2"
          >
            <span>{item.text}</span>
          </Link>
        );
      } else {
        return (
          <p key={index} className="flex items-center gap-2">
            <span>{item.text}</span>
          </p>
        );
      }
    })}
  </div>
);

export default FooterSupportLinks;