import {
  Lightbulb,
  ListChecks,
  Clock,
  Bell,
  DollarSign,
  ShieldCheck,
  LineChart,
  Truck,
  Headphones,
  Users,
  Trophy,
  Telescope,
  LightbulbIcon,
  Dices,
  Hourglass,
  Puzzle,
  PiggyBank,
  Sparkle,
  RefreshCcw,
} from "lucide-react";

// Hero section data
export const heroData = {
  title: "Stop Searching, Start",
  titleAccent: "Building:",
  subtitle: "Get the Exact LEGO Bricks You Need!",
  description:
    "Tired of incomplete sets? Get the chance to pick individual LEGO® items in the most exciting and FUN way!",
};

// Story section data
export const storyData = {
  badge: "OUR STORY",
  title: "Making LEGO Dreams Accessible to Everyone",
  imageUrl:
    "https://res.cloudinary.com/mark-legostore/image/upload/v1743056478/world_of_minifigs/icons/Father-son.png",
  imageAlt: "Brick Draft Community",
  paragraphs: [
    '<span class="font-bold">Brick Draft</span> was born from a simple yet powerful idea: making LEGO collecting accessible to everyone. We understand that many LEGO enthusiasts dream of owning premium sets but are held back by their high costs.',
    "Our innovative lottery system creates an exciting opportunity for builders of all backgrounds to win authentic LEGO sets at a fraction of their retail price. Every draw is conducted with complete transparency using certified random number generation technology.",
    'Beyond just being a lottery platform, we\'ve built a thriving community of LEGO enthusiasts who share our passion for building and collecting. Our <span class="font-bold">97% satisfaction rate</span> reflects our commitment to fairness, authenticity, and exceptional service.',
  ],
};

// How it works section data
export const worksData = {
  badge: "HOW IT WORKS",
  title: "Get the LEGO® Pieces You Want, Simply!",
  description:
    "Join our engaging Brick Drafts for a chance to acquire the exact LEGO® elements you've been searching for.",
  steps: [
    {
      icon: Telescope,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      title: "Explore LEGO® Sets",
      description:
        "We feature different LEGO® sets for each draw. See what pieces are included and other details.",
    },
    {
      icon: Dices,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      title: "Join the Draw",
      description:
        "Buy tickets for the sets you're interested in. More tickets mean better odds in the picking order.",
    },
    {
      icon: Hourglass,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
      title: "Ticket Queueing",
      description:
        "After ticket sales close, we randomly queue tickets for everyone who bought them.",
    },
    {
      icon: Trophy,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      title: "Pick Your Bricks",
      description:
        "When your turn comes, choose your favorite LEGO® pieces from what's available.",
    },
    {
      icon: LightbulbIcon,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500",
      title: "Understand the Draft",
      description:
        "Round 1: Normal order. \nRound 2: Reverse order (last goes first). This pattern continues until all bricks are picked!",
    },
    {
      icon: Truck,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-500",
      title: "Receive Your LEGO®",
      description:
        "After the draw wraps up, we'll ship your selected bricks straight to your doorstep.",
    },
  ],
  tipsBadge: "BRICK DRAFT TIPS",
  tipsTitle: "Tips for Brick Draft Success",
  tipsDescription:
    "Maximize your chances of getting the exact pieces you want with these helpful strategies.",
  tips: [
    {
      icon: Lightbulb,
      title: "Understand the Sets",
      description:
        "Carefully review the parts list of each featured LEGO® set before buying tickets.",
    },
    {
      icon: ListChecks,
      title: "Strategic Ticket Purchase",
      description:
        "Consider buying multiple tickets to increase your chances of getting an earlier queue.",
    },
    {
      icon: Clock,
      title: "Act Fast When It's Your Turn",
      description:
        "Be ready to make your selections when your queue number is called.",
    },
    {
      icon: Bell,
      title: "Stay Informed",
      description:
        "Keep an eye on your email and our website for updates on draws and your queue status.",
    },
  ],
};

// Why Choose Us section data
export const chooseData = {
  badge: "WHY CHOOSE BRICK DRAFT",
  title: "Love LEGO®? Win Specific Bricks Through Exciting Draws! 🏆",
  description:
    "Brick Draft is a platform created by LEGO® fans, for LEGO® fans, making specific pieces more accessible.",
  features: [
    {
      icon: DollarSign,
      title: "Affordable LEGO® Items",
      description: "Get the exact piece you want for a fraction of price!",
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic LEGO® Guaranteed",
      description: "We only source all LEGO® items from authorized stores.",
    },
    {
      icon: LineChart,
      title: "New and Extremely Organized",
      description:
        "Skip the long sorting hours with Brick Draft. All packed neatly so you can solely focus on building your dream LEGO® creations.",
    },
    {
      icon: Truck,
      title: "Fast & Secure Shipping",
      description:
        "Winners enjoy fast, insured shipping with real-time tracking. We ensure every prize reaches you safely and securely.",
    },
    {
      icon: Headphones,
      title: "Dedicated Customer Support",
      description:
        "Questions? Concerns? Our friendly support team is ready to help — we are builders serving builders!",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "More than just prizes — Brick Draft is about connecting fans who love creativity, building, and sharing their LEGO passion.",
    },
  ],
};

// Why Choose Brick Draft section data in home page

export const whyChooseData = {
  description:
    "Join thousands of LEGO® enthusiasts who are winning their dream sets through our exciting lottery system!",
  features: [
    {
      icon: Puzzle,
      title: "Get Specific Pieces",
      description:
        "Now is the time to get those rare or unique LEGO® elements you've always wanted!",
    },
    {
      icon: PiggyBank,
      title: "Save Money",
      description:
        "Potentially get your desired bricks for much less than buying an entire set.",
    },
    {
      icon: Sparkle,
      title: "Exciting and Fun",
      description:
        "The thrill of the draw and the anticipation of your turn make it an engaging experience.",
    },
    {
      icon: Users,
      title: "Community of Builders",
      description:
        "Connect with fellow LEGO® enthusiasts who share your passion.",
    },
    {
      icon: RefreshCcw,
      title: "Regularly Updated Draws",
      description:
        "We constantly feature new LEGO® sets and exciting opportunities.",
    },
  ],
};
