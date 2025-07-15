import crypto from "crypto";

export const generate_id = (prefix) => {
  const prefixMap = {
    USER: "UID",
    LOTTERY: "LOT",
    PART: "PID",
    MINIFIG: "MID",
    LOTTERY_ROUND: "LRD",
    TICKET: "TKT",
    PURCHASE: "PUR",
  };

  const mappedPrefix = prefixMap[prefix];
  if (!mappedPrefix) {
    throw new Error(
      `Invalid prefix. Must be one of: ${Object.keys(prefixMap).join(", ")}`
    );
  }

  // Generate random alphanumeric string
  const generateRandomString = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  if (prefix === "TICKET") {
    // Format: TKT-XXX-XXX-XXX (e.g., TKT-84B-9KF-2M7) - longer format
    const random1 = generateRandomString(3);
    const random2 = generateRandomString(3);
    const random3 = generateRandomString(3);
    return `${mappedPrefix}-${random1}-${random2}-${random3}`;
  }

  if (prefix === "PURCHASE") {
    // Format: PUR-XXX-XXX-XXX-XXX (e.g., PUR-84B-9KF-2M7-X9Y2Z8) - even longer format
    const random1 = generateRandomString(3);
    const random2 = generateRandomString(3);
    const random3 = generateRandomString(3);
    const random4 = generateRandomString(6); // Additional 6 characters for extra uniqueness
    return `${mappedPrefix}-${random1}-${random2}-${random3}-${random4}`;
  }

  // For other prefixes, keep the existing timestamp-based format
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");

  const timestamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");

  const random1 = crypto.randomBytes(2).toString("hex").toUpperCase(); // 4-char hex
  return `${mappedPrefix}-${timestamp}-${random1}`;
};
