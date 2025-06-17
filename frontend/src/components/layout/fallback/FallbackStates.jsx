import React from "react";
import { Package } from "lucide-react";

const FallbackStates = ({
  icon: Icon = Package,
  title = "No Data Available",
  description = "Check back later for updates.",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center space-y-3 ${className}`}
    >
      <Icon className="w-16 h-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FallbackStates;
