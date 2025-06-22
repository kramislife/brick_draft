import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import MobileMenu from "@/components/layout/header/MobileMenu";
import AuthDialog from "@/pages/auth/AuthDialog";
import UserDropdown from "@/components/layout/header/UserDropdown";
import { publicNavLinks } from "@/constant/userNavigation";
import { useThemeToggle } from "@/hooks/toggleTheme";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectIsAdmin,
} from "@/redux/features/authSlice";
import { useLogoutMutation, authApi } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { toast } from "sonner";

// Icon button component
const IconButton = ({
  icon,
  onClick,
  label,
  title,
  variant = "ghost",
  className = "",
  asChild = false,
}) => (
  <Button
    variant={variant}
    size="icon"
    onClick={onClick}
    aria-label={label}
    title={title}
    className={className}
    asChild={asChild}
  >
    {icon}
  </Button>
);

const Header = () => {
  const { darkMode, toggleDarkMode } = useThemeToggle();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  // Centralized logout handler
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      // Clear Redux state
      dispatch(logout());
      // Clear RTK Query cache
      dispatch(authApi.util.resetApiState());
      toast.success("Logged out successfully");
      // Force page refresh to ensure complete logout
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to logout");
      // Still clear local state even if server logout fails
      dispatch(logout());
      // Clear RTK Query cache
      dispatch(authApi.util.resetApiState());
      // Force page refresh to ensure complete logout
      window.location.href = "/";
    }
  };

  // Centralized navigation handlers
  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  // Auth dialog handlers
  const handleCloseAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-foreground text-background dark:bg-background dark:text-foreground sticky top-0 z-50 w-full dark:border-b dark:border-border font-['Bangers'] tracking-widest">
      <div className="p-5 flex justify-between items-center max-w-screen-2xl mx-auto">
        <NavLink to="/" className="font-bold text-3xl">
          Brick <span className="text-accent">Draft</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-10 md:text-lg lg:gap-15 lg:text-xl">
          {publicNavLinks.map((link) => {
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative transition-colors flex items-center gap-2 ${
                    isActive
                      ? "text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent"
                      : "hover:text-accent dark:text-foreground dark:hover:text-accent after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full hover:after:left-0"
                  }`
                }
              >
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center md:gap-1">
          {/* Theme Toggle */}
          <IconButton
            icon={darkMode ? <Sun /> : <Moon />}
            onClick={toggleDarkMode}
            label="Toggle dark mode"
            title={darkMode ? "Toggle light mode" : "Toggle dark mode"}
          />

          {/* Desktop Authentication */}
          {isAuthenticated ? (
            <div className="hidden md:flex">
              <UserDropdown
                user={user}
                isAdmin={isAdmin}
                isLoading={isLoading}
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
                onAdminClick={handleAdminClick}
                getUserInitials={getUserInitials}
              />
            </div>
          ) : (
            <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
              <DialogTrigger asChild>
                <Button className="hidden md:flex" variant="accent">
                  Sign In
                </Button>
              </DialogTrigger>
              <AuthDialog onClose={handleCloseAuthDialog} />
            </Dialog>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <IconButton
                icon={<Menu />}
                label="Open menu"
                title="Open menu"
                className="md:hidden"
              />
            </SheetTrigger>
            <MobileMenu
              navLinks={publicNavLinks}
              isAuthenticated={isAuthenticated}
              user={user}
              isAdmin={isAdmin}
              isLoading={isLoading}
              onLogout={handleLogout}
              onProfileClick={handleProfileClick}
              onAdminClick={handleAdminClick}
              getUserInitials={getUserInitials}
              isAuthDialogOpen={isAuthDialogOpen}
              onAuthDialogOpenChange={setIsAuthDialogOpen}
              onCloseAuthDialog={handleCloseAuthDialog}
            />
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
