import MasterCard from "@/assets/images/mastercard.svg";
import Visa from "@/assets/images/visa.png";
import Stripe from "@/assets/images/stripe.svg";
import PayPal from "@/assets/images/Paypal.png";

export const paymentMethod = [
  {
    type: "credit-card",
    content: {
      images: [
        { src: MasterCard, alt: "MasterCard", className: "h-8" },
        { src: Visa, alt: "Visa", className: "h-8" },
        { src: Stripe, alt: "Stripe", className: "h-6" },
      ],
    },
  },
  {
    type: "paypal",
    content: {
      images: [{ src: PayPal, alt: "PayPal", className: "h-20" }],
    },
  },
];

export const deliveryMethod = [
  { value: "delivery", label: "Deliver to my address", icon: "📦" },
  { value: "pick-up", label: "Pick-up in store", icon: "🏬" },
];
