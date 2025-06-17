//------------------------------- ANNOUNCEMENT BAR SECTION -------------------------------------------//

export const announcements = [
  {
    text: "⚡ Flash Sale! 50% off all tickets for the next",
    hasSale: true,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  {
    text: "🎁 Buy one ticket, get one free this weekend only! Ends in",
    hasSale: true,
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
  },
  {
    text: "⏰ Limited time offer: Marvel collection drawing closes soon!",
    hasSale: false,
  },
  {
    text: "🏷️ New members: Use code WELCOME10 for 10% off your first ticket",
    hasSale: false,
  },
  {
    text: "🔥 Hot Deal! Hogwarts Castle tickets just restocked!",
    hasSale: false,
  },
];

//------------------------------------------ BANNER SECTION -------------------------------------------//
export const BADGE_CATEGORIES = {
  WELCOME: {
    text: "WELCOME TO BRICK DRAFT",
    className: "bg-accent text-black",
  },
  SALE: {
    text: "SALE",
    className: "bg-red-500 text-white",
  },
  NEW: {
    text: "NEW ARRIVAL",
    className: "bg-green-500 text-black",
  },
  SPECIAL: {
    text: "SPECIAL OFFER",
    className: "bg-purple-500 text-white",
  },
  COLLECTION: {
    text: "COLLECTION",
    className: "bg-blue-500 text-white",
  },
};

export const banners = [
  {
    image:
      "https://static1.dualshockersimages.com/wordpress/wp-content/uploads/2017/09/lego_world.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5",
    badge: BADGE_CATEGORIES.WELCOME,
    title:
      "Affordable LEGO® Parts, Finally Within Reach: Join the Brick Draft!",
    description:
      "Get access to specific LEGO® bricks without breaking the bank through our exciting draw-based system.",
    primaryLink: {
      text: "How It Works",
      href: "/about",
    },
    showVideoButton: false,
    videoUrl:
      "https://drive.google.com/file/d/1XWC_0rZ9wcN7324J2t8FIz9psIrndBhs/preview",
  },

  {
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmRsMHpuaTdza2Fkd2c4NXpxYnpiN2Iwd25rMG9naWVjeWVkNWdwbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1xljZ6jByg4EnptnTz/giphy.gif",
    badge: BADGE_CATEGORIES.NEW,
    title: "Join the Galactic Empire\nBuild Your Star Wars Legacy!",
    description:
      "Collect iconic Star Wars LEGO sets from a galaxy far, far away. From the Millennium Falcon to the Death Star, your collection awaits!",
    primaryLink: {
      text: "Explore Star Wars Sets",
      href: "/lottery/all",
    },
  },
  {
    image:
      "https://res.cloudinary.com/dhpccjumk/image/upload/v1745979338/ssmwbbvdfkpxp0h6y59o.png",
    badge: BADGE_CATEGORIES.SALE,
    title: "Final Hours to Enter Drawing!",
    description:
      "Don't miss your chance to win this incredible set. Enter now before the drawing closes.",
    timer: {
      label: "Drawing Closes In:",
      endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
    },
    primaryLink: {
      text: "Buy Ticket Now",
      href: "/lottery/all",
    },
  },
  {
    image:
      "https://res.cloudinary.com/dhpccjumk/image/upload/v1745935011/htpgltdpfo3bqdfv4sps.webp",
    badge: BADGE_CATEGORIES.COLLECTION,
    title: "Assemble Your Marvel LEGO Collection",
    description:
      "Enter to win exclusive Marvel sets and build your own superhero universe!",
    primaryLink: {
      text: "View Marvel Sets",
      href: "/lottery/all",
    },
  },
  {
    image:
      "https://res.cloudinary.com/dhpccjumk/image/upload/v1745937598/incgz1c6x2jr6x9roffd.webp",
    badge: BADGE_CATEGORIES.SPECIAL,
    title: "BUY ONE GET ONE FREE!",
    description:
      "Buy any ticket this weekend and get a second entry absolutely FREE. Limited time offer!",
    timer: {
      label: "Offer Ends In:",
      endDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours from now
    },
    primaryLink: {
      text: "Claim Offer Now",
      href: "/lottery/all",
    },
  },
];

//------------------------------------------ LOTTERY DATA SECTION -------------------------------------//
export const THEMES = {
  WINTER_CABIN: "Winter Cabin",
  HARRY_POTTER: "Harry Potter",
  ICONS: "Icons",
  ARCHITECTURE: "Architecture",
  SUPER_MARIO: "Super Mario",
  TECHNIC: "Technic",
  NASA: "NASA",
  NINJAGO: "NINJAGO",
  DISNEY: "Disney",
  GHOSTBUSTERS: "Ghostbusters",
  IDEAS: "Ideas",
  CREATOR_EXPERT: "Creator Expert",
  BOTANICAL: "Botanical Collection",
  MARVEL: "Marvel",
};

export const FEATURES = {
  FEATURED: "Featured",
  BEST_SELLER: "Best Seller",
  NEW_ARRIVAL: "New Arrival",
  LIMITED_EDITION: "Limited Edition",
};

export const PARTS = {
  TILES: "Tiles",
  DOORS: "Doors",
  ACCESSORIES: "Accessories",
  BRICKS: "Bricks",
  PLATES: "Plates",
  WINDOWS: "Windows",
  SPECIAL_PARTS: "Special Parts",
  TECHNIC_PARTS: "Technic Parts",
  WHEELS: "Wheels",
  MINIFIGURES: "Minifigures",
};

const commonParts = {
  tiles: [
    {
      id: "36840",
      name: "Tile 2x2",
      image:
        "https://res.cloudinary.com/dhpccjumk/image/upload/v1745240685/light-yellow.png",
      quantity: 1,
      price: 0.89,
      partType: "Smooth Plates",
      weight: "0.5g",
      color: "Light Yellow",
    },
    {
      id: "4595",
      name: "Tile 2x2",
      image:
        "https://res.cloudinary.com/dhpccjumk/image/upload/v1745299592/light-orange.png",
      quantity: 2,
      price: 1.9,
      partType: "Smooth Plates",
      weight: "0.8g",
      color: "Light Orange",
    },
    {
      id: "11610",
      name: "Tile 2x2",
      image:
        "https://res.cloudinary.com/dhpccjumk/image/upload/v1745240683/dark-blue.png",
      quantity: 3,
      price: 1.25,
      partType: "Smooth Plates",
      weight: "0.6g",
      color: "Dark Blue",
    },
  ],
  doors: [
    {
      id: "60596",
      name: "Door, Frame 1 x 4 x 6 with 2 Holes",
      image: "https://m.media-amazon.com/images/I/61YSZbWCNzL.jpg",
      quantity: 3,
      price: 3.5,
      partType: "Frames",
      weight: "2.2g",
      color: "Black",
    },
  ],
  accessories: [
    {
      id: "37762",
      name: "Minifigure, Utensil Candle",
      image: "https://i.ebayimg.com/images/g/JNsAAOSwne9mZsXL/s-l400.jpg",
      quantity: 10,
      price: 0.6,
      partType: "Minifigure Accessories",
      weight: "0.3g",
      color: "Black",
    },
    {
      id: "4529",
      name: "Minifigure, Utensil Saucepan",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ30zf-1T61pq6LBYqjo-rESNhEtEuA1FwdAQ&s",
      quantity: 1,
      price: 4.95,
      partType: "Minifigure Accessories",
      weight: "0.7g",
      color: "Black",
    },
  ],
  bricks: [
    {
      id: "3001",
      name: "Brick 2x4",
      image:
        "https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/4211395.jpg",
      quantity: 12,
      price: 0.35,
      partType: "Standard Bricks",
      weight: "1.2g",
      color: "Red",
    },
    {
      id: "3003",
      name: "Brick 2x2",
      image:
        "https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/4211398.jpg",
      quantity: 8,
      price: 0.25,
      partType: "Standard Bricks",
      weight: "0.8g",
      color: "Blue",
    },
  ],
  plates: [
    {
      id: "3020",
      name: "Plate 2x4",
      image:
        "https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/4211445.jpg",
      quantity: 6,
      price: 0.3,
      partType: "Standard Plates",
      weight: "0.6g",
      color: "Green",
    },
  ],
  windows: [
    {
      id: "60808",
      name: "Window 1x2x2",
      image: "https://www.bricklink.com/PL/60808.jpg",
      quantity: 4,
      price: 0.45,
      partType: "Transparent Elements",
      weight: "0.9g",
      color: "Transparent",
    },
  ],
  specialParts: [
    {
      id: "6005",
      name: "Arch 1x3x2",
      image: "https://www.bricklink.com/PL/6005.jpg",
      quantity: 2,
      price: 0.65,
      partType: "Architectural Elements",
      weight: "1.1g",
      color: "Dark Gray",
    },
  ],
  technicParts: [
    {
      id: "32073",
      name: "Technic Axle 5",
      image: "https://www.bricklink.com/PL/32073.jpg",
      quantity: 4,
      price: 0.2,
      partType: "Axles",
      weight: "0.7g",
      color: "Gray",
    },
    {
      id: "3713",
      name: "Technic Bush",
      image: "https://www.bricklink.com/PL/3713.jpg",
      quantity: 8,
      price: 0.15,
      partType: "Connectors",
      weight: "0.3g",
      color: "Black",
    },
  ],
  wheels: [
    {
      id: "55982",
      name: "Wheel 30.4x14",
      image: "https://www.bricklink.com/PL/55982.jpg",
      quantity: 4,
      price: 1.2,
      partType: "Vehicle Parts",
      weight: "2.5g",
      color: "Black",
    },
  ],
  minifigures: [
    {
      id: "min001",
      name: "Astronaut Minifigure",
      image:
        "https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/6373274.jpg",
      quantity: 1,
      price: 4.99,
      partType: "Complete Figure",
      weight: "3.0g",
      color: "White",
    },
    {
      id: "min002",
      name: "Wizard Minifigure",
      image:
        "https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/6448079.jpg",
      quantity: 1,
      price: 5.99,
      partType: "Complete Figure",
      weight: "3.0g",
      color: "Purple",
    },
  ],
};

export const lotteryData = [
  {
    id: "cozy-house",
    name: "Cozy House",
    description:
      "A charming winter cabin with detailed interior and exterior features. Perfect for display or play.",
    whyCollect: [
      "Exclusive winter-themed design with unique snow-covered elements",
      "Detailed interior furnishings add display value",
      "Perfect starter set for architectural collections",
    ],
    price: 10.99,
    marketPrice: 99,
    drawDate: "June 10, 2025",
    drawTime: "3:00 PM EST",
    totalSlots: 50,
    slotsAvailable: 5,
    image:
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/74eb261c-f265-4c3d-910e-084f4240b9ed.__CR0,0,970,600_PT0_SX970_V1___.jpg",
    features: [FEATURES.FEATURED],
    pieces: 350,
    theme: THEMES.WINTER_CABIN,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      bricks: commonParts.bricks,
      windows: commonParts.windows,
      accessories: [commonParts.accessories[0]],
    },
  },
  {
    id: "hogwarts-castle",
    name: "Hogwarts Castle",
    description:
      "Detailed microscale model of the iconic Hogwarts School of Witchcraft and Wizardry.",
    whyCollect: [
      "Authentic recreation of the iconic wizarding school",
      "Includes rare wizard minifigures and magical accessories",
      "Highly detailed architectural elements from the Harry Potter series",
    ],
    price: 2.99,
    marketPrice: 429,
    drawDate: "June 11, 2025",
    drawTime: "2:00 PM EST",
    totalSlots: 100,
    slotsAvailable: 25,
    image:
      "https://buildamoc.com/cdn/shop/products/bZI9Ov4oaJ.jpg?v=1653507186&width=2048",
    features: [FEATURES.FEATURED],
    pieces: 6020,
    theme: THEMES.HARRY_POTTER,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      bricks: commonParts.bricks,
      windows: commonParts.windows,
      minifigures: [commonParts.minifigures[1]],
      accessories: commonParts.accessories,
    },
  },
  {
    id: "lego-titanic",
    name: "LEGO Titanic",
    description:
      "Authentic 1:200 scale model of the ill-fated ocean liner with incredible interior details.",
    whyCollect: [
      "Detailed recreation of the iconic Titanic",
      "Includes rare minifigures and authentic ship details",
      "Perfect for maritime history enthusiasts",
    ],
    price: 3.5,
    marketPrice: 679,
    drawDate: "June 12, 2025",
    drawTime: "4:30 PM EST",
    totalSlots: 120,
    slotsAvailable: 40,
    image:
      "https://m.media-amazon.com/images/I/61l9pB4kA+L._AC_UF1000,1000_QL80_.jpg",
    features: [FEATURES.LIMITED_EDITION],
    pieces: 9090,
    theme: THEMES.ICONS,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      plates: commonParts.plates,
      bricks: commonParts.bricks,
      windows: commonParts.windows,
      specialParts: commonParts.specialParts,
    },
  },
  {
    id: "roman-colosseum",
    name: "Roman Colosseum",
    description:
      "Recreate the mighty Colosseum with this detailed architectural model.",
    whyCollect: [
      "Detailed recreation of the iconic Colosseum",
      "Includes rare architectural elements and historical details",
      "Perfect for ancient history enthusiasts",
    ],
    price: 2.5,
    marketPrice: 549,
    drawDate: "June 13, 2025",
    drawTime: "1:00 PM EST",
    totalSlots: 80,
    slotsAvailable: 15,
    image:
      "https://m.media-amazon.com/images/I/71fIlRTYRZL._AC_UF894,1000_QL80_.jpg",
    features: [FEATURES.BEST_SELLER],
    pieces: 9036,
    theme: THEMES.ARCHITECTURE,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      bricks: commonParts.bricks,
      plates: commonParts.plates,
      specialParts: commonParts.specialParts,
    },
  },
  {
    id: "eiffel-tower",
    name: "Eiffel Tower",
    description:
      "Build the iconic Parisian landmark in stunning detail with this towering set.",
    whyCollect: [
      "Stunning architectural masterpiece with intricate details",
      "Includes rare minifigures and iconic Parisian elements",
      "Perfect for cityscape enthusiasts",
    ],
    price: 3.99,
    marketPrice: 629,
    drawDate: "June 14, 2025",
    drawTime: "5:00 PM EST",
    totalSlots: 90,
    slotsAvailable: 30,
    image: "https://m.media-amazon.com/images/I/717Ph4gd2tL._AC_SL1500_.jpg",
    features: [FEATURES.NEW_ARRIVAL],
    pieces: 10001,
    theme: THEMES.ICONS,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      bricks: commonParts.bricks,
      plates: commonParts.plates,
      technicParts: commonParts.technicParts,
    },
  },
  {
    id: "super-mario-bowsers-castle",
    name: "Super Mario Bowser's Castle",
    description:
      "Enter the world of Super Mario with this detailed recreation of Bowser's Castle.",
    whyCollect: [
      "Limited edition collectors item with rare pieces",
      "Interactive play features and moving elements",
      "Exclusive Bowser and character minifigures included",
    ],
    price: 5.99,
    marketPrice: 399,
    drawDate: "June 15, 2025",
    drawTime: "2:30 PM EST",
    totalSlots: 75,
    slotsAvailable: 20,
    image:
      "https://www.toysrus.ca/dw/image/v2/BDFX_PRD/on/demandware.static/-/Sites-toys-master-catalog/default/dwc36baea1/images/4466280B_7.jpg?sw=767&sh=767&sm=fit",
    features: [FEATURES.FEATURED],
    pieces: 2807,
    theme: THEMES.SUPER_MARIO,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      bricks: commonParts.bricks,
      specialParts: commonParts.specialParts,
    },
  },
  {
    id: "technic-bugatti-chiron",
    name: "Technic Bugatti Chiron",
    description:
      "Advanced building set featuring the iconic supercar with working mechanics.",
    whyCollect: [
      "Highly detailed supercar model with working mechanics",
      "Includes rare minifigures and authentic car details",
      "Perfect for car enthusiasts",
    ],
    price: 2.99,
    marketPrice: 349,
    drawDate: "June 16, 2025",
    drawTime: "3:30 PM EST",
    totalSlots: 60,
    slotsAvailable: 18,
    image:
      "https://preview.redd.it/q59d3x5n0gf41.jpg?width=1080&crop=smart&auto=webp&s=d6f74fbe7a55246b29c104fcb6f2086232298818",
    features: [],
    pieces: 3599,
    theme: THEMES.TECHNIC,
    dateAdded: "2025-05-15",
    parts: {
      technicParts: commonParts.technicParts,
      wheels: commonParts.wheels,
      specialParts: commonParts.specialParts,
    },
  },
  {
    id: "nasa-space-shuttle",
    name: "NASA Space Shuttle Discovery",
    description:
      "Authentic replica of the NASA Space Shuttle Discovery with Hubble Space Telescope.",
    whyCollect: [
      "Detailed recreation of the iconic Space Shuttle",
      "Includes rare astronaut minifigure and space exploration details",
      "Perfect for space enthusiasts",
    ],
    price: 6.99,
    marketPrice: 199,
    drawDate: "June 17, 2025",
    drawTime: "12:00 PM EST",
    totalSlots: 40,
    slotsAvailable: 12,
    image: "https://m.media-amazon.com/images/I/81sRq4NIg-L._AC_SL1500_.jpg",
    features: [],
    pieces: 2354,
    theme: THEMES.NASA,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      technicParts: commonParts.technicParts,
      specialParts: commonParts.specialParts,
      minifigures: [commonParts.minifigures[0]],
    },
  },
  {
    id: "ninjago-city",
    name: "NINJAGO City Gardens",
    description:
      "Celebrate 10 years of NINJAGO with this detailed modular city set.",
    whyCollect: [
      "Celebrate 10 years of NINJAGO with this detailed modular city set.",
      "Includes rare ninja minifigures and unique city elements",
      "Perfect for NINJAGO enthusiasts",
    ],
    price: 3.99,
    marketPrice: 299,
    drawDate: "June 18, 2025",
    drawTime: "4:00 PM EST",
    totalSlots: 70,
    slotsAvailable: 35,
    image:
      "https://i5.walmartimages.com/asr/17e6ea0b-3cb7-461e-bb1f-1bcf3f1e93c4.170f600a5d45d2bb0a7777688e73b8a6.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
    features: [],
    pieces: 5685,
    theme: THEMES.NINJAGO,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      windows: commonParts.windows,
      bricks: commonParts.bricks,
      plates: commonParts.plates,
    },
  },
  {
    id: "disney-castle",
    name: "Disney Castle",
    description:
      "Magical Disney Castle inspired by Walt Disney World's Cinderella Castle.",
    whyCollect: [
      "Magical Disney Castle inspired by Walt Disney World's Cinderella Castle.",
      "Includes rare Disney minifigures and iconic castle details",
      "Perfect for Disney enthusiasts",
    ],
    price: 4.99,
    marketPrice: 399,
    drawDate: "June 19, 2025",
    drawTime: "3:00 PM EST",
    totalSlots: 85,
    slotsAvailable: 25,
    image:
      "https://i.redd.it/i-built-disneylands-sleeping-beauty-castle-in-lego-v0-383rlgg5ttdc1.jpg?width=2964&format=pjpg&auto=webp&s=67669e51675b6a653228eed1bda6a0cd23b99236",
    features: [],
    pieces: 4080,
    theme: THEMES.DISNEY,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      windows: commonParts.windows,
      bricks: commonParts.bricks,
      specialParts: commonParts.specialParts,
    },
  },
  {
    id: "ghostbusters-ecto-1",
    name: "Ghostbusters ECTO-1",
    description:
      "Detailed recreation of the iconic ghost-hunting vehicle from the Ghostbusters movies.",
    whyCollect: [
      "Detailed recreation of the iconic ghost-hunting vehicle from the Ghostbusters movies.",
      "Includes rare ghostbusters minifigures and iconic vehicle details",
      "Perfect for ghostbusters enthusiasts",
    ],
    price: 2.99,
    marketPrice: 199,
    drawDate: "June 20, 2025",
    drawTime: "2:00 PM EST",
    totalSlots: 45,
    slotsAvailable: 15,
    image:
      "https://www.elyswimbledon.co.uk/cdn/shop/files/lego-lego-ghostbuster-ecto-1-28519702462549_1600x.jpg?v=1697464799",
    features: [],
    pieces: 2352,
    theme: THEMES.GHOSTBUSTERS,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      technicParts: commonParts.technicParts,
      wheels: commonParts.wheels,
      specialParts: commonParts.specialParts,
    },
  },
  {
    id: "ideas-tree-house",
    name: "Ideas Treehouse",
    description:
      "Sustainable treehouse set with interchangeable summer and autumn leaves.",
    whyCollect: [
      "Sustainable treehouse set with interchangeable summer and autumn leaves.",
      "Includes rare treehouse minifigures and unique treehouse details",
      "Perfect for treehouse enthusiasts",
    ],
    price: 2.99,
    marketPrice: 199,
    drawDate: "June 21, 2025",
    drawTime: "1:30 PM EST",
    totalSlots: 50,
    slotsAvailable: 20,
    image: "https://i.ebayimg.com/images/g/KEEAAOSwEKVfkGVM/s-l1200.jpg",
    features: [],
    pieces: 3036,
    theme: THEMES.IDEAS,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      bricks: commonParts.bricks,
      plates: commonParts.plates,
      specialParts: commonParts.specialParts,
    },
  },
  {
    id: "creator-expert-bookshop",
    name: "Creator Expert Bookshop",
    description:
      "Modular building featuring a quaint bookshop and adjoining townhouse.",
    whyCollect: [
      "Modular building featuring a quaint bookshop and adjoining townhouse.",
      "Includes rare bookshop minifigures and unique bookshop details",
      "Perfect for bookshop enthusiasts",
    ],
    price: 3.99,
    marketPrice: 179,
    drawDate: "June 22, 2025",
    drawTime: "3:30 PM EST",
    totalSlots: 55,
    slotsAvailable: 22,
    image:
      "https://www.brickfanatics.com/wp-content/uploads/LEGO-Creator-Expert-10270-Bookshop-featured-3.jpg",
    features: [],
    pieces: 2504,
    theme: THEMES.CREATOR_EXPERT,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      windows: commonParts.windows,
      bricks: commonParts.bricks,
      plates: commonParts.plates,
    },
  },
  {
    id: "botanical-collection-orchid",
    name: "Botanical Collection Orchid",
    description:
      "Elegant orchid plant that never needs watering, perfect for home decor.",
    whyCollect: [
      "Elegant orchid plant that never needs watering, perfect for home decor.",
      "Includes rare orchid minifigures and unique orchid details",
      "Perfect for orchid enthusiasts",
    ],
    price: 4.99,
    marketPrice: 49,
    drawDate: "June 23, 2025",
    drawTime: "12:30 PM EST",
    totalSlots: 30,
    slotsAvailable: 8,
    image:
      "https://jaysbrickblog.com/wp-content/uploads/2022/04/LEGO-10311-Orchid-Wood-Background.jpg",
    features: [],
    pieces: 608,
    theme: THEMES.BOTANICAL,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      specialParts: commonParts.specialParts,
      plates: commonParts.plates,
    },
  },
  {
    id: "marvel-sanctum-sanctorum",
    name: "Marvel Sanctum Sanctorum",
    description:
      "Doctor Strange's magical headquarters with scenes from the Marvel movies.",
    whyCollect: [
      "Doctor Strange's magical headquarters with scenes from the Marvel movies.",
      "Includes rare Marvel minifigures and unique headquarters details",
      "Perfect for Marvel enthusiasts",
    ],
    price: 3.99,
    marketPrice: 249,
    drawDate: "June 24, 2025",
    drawTime: "2:30 PM EST",
    totalSlots: 65,
    slotsAvailable: 30,
    image:
      "https://res.cloudinary.com/dhpccjumk/image/upload/v1745980327/udyolsazsphmdiggrx1c.jpg",
    features: [],
    pieces: 2708,
    theme: THEMES.MARVEL,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      windows: commonParts.windows,
      bricks: commonParts.bricks,
      specialParts: commonParts.specialParts,
    },
  },
  {
    id: "marvel-iron-man-lab",
    name: "Marvel Iron Man Lab",
    description:
      "Tony Stark's high-tech lab filled with iconic suits and gear from Iron Man's legacy.",
    whyCollect: [
      "Tony Stark's high-tech lab filled with iconic suits and gear from Iron Man's legacy.",
      "Includes rare Iron Man minifigures and unique lab details",
      "Perfect for Iron Man enthusiasts",
    ],
    price: 4.49,
    marketPrice: 299,
    drawDate: "June 25, 2025",
    drawTime: "4:00 PM EST",
    totalSlots: 70,
    slotsAvailable: 28,
    image:
      "https://ideascdn.lego.com/media/generate/entity/lego_ci/project/47f0bfe1-2f95-403b-bcb3-d169da5d866a/1/resize:1600:900/legacy",
    features: [FEATURES.FEATURED],
    pieces: 3210,
    theme: THEMES.MARVEL,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      technicParts: commonParts.technicParts,
      specialParts: commonParts.specialParts,
      plates: commonParts.plates,
    },
  },
  {
    id: "marvel-wakanda-throne-room",
    name: "Marvel Wakanda Throne Room",
    description:
      "Recreate the royal heart of Wakanda with T'Challa, Shuri, and Dora Milaje.",
    whyCollect: [
      "Recreate the royal heart of Wakanda with T'Challa, Shuri, and Dora Milaje.",
      "Includes rare Marvel minifigures and unique throne room details",
      "Perfect for Marvel enthusiasts",
    ],
    price: 3.75,
    marketPrice: 215,
    drawDate: "June 26, 2025",
    drawTime: "1:00 PM EST",
    totalSlots: 60,
    slotsAvailable: 25,
    image:
      "https://bricksfanz.com/wp-content/uploads/2022/09/76213-King-Namors-Throne-Room.jpg",
    features: [],
    pieces: 1987,
    theme: THEMES.MARVEL,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      specialParts: commonParts.specialParts,
      accessories: commonParts.accessories,
    },
  },
  {
    id: "marvel-avengers-tower",
    name: "Marvel Avengers Tower",
    description:
      "The iconic Avengers HQ filled with action scenes and legendary heroes.",
    whyCollect: [
      "The iconic Avengers HQ filled with action scenes and legendary heroes.",
      "Includes rare Avengers minifigures and unique tower details",
      "Perfect for Avengers enthusiasts",
    ],
    price: 5.25,
    marketPrice: 399,
    drawDate: "June 27, 2025",
    drawTime: "2:00 PM EST",
    totalSlots: 80,
    slotsAvailable: 35,
    image:
      "https://9to5toys.com/wp-content/uploads/sites/5/2023/10/LEGO-Avengers-Tower.jpg?w=1024",
    features: [FEATURES.FEATURED],
    pieces: 3985,
    theme: THEMES.MARVEL,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      doors: commonParts.doors,
      windows: commonParts.windows,
      bricks: commonParts.bricks,
      technicParts: commonParts.technicParts,
    },
  },
  {
    id: "marvel-guardians-ship",
    name: "Marvel Guardians' Ship",
    description:
      "Join Star-Lord and the Guardians of the Galaxy on their interstellar adventures.",
    whyCollect: [
      "Join Star-Lord and the Guardians of the Galaxy on their interstellar adventures.",
      "Includes rare Guardians of the Galaxy minifigures and unique ship details",
      "Perfect for Guardians of the Galaxy enthusiasts",
    ],
    price: 3.49,
    marketPrice: 231,
    drawDate: "June 28, 2025",
    drawTime: "5:30 PM EST",
    totalSlots: 55,
    slotsAvailable: 20,
    image: "https://i.ebayimg.com/images/g/qBcAAOSw52li6~g0/s-l1200.jpg",
    features: [],
    pieces: 2520,
    theme: THEMES.MARVEL,
    dateAdded: "2025-05-15",
    parts: {
      tiles: commonParts.tiles,
      technicParts: commonParts.technicParts,
      specialParts: commonParts.specialParts,
      wheels: commonParts.wheels,
    },
  },
];
