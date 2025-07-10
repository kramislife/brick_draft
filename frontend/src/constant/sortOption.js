export const SORT_OPTIONS = {
  FEATURED: "Featured",
  BEST_SELLER: "Best Seller",
  NEW_ARRIVAL: "New Arrival",
  LIMITED_EDITION: "Limited Edition",
  ENDING_SOON: "Ending Soon",
  DRAW_DATE: "Draw Date",
  NEWLY_ADDED: "Newly Added",
  PRICE_LOW_HIGH: "Price: Low to High",
  PRICE_HIGH_LOW: "Price: High to Low",
};

// Part sort options for LotteryDetails and parts tables
export const PART_SORT_OPTIONS = [
  { value: "name", label: "Name: A-Z" },
  { value: "-name", label: "Name: Z-A" },
  { value: "part_id", label: "Part ID: Low to High" },
  { value: "-part_id", label: "Part ID: High to Low" },
  { value: "quantity", label: "Quantity: Low to High" },
  { value: "-quantity", label: "Quantity: High to Low" },
  { value: "total_value", label: "Total Value: Low to High" },
  { value: "-total_value", label: "Total Value: High to Low" },
  { value: "date", label: "Date: Oldest to Newest" },
  { value: "-date", label: "Date: Newest to Oldest" },
];

export const PER_PAGE_OPTIONS = [10, 25, 50, 100, "all"];
