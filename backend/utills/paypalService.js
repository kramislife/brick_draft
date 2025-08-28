const getPaypalBaseUrl = () => {
  const url = process.env.PAYPAL_API_URL;
  if (!url) {
    throw new Error("PAYPAL_API_URL is not configured.");
  }
  return url;
};

const getAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
  const baseUrl = getPaypalBaseUrl();

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal client credentials are missing. Check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET."
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "Accept-Language": "en_US",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch (_) {}
    const maskedId = clientId
      ? `${String(clientId).slice(0, 6)}...${String(clientId).slice(-4)}`
      : "undefined";
    console.error(
      `PayPal OAuth failed (${res.status}). BaseURL=${baseUrl}, MODE=${
        process.env.PAYPAL_ENV || process.env.PAYPAL_MODE || "sandbox"
      }, CLIENT_ID=${maskedId}`
    );
    throw new Error(`PayPal OAuth failed: ${res.status} ${detail}`);
  }
  const data = await res.json();
  return data.access_token;
};

// Build PayPal order request body
const buildOrderRequestBody = ({
  currency = "USD",
  totalAmount,
  itemTotal,
  shipping = 0,
  tax = 0,
  purchaseId,
  lottery,
  quantity,
  delivery_method = "delivery",
  email,
}) => {
  const breakdown = {
    item_total: {
      currency_code: currency,
      value: Number(itemTotal).toFixed(2),
    },
  };
  if (shipping > 0)
    breakdown.shipping = {
      currency_code: currency,
      value: Number(shipping).toFixed(2),
    };
  if (tax > 0)
    breakdown.tax_total = {
      currency_code: currency,
      value: Number(tax).toFixed(2),
    };

  const unit = {
    reference_id: String(lottery._id),
    custom_id: purchaseId,
    description: lottery.title,
    amount: {
      currency_code: currency,
      value: Number(totalAmount).toFixed(2),
      breakdown,
    },
    items: [
      {
        name: lottery.title,
        unit_amount: {
          currency_code: currency,
          value: Number(lottery.ticketPrice).toFixed(2),
        },
        quantity: String(quantity),
        category: "PHYSICAL_GOODS",
      },
    ],
  };

  const applicationContext = {
    brand_name: process.env.BRAND_NAME || "Brick Draft",
    user_action: "PAY_NOW",
  };

  // Only set shipping preference for delivery orders
  if (delivery_method === "delivery") {
    applicationContext.shipping_preference = "GET_FROM_FILE";
  }

  const body = {
    intent: "CAPTURE",
    purchase_units: [unit],
    application_context: applicationContext,
  };
  if (email) body.payer = { email_address: email };
  return body;
};

export const createPaypalOrder = async (params) => {
  const accessToken = await getAccessToken();
  const baseUrl = getPaypalBaseUrl();
  const body = buildOrderRequestBody(params);
  const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": params.purchaseId,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[PayPal] Create order failed:", res.status, text);
    throw new Error(`PayPal create order failed: ${res.status} ${text}`);
  }
  const result = await res.json();
  return { result };
};

export const capturePaypalOrder = async (orderId) => {
  const accessToken = await getAccessToken();
  const baseUrl = getPaypalBaseUrl();
  const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture failed: ${res.status} ${text}`);
  }
  const result = await res.json();
  return { result };
};

export const getPaypalOrder = async (orderId) => {
  const accessToken = await getAccessToken();
  const baseUrl = getPaypalBaseUrl();
  const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal get order failed: ${res.status} ${text}`);
  }
  const result = await res.json();
  return { result };
};

export default {
  createPaypalOrder,
  capturePaypalOrder,
  getPaypalOrder,
};
