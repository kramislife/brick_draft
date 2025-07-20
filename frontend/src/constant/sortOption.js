// Lottery sort options for lottery grids and listings
export const LOTTERY_SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "-featured", label: "Featured (Reverse)" },
  { value: "best_seller", label: "Best Seller" },
  { value: "-best_seller", label: "Best Seller (Reverse)" },
  { value: "new_arrival", label: "New Arrival" },
  { value: "-new_arrival", label: "New Arrival (Reverse)" },
  { value: "limited_edition", label: "Limited Edition" },
  { value: "-limited_edition", label: "Limited Edition (Reverse)" },
  { value: "draw_date", label: "Draw Date: Soonest First" },
  { value: "-draw_date", label: "Draw Date: Latest First" },
  { value: "created_at", label: "Newly Added" },
  { value: "-created_at", label: "Oldest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "pieces", label: "Pieces: Low to High" },
  { value: "-pieces", label: "Pieces: High to Low" },
];

// Part sort options for LotteryDetails and parts tables
export const PART_SORT_OPTIONS = [
  { value: "name", label: "Name: A-Z" },
  { value: "-name", label: "Name: Z-A" },
  { value: "quantity", label: "Quantity: Low to High" },
  { value: "-quantity", label: "Quantity: High to Low" },
  { value: "total_value", label: "Total Value: Low to High" },
  { value: "-total_value", label: "Total Value: High to Low" },
  { value: "date", label: "Date: Oldest to Newest" },
  { value: "-date", label: "Date: Newest to Oldest" },
];

// Per page options
export const PER_PAGE_OPTIONS = [
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];
