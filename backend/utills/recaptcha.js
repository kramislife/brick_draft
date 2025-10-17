export const verifyRecaptcha = async (token, secretKey, remoteIp = null) => {
  try {
    if (!token) {
      return {
        success: false,
        error: "reCAPTCHA token is required",
      };
    }

    if (!secretKey) {
      return {
        success: false,
        error: "reCAPTCHA secret key is required",
      };
    }

    // Prepare the verification request
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    // Add remote IP if provided
    if (remoteIp) {
      params.append("remoteip", remoteIp);
    }

    // Make the verification request
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    // Check if verification was successful
    if (data.success) {
      return {
        success: true,
        hostname: data.hostname || null,
      };
    } else {
      return {
        success: false,
        error: "reCAPTCHA verification failed",
        errorCodes: data["error-codes"] || [],
      };
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return {
      success: false,
      error: "Failed to verify reCAPTCHA token",
    };
  }
};

// Validate reCAPTCHA token for contact form
export const validateContactFormRecaptcha = async (token, remoteIp = null) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not configured");
    return {
      success: false,
      error: "reCAPTCHA is not properly configured",
    };
  }

  const result = await verifyRecaptcha(token, secretKey, remoteIp);

  if (!result.success) {
    return result;
  }

  return result;
};
