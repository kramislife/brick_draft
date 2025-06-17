import crypto from "crypto";

export const generate_id = (prefix) => {
  const prefixMap = {
    USER: "UID",
    LOTTERY: "LOT",
    PART: "PID",
    MINIFIG: "MID",
    LOTTERY_ROUND: "LRD",
  };

  const mappedPrefix = prefixMap[prefix];
  if (!mappedPrefix) {
    throw new Error(
      `Invalid prefix. Must be one of: ${Object.keys(prefixMap).join(", ")}`
    );
  }

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

  const random = crypto.randomBytes(2).toString("hex").toUpperCase(); // 4-char hex

  return `${mappedPrefix}-${timestamp}-${random}`;
};
