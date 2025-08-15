import Stripe from "stripe";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Lottery from "../models/lottery.model.js";
import Ticket from "../models/ticket.model.js";
import { generate_id } from "../utills/generate_id.js";

// ===================== STRIPE CONFIGURATION ========================
const STRIPE = new Stripe(process.env.STRIPE_SECRET_KEY);

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

//  Display lottery name in url
const createUrlFriendlySetName = (title) =>
  title
    .replace(/[^a-zA-Z0-9\s-&]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .trim();

// Generate ticket IDs (TKT-000-111-222)
const generateTicketIds = (quantity) =>
  Array.from({ length: quantity }, () => ({
    ticket_id: generate_id("TICKET"),
  }));

// Find stripe session by purchase ID
const findStripeSession = async (purchaseId) => {
  const sessions = await STRIPE.checkout.sessions.list({ limit: 100 });
  return sessions.data.find(
    (s) => s.metadata && s.metadata.purchaseId === purchaseId
  );
};

const validatePaymentSession = (session) => {
  if (!session) throw new Error("Purchase not found");
  if (session.payment_status !== "paid")
    throw new Error("Payment not completed");
  return session;
};

// Calculate shipping and tax fees
const calculateFees = (session, quantity) => {
  const getIndividualFee = (amount) => (amount ? amount / quantity / 100 : 0);
  return {
    shippingFee:
      getIndividualFee(session.total_details?.amount_shipping) * quantity,
    tax: getIndividualFee(session.total_details?.amount_tax) * quantity,
  };
};

// Create shipping address from stripe session
const createShippingAddress = (session) => {
  if (!session.customer_details?.address) return null;
  return {
    ...session.customer_details.address,
    name: session.customer_details.name,
  };
};

// ===================== DATA TRANSFORMATION ========================
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

// Create ticket data for database
const createTicketData = (lottery, session, purchaseId, userId, quantity) => {
  const ticketIds = generateTicketIds(quantity);
  const { shippingFee, tax } = calculateFees(session, quantity);
  const delivery_method = session.metadata?.delivery_method || "delivery";
  const address = createShippingAddress(session);
  const address_type = delivery_method === "delivery" ? "shipping" : "billing";
  return {
    user_id: userId,
    lottery: {
      lottery_id: lottery._id,
      set_name: lottery.title,
    },
    ticket_id: ticketIds,
    ticket_price: lottery.ticketPrice,
    quantity,
    payment_method: "stripe",
    payment_status: session.payment_status || "paid",
    createdBy: userId,
    payment_reference: session.payment_intent,
    session_id: session.id,
    shipping_fee: shippingFee,
    tax,
    total_amount: session.amount_total / 100,
    address,
    address_type,
    purchase_id: purchaseId,
  };
};

const transformTicketsForResponse = (ticketDoc) =>
  ticketDoc.ticket_id.map((ticketIdObj, index) => ({
    ticket_id: ticketIdObj.ticket_id,
    ticket_number: index + 1,
    ticket_price: ticketDoc.ticket_price,
    total_amount: ticketDoc.total_amount / ticketDoc.ticket_id.length,
    payment_status: ticketDoc.payment_status,
    created_at: ticketDoc.createdAt,
  }));

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
const findLotteryById = async (lotteryId) => {
  const lottery = await Lottery.findById(lotteryId);
  if (!lottery) throw new Error("Lottery not found");
  return lottery;
};

const decrementLotterySlots = async (lotteryId) => {
  await Lottery.findByIdAndUpdate(lotteryId, { $inc: { slotsAvailable: -1 } });
};

const findTicketByPurchaseId = async (purchaseId) =>
  Ticket.findOne({ purchase_id: purchaseId }).populate("lottery.lottery_id");

const checkUserHasOtherTickets = async (userId, lotteryId, currentPurchaseId) =>
  Ticket.exists({
    user_id: userId,
    "lottery.lottery_id": lotteryId,
    purchase_id: { $ne: currentPurchaseId },
  });

// ===================== CONTROLLER FUNCTIONS ========================
// Create Stripe checkout session
export const createCheckoutSession = catchAsyncErrors(async (req, res) => {
  const {
    lotteryId,
    quantity = 1,
    email,
    delivery_method = "delivery",
  } = req.body;
  const lottery = await findLotteryById(lotteryId);
  // Generate purchase ID (PUR-000-111-222) and URL
  const purchase_id = generate_id("PURCHASE");
  const urlFriendlySetName = createUrlFriendlySetName(lottery.title);
  // Calculate shipping amount ($8 for 1, +$2 for each additional)
  const shippingAmount = 800 + (Math.max(1, quantity) - 1) * 200;

  const sessionParams = {
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
    customer_email: email || req.user.email,
    automatic_tax: { enabled: true },
    metadata: {
      lotteryId,
      purchaseId: purchase_id,
      quantity,
      delivery_method,
    },
  };

  if (delivery_method === "delivery") {
    sessionParams.shipping_address_collection = { allowed_countries: ["US"] };
    sessionParams.shipping_options = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: shippingAmount, currency: "usd" },
          display_name: "Standard shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ];
  } else if (delivery_method === "pick-up") {
    sessionParams.shipping_options = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Pick-Up in Store",
        },
      },
    ];
  }

  const session = await STRIPE.checkout.sessions.create(sessionParams);
  res.json({ url: session.url, purchase_id, urlFriendlySetName });
});

// Get payment success details and create ticket if needed
export const getPaymentSuccessDetails = catchAsyncErrors(async (req, res) => {
  const { purchaseId } = req.params;
  if (!purchaseId) {
    return res.status(400).json({
      message: "Missing purchase ID",
      customer_email: null,
      payment_status: null,
    });
  }
  let ticketDoc = await findTicketByPurchaseId(purchaseId);
  if (!ticketDoc) {
    const session = await findStripeSession(purchaseId);
    validatePaymentSession(session);
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
    const userHasOtherTickets = await checkUserHasOtherTickets(
      req.user.user_id,
      lottery._id,
      purchaseId
    );
    if (!userHasOtherTickets) await decrementLotterySlots(lottery._id);
    ticketDoc = await Ticket.findById(ticketDoc._id).populate(
      "lottery.lottery_id"
    );
  }
  const lottery =
    ticketDoc.lottery?.lottery_id ||
    (await findLotteryById(ticketDoc.lottery.lottery_id));
  const response = {
    customer_email: ticketDoc.user_id?.email || "N/A",
    payment_status: ticketDoc.payment_status || null,
    address: ticketDoc.address,
    address_type: ticketDoc.address_type,
    amount_total: ticketDoc.total_amount * 100,
    payment_reference: ticketDoc.payment_reference,
    payment_method: ticketDoc.payment_method,
    tickets: transformTicketsForResponse(ticketDoc),
    ticket_count: ticketDoc.ticket_id.length,
    quantity: ticketDoc.quantity,
    shipping_fee: ticketDoc.shipping_fee,
    tax: ticketDoc.tax,
    lottery: createLotteryResponse(lottery),
  };
  res.json(response);
});

// Get user purchases
export const getUserPurchases = catchAsyncErrors(async (req, res) => {
  const userId = req.user.user_id;
  const tickets = await Ticket.find({ user_id: userId })
    .populate("lottery.lottery_id")
    .sort({ createdAt: -1 });
  const purchases = tickets.map(transformPurchaseForResponse);
  res.status(200).json({
    success: true,
    message: `${purchases.length} purchases found`,
    purchases,
  });
});

// Get all tickets
export const getAllTickets = catchAsyncErrors(async (req, res) => {
  const tickets = await Ticket.find()
    .populate("user_id", "name email")
    .populate(
      "lottery.lottery_id",
      "title drawDate drawTime formattedDrawDate formattedDrawTime image"
    )
    .sort({ createdAt: -1 });
  // Transform tickets for admin table
  const data = tickets.map((ticket) => {
    const lottery = ticket.lottery.lottery_id || {};
    return {
      purchase_id: ticket.purchase_id,
      lottery_set: lottery.title || "-",
      draw_date: lottery.formattedDrawDate || formatDate(lottery.drawDate),
      draw_time: lottery.formattedDrawTime || formatTime(lottery.drawTime),
      customer_name: ticket.user_id?.name || "-",
      customer_email: ticket.user_id?.email || "-",
      purchase_date: formatDate(ticket.createdAt),
      purchase_time: formatTime(ticket.createdAt),
      price: ticket.ticket_price,
      quantity: ticket.quantity,
      total_amount: ticket.total_amount,
      _raw: ticket, // for details view
    };
  });
  res.status(200).json({
    success: true,
    tickets: data,
  });
});
