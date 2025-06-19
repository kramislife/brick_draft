import jwt from "jsonwebtoken";
// GENERATE ACCESS TOKEN

export const generateAccessToken = (
  payload,
  access_token_secret_key,
  token_expiry_time
) => {
  return jwt.sign(payload, access_token_secret_key, {
    expiresIn: `${token_expiry_time}h`, // hour
  });
};

// GENERATE COOKIES

export const generateCookies = (res, cookieName, token, maxAge) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "Strict",
    maxAge: maxAge,
  });
};

// CLEAR COOKIES
export const clearCookies = (res, cookieName) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "Strict",
  });
};
