import {
  Home,
  Info,
  Phone,
  User,
  LogIn,
  UserPlus,
  FileText,
  ShieldCheck,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Trophy,
  Tv,
} from "lucide-react";

export const publicNavLinks = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Results",
    path: "/results",
    icon: Trophy,
  },
  {
    name: "Live Draw",
    path: "/live-draw",
    icon: Tv,
  },
  {
    name: "About",
    path: "/about",
    icon: Info,
  },
  {
    name: "Contact Us",
    path: "/contact-us",
    icon: Phone,
  },
];

export const accountLinks = [
  {
    name: "My Account",
    path: "/profile",
    icon: User,
  },
  {
    name: "Login",
    path: "/login",
    icon: LogIn,
  },
  {
    name: "Register",
    path: "/register",
    icon: UserPlus,
  },
];

export const supportInfo = [
  {
    text: "Terms Of Use",
    path: "/terms-of-use",
    type: "routerLink",
    icon: FileText,
  },
  {
    text: "Privacy Policy",
    path: "/privacy-policy",
    type: "routerLink",
    icon: ShieldCheck,
  },
  {
    text: "Lehi, Utah 84043",
    type: "text",
    icon: MapPin,
  },
];

export const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/theworldofminifigs/",
    ariaLabel: "Visit our Facebook page",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/theworldofminifigs/",
    ariaLabel: "Follow us on Instagram",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:brickextremeofficial@gmail.com",
    ariaLabel: "Send us an email",
  },
];
