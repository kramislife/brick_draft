import {
  LayoutDashboard,
  BellIcon,
  ImageIcon,
  PackageIcon,
  Puzzle,
  TicketIcon,
  UsersIcon,
  FolderClosed,
  PuzzleIcon,
  Palette,
} from "lucide-react";

export const adminNavigation = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: "Content",
    items: [
      {
        label: "Announcements",
        path: "/admin/announcements",
        icon: BellIcon,
      },
      {
        label: "Banners",
        path: "/admin/banners",
        icon: ImageIcon,
      },
      {
        label: "Collections",
        path: "/admin/collections",
        icon: FolderClosed,
      },
      {
        label: "Colors",
        path: "/admin/colors",
        icon: Palette,
      },
      {
        label: "Part Categories",
        path: "/admin/part-categories",
        icon: PuzzleIcon,
      },
    ],
  },
  {
    section: "Lottery Management",
    items: [
      {
        label: "Lotteries",
        path: "/admin/lotteries",
        icon: PackageIcon,
      },
      {
        label: "Parts",
        path: "/admin/parts",
        icon: Puzzle,
      },
      {
        label: "Tickets",
        path: "/admin/tickets",
        icon: TicketIcon,
      },
    ],
  },
  {
    section: "User Management",
    items: [
      {
        label: "Users",
        path: "/admin/users",
        icon: UsersIcon,
      },
    ],
  },
  //   {
  //     section: "System",
  //     items: [
  //       {
  //         label: "Settings",
  //         path: "/admin/settings",
  //         icon: SettingsIcon,
  //       },
  //     ],
  //   },
];
