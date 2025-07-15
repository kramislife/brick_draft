import Stripe from "stripe";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Lottery from "../models/lottery.model.js";
import Ticket from "../models/ticket.model.js";
import { generate_id } from "../utills/generate_id.js";

// ===================== STRIPE CONFIGURATION ========================
const STRIPE = new Stripe(process.env.STRIPE_SECRET_KEY);

const SHIPPING_OPTIONS = [
  {
    shipping_rate_data: {
      type: "fixed_amount",
      fixed_amount: { amount: 0, currency: "usd" },
      display_name: "Free shipping",
      delivery_estimate: {
        minimum: { unit: "business_day", value: 5 },
        maximum: { unit: "business_day", value: 7 },
      },
    },
  },
  {
    shipping_rate_data: {
      type: "fixed_amount",
      fixed_amount: { amount: 500, currency: "usd" }, // $5.00
      display_name: "Express shipping",
      delivery_estimate: {
        minimum: { unit: "business_day", value: 1 },
        maximum: { unit: "business_day", value: 1 },
      },
    },
  },
];

// ===================== UTILITY FUNCTIONS ========================

// Date and time formatting utilities
const formatDate = (dateString, options = {}) => {
  if (!dateString) return options.defaultValue || "TBD";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      ...options,
    });
  } catch {
    return options.defaultValue || "TBD";
  }
};

const formatTime = (timeString, options = {}) => {
  if (!timeString) return options.defaultValue || "TBD";
  try {
    const [h, m] = timeString.split(":");
    const date = new Date();
    date.setHours(h, m);
    return (
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        ...options,
      }) + " EST"
    );
  } catch {
    return options.defaultValue || "TBD";
  }
};

// String manipulation utilities
const createUrlFriendlySetName = (title) => {
  return title
    .replace(/[^a-zA-Z0-9\s-&]/g, "") // Remove special characters except spaces, hyphens, &
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .toLowerCase()
    .trim();
};

// ID generation utilities
const generateTicketIds = (quantity) => {
  return Array.from({ length: quantity }, () => generate_id("TICKET"));
};

// Stripe session utilities
const findStripeSession = async (purchaseId) => {
  const sessions = await STRIPE.checkout.sessions.list({ limit: 100 });
  return sessions.data.find(
    (s) => s.metadata && s.metadata.purchaseId === purchaseId
  );
};

const validatePaymentSession = (session, purchaseId) => {
  if (!session) {
    throw new Error("Purchase not found");
  }
  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }
  return session;
};

// Fee calculation utilities
const calculateFees = (session, quantity) => {
  const getIndividualFee = (amount) => (amount ? amount / quantity / 100 : 0);

  const individualShippingFee = getIndividualFee(
    session.total_details?.amount_shipping
  );
  const individualTax = getIndividualFee(session.total_details?.amount_tax);

  return {
    shippingFee: individualShippingFee * quantity,
    tax: individualTax * quantity,
  };
};

// Address utilities
const createShippingAddress = (session) => {
  if (!session.customer_details?.address) return null;

  return {
    ...session.customer_details.address,
    name: session.customer_details.name,
  };
};

// ===================== DATA TRANSFORMATION FUNCTIONS ========================

// Lottery data transformation
const createLotteryResponse = (lottery) => ({
  title: lottery.title,
  description: lottery.description,
  image: lottery.image,
  drawDate: lottery.drawDate,
  drawTime: lottery.drawTime,
  formattedDrawDate: formatDate(lottery.drawDate),
  formattedDrawTime: formatTime(lottery.drawTime),
  pieces: lottery.pieces,
  set_name: lottery.title,
  slotsAvailable: lottery.slotsAvailable,
});

// Ticket data transformation
const createTicketData = (lottery, session, purchaseId, userId, quantity) => {
  const ticketIds = generateTicketIds(quantity);
  const { shippingFee, tax } = calculateFees(session, quantity);

  return {
    user_id: userId,
    lottery: {
      lottery_id: lottery._id,
      set_name: lottery.title,
    },
    ticket_id: ticketIds,
    ticket_price: lottery.ticketPrice,
    quantity: quantity,
    payment_method: "stripe",
    payment_status: session.payment_status || "paid",
    createdBy: userId,
    payment_reference: session.payment_intent,
    session_id: session.id,
    shipping_fee: shippingFee,
    tax: tax,
    total_amount: session.amount_total / 100,
    shipping_address: createShippingAddress(session),
    purchase_id: purchaseId,
  };
};

const transformTicketsForResponse = (ticketDoc) => {
  return ticketDoc.ticket_id.map((ticketId, index) => ({
    ticket_id: ticketId,
    ticket_number: index + 1,
    ticket_price: ticketDoc.ticket_price,
    total_amount: ticketDoc.total_amount / ticketDoc.ticket_id.length,
    payment_status: ticketDoc.payment_status,
    created_at: ticketDoc.createdAt,
  }));
};

// Purchase data transformation
const transformPurchaseForResponse = (ticket) => ({
  purchase_id: ticket.purchase_id,
  total_amount: ticket.total_amount,
  quantity: ticket.quantity,
  payment_status: ticket.payment_status,
  payment_method: ticket.payment_method,
  ticket_count: ticket.ticket_id.length,
  lottery: {
    title: ticket.lottery.lottery_id?.title || "Unknown Lottery",
    image: ticket.lottery.lottery_id?.image,
    pieces: ticket.lottery.lottery_id?.pieces || null,
    urlFriendlySetName: ticket.lottery.lottery_id?.title
      ? createUrlFriendlySetName(ticket.lottery.lottery_id.title)
      : "",
    formattedDrawDate: ticket.lottery.lottery_id?.drawDate
      ? formatDate(ticket.lottery.lottery_id.drawDate)
      : "TBD",
    formattedDrawTime: ticket.lottery.lottery_id?.drawTime
      ? formatTime(ticket.lottery.lottery_id.drawTime)
      : "TBD",
  },
  formattedPurchaseDate: formatDate(ticket.createdAt),
});

// ===================== DATABASE OPERATIONS ========================

// Lottery operations
const findLotteryById = async (lotteryId) => {
  const lottery = await Lottery.findById(lotteryId);
  if (!lottery) {
    throw new Error("Lottery not found");
  }
  return lottery;
};

const decrementLotterySlots = async (lotteryId) => {
  await Lottery.findByIdAndUpdate(lotteryId, {
    $inc: { slotsAvailable: -1 },
  });
};

// Ticket operations
const findTicketByPurchaseId = async (purchaseId) => {
  return await Ticket.findOne({ purchase_id: purchaseId }).populate(
    "lottery.lottery_id"
  );
};

const checkUserHasOtherTickets = async (
  userId,
  lotteryId,
  currentPurchaseId
) => {
  return await Ticket.exists({
    user_id: userId,
    "lottery.lottery_id": lotteryId,
    purchase_id: { $ne: currentPurchaseId },
  });
};

// ===================== CONTROLLER FUNCTIONS ========================

// Create Stripe checkout session
export const createCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    const { lotteryId, quantity = 1, email } = req.body;

    // Validate lottery exists
    const lottery = await findLotteryById(lotteryId);

    // Generate IDs and URLs
    const purchase_id = generate_id("PURCHASE");
    const urlFriendlySetName = createUrlFriendlySetName(lottery.title);

    // Create Stripe session
    const session = await STRIPE.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: lottery.title,
              images: [lottery.image?.url],
            },
            unit_amount: Math.round(lottery.ticketPrice * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/ticket-success/${urlFriendlySetName}/${purchase_id}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      shipping_address_collection: { allowed_countries: ["US"] },
      billing_address_collection: "required",
      customer_email: email || req.user.email,
      shipping_options: SHIPPING_OPTIONS,
      automatic_tax: { enabled: true },
      metadata: { lotteryId, purchaseId: purchase_id, quantity },
    });

    res.json({
      url: session.url,
      purchase_id,
      urlFriendlySetName,
    });
  }
);

// Get payment success details and create ticket if needed
export const getPaymentSuccessDetails = catchAsyncErrors(
  async (req, res, next) => {
    const { purchaseId } = req.params;

    // Validate purchase ID
    if (!purchaseId) {
      return res.status(400).json({
        message: "Missing purchase ID",
        customer_email: null,
        payment_status: null,
      });
    }

    // Find existing ticket or create new one
    let ticketDoc = await findTicketByPurchaseId(purchaseId);

    if (!ticketDoc) {
      // Create ticket from Stripe session
      const session = await findStripeSession(purchaseId);
      validatePaymentSession(session, purchaseId);

      const lottery = await findLotteryById(session.metadata.lotteryId);
      const quantity = Number(session.metadata.quantity) || 1;

      const ticketData = createTicketData(
        lottery,
        session,
        purchaseId,
        req.user.user_id,
        quantity
      );

      ticketDoc = await Ticket.create(ticketData);

      // Only decrement slots per user
      const userHasOtherTickets = await checkUserHasOtherTickets(
        req.user.user_id,
        lottery._id,
        purchaseId
      );

      if (!userHasOtherTickets) {
        await decrementLotterySlots(lottery._id);
      }

      // Populate lottery for response
      ticketDoc = await Ticket.findById(ticketDoc._id).populate(
        "lottery.lottery_id"
      );
    }

    // Get lottery details for response
    const lottery =
      ticketDoc.lottery?.lottery_id ||
      (await findLotteryById(ticketDoc.lottery.lottery_id));

    // Prepare response
    const response = {
      customer_email: ticketDoc.user_id?.email || "N/A",
      payment_status: ticketDoc.payment_status || null,
      amount_total: ticketDoc.total_amount * 100,
      payment_reference: ticketDoc.payment_reference,
      payment_method: ticketDoc.payment_method,
      tickets: transformTicketsForResponse(ticketDoc),
      ticket_count: ticketDoc.ticket_id.length,
      quantity: ticketDoc.quantity,
      shipping_address: ticketDoc.shipping_address,
      shipping_fee: ticketDoc.shipping_fee,
      tax: ticketDoc.tax,
      lottery: createLotteryResponse(lottery),
    };

    res.json(response);
  }
);

// Get user purchases
export const getUserPurchases = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user_id;

  // Find all tickets for the user
  const tickets = await Ticket.find({ user_id: userId })
    .populate("lottery.lottery_id")
    .sort({ createdAt: -1 });

  // Transform the data for frontend
  const purchases = tickets.map(transformPurchaseForResponse);

  res.status(200).json({
    success: true,
    message: `${purchases.length} purchases found`,
    purchases,
  });
});
