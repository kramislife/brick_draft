import React from "react";
import LotteryGrid from "@/components/home/components/LotteryGrid";

const LotterySet = () => {
  return (
    <LotteryGrid 
    title="Lottery Sets" 
    showViewAll={true} limit={8} />
  );
};

export default LotterySet;