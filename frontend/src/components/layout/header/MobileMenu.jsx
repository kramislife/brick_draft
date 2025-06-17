import React from "react";
import { NavLink } from "react-router-dom";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import AuthDialog from "@/pages/auth/AuthDialog";

const MobileMenu = ({ navLinks }) => {
  return (
    <SheetContent
      side="right"
      className="bg-foreground dark:bg-background border-none font-['Bangers'] tracking-widest"
    >
      <SheetHeader>
        <SheetTitle className="text-left sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">
          This is a mobile menu
        </SheetDescription>
      </SheetHeader>
      <nav className="flex flex-col gap-3 mt-12">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xl transition-colors px-5 py-2 rounded-md flex items-center ${
                  isActive
                    ? "text-accent-foreground bg-accent"
                    : "text-background hover:bg-accent hover:text-accent-foreground dark:text-foreground dark:hover:text-accent-foreground"
                }`
              }
            >
              <SheetClose asChild>
                <span className="flex items-center gap-3 w-full">
                  <Icon size={20} />
                  {link.name}
                </span>
              </SheetClose>
            </NavLink>
          );
        })}
      </nav>

      <SheetFooter className="px-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="accent" size="lg" className="w-full">
              <User />
              <span>Sign In</span>
            </Button>
          </DialogTrigger>
          <AuthDialog />
        </Dialog>
      </SheetFooter>
    </SheetContent>
  );
};

export default MobileMenu;
