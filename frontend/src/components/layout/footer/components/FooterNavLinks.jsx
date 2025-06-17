import React from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AuthDialog from "@/pages/auth/AuthDialog";

const FooterNavLinks = ({ links }) => (
  <nav className="flex flex-col space-y-5">
    {links.map((link) => {
      if (link.name === "Login" || link.name === "Register") {
        return (
          <Dialog key={link.path}>
            <DialogTrigger asChild>
              <span className="cursor-pointer hover:text-background dark:hover:text-accent transition-colors duration-300 flex items-center gap-2">
                {link.name}
              </span>
            </DialogTrigger>
            <AuthDialog defaultTab={link.name.toLowerCase()} />
          </Dialog>
        );
      }

      return (
        <Link
          key={link.path}
          to={link.path}
          className="hover:text-background dark:hover:text-accent transition-colors duration-300 flex items-center gap-2"
        >
          <span>{link.name}</span>
        </Link>
      );
    })}
  </nav>
);

export default FooterNavLinks;