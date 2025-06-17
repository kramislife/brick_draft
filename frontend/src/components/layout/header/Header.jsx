import React from "react";
import { NavLink } from "react-router-dom";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import MobileMenu from "@/components/layout/header/MobileMenu";
import AuthDialog from "@/pages/auth/AuthDialog";
import { publicNavLinks } from "@/constant/userNavigation";
import { useThemeToggle } from "@/hooks/toggleTheme";

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

          {/* Desktop Sign In */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="hidden md:flex" variant="accent">
                Sign In
              </Button>
            </DialogTrigger>
            <AuthDialog />
          </Dialog>

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
            <MobileMenu navLinks={publicNavLinks} />
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;



// import React from "react";
// import { NavLink } from "react-router-dom";
// import { Moon, Sun, Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetTrigger } from "@/components/ui/sheet";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
// import MobileMenu from "@/components/layout/header/MobileMenu";
// import AuthDialog from "@/pages/auth/AuthDialog";
// import { publicNavLinks } from "@/constant/userNavigation";
// import { useThemeToggle } from "@/hooks/toggleTheme";

// // Icon button component
// const IconButton = ({
//   icon,
//   onClick,
//   label,
//   title,
//   variant = "ghost",
//   className = "",
//   asChild = false,
// }) => (
//   <Button
//     variant={variant}
//     size="icon"
//     onClick={onClick}
//     aria-label={label}
//     title={title}
//     className={className}
//     asChild={asChild}
//   >
//     {icon}
//   </Button>
// );

// const Header = () => {
//   const { darkMode, toggleDarkMode } = useThemeToggle();

//   return (
//     <header className="bg-foreground text-background gradient-blue dark:text-foreground sticky top-0 z-50 w-full dark:border-b font-['Bangers'] tracking-widest p-3">
//       <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
//         <NavLink
//           to="/"
//           className="font-bold text-3xl gradient-text hover-gradient-text after:hidden p-1"
//         >
//           Brick Draft
//         </NavLink>

//         <nav className="hidden md:flex items-center gap-10 md:text-lg lg:gap-15 lg:text-xl">
//           {publicNavLinks.map((link) => {
//             return (
//               <NavLink
//                 key={link.path}
//                 to={link.path}
//                 className={({ isActive }) =>
//                   `relative transition-colors flex items-center gap-2 ${
//                     isActive
//                       ? "gradient-text hover-gradient-text active"
//                       : "hover-gradient-text inactive"
//                   }`
//                 }
//               >
//                 {link.name}
//               </NavLink>
//             );
//           })}
//         </nav>

//         <div className="flex items-center md:gap-1">
//           {/* Theme Toggle */}
//           <IconButton
//             icon={darkMode ? <Sun /> : <Moon />}
//             onClick={toggleDarkMode}
//             label="Toggle dark mode"
//             title={darkMode ? "Toggle light mode" : "Toggle dark mode"}
//           />

//           {/* Desktop Sign In */}
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button className="hidden md:flex" variant="accent">
//                 Sign In
//               </Button>
//             </DialogTrigger>
//             <AuthDialog />
//           </Dialog>

//           {/* Mobile Menu */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <IconButton
//                 icon={<Menu />}
//                 label="Open menu"
//                 title="Open menu"
//                 className="md:hidden"
//               />
//             </SheetTrigger>
//             <MobileMenu navLinks={publicNavLinks} />
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
