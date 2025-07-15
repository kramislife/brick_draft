import React from "react";
import { NavLink } from "react-router-dom";
import { User, LogOut } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthDialog from "@/pages/auth/AuthDialog";
import { getUserMenuItems } from "@/constant/userNavigation";

const MobileMenu = ({
  navLinks,
  isAuthenticated,
  user,
  isAdmin,
  isLoading,
  onLogout,
  onProfileClick,
  onAdminClick,
  onPurchasesClick,
  getUserInitials,
  isAuthDialogOpen,
  onAuthDialogOpenChange,
  onCloseAuthDialog,
}) => {
  // Get user menu items from centralized configuration
  const userMenuItems = getUserMenuItems(
    isAdmin,
    onAdminClick,
    onProfileClick,
    onPurchasesClick
  );

  return (
    <SheetContent
      side="right"
      className="bg-foreground dark:bg-background border-none font-['Bangers'] tracking-widest flex flex-col overflow-y-auto"
    >
      <SheetHeader>
        <SheetTitle className="text-left sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">
          This is a mobile menu
        </SheetDescription>
      </SheetHeader>

      {/* User Profile Section - Only show when authenticated */}
      {isAuthenticated && user && (
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user?.profile_picture?.url}
              alt={user?.name || "User"}
            />
            <AvatarFallback className="text-sm">
              {getUserInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 font-['Poppins']">
            <span className="text-sm font-bold text-background dark:text-foreground">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-muted/50 dark:text-muted-foreground">
              {user?.email || "User"}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3 flex-1">
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

        {/* User Menu Items - Only show when authenticated */}
        {isAuthenticated && userMenuItems.length > 0 && (
          <>
            <div className="border-t border-muted-foreground"></div>

            {userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
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
                      {item.label}
                    </span>
                  </SheetClose>
                </NavLink>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer - Sign In or Logout */}
      <SheetFooter className="px-0 mt-auto">
        {isAuthenticated ? (
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={onLogout}
            disabled={isLoading}
          >
            <LogOut size={20} />
            <span>{isLoading ? "Logging out..." : "Log out"}</span>
          </Button>
        ) : (
          <Dialog open={isAuthDialogOpen} onOpenChange={onAuthDialogOpenChange}>
            <DialogTrigger asChild>
              <Button variant="accent" size="lg" className="w-full">
                <User />
                <span>Sign In</span>
              </Button>
            </DialogTrigger>
            <AuthDialog onClose={onCloseAuthDialog} />
          </Dialog>
        )}
      </SheetFooter>
    </SheetContent>
  );
};

export default MobileMenu;
