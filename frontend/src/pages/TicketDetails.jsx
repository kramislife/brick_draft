import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Confetti from "react-confetti";
import { CheckCircle, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TicketDetailsCard from "@/components/ticket-details/TicketDetailsCard";
import ShippingAddressCard from "@/components/ticket-details/ShippingAddressCard";
import PaymentSummary from "@/components/ticket-details/PaymentSummary";
import TicketIdsGrid from "@/components/ticket-details/TicketIdsGrid";
import { useGetPaymentSuccessDetailsQuery } from "@/redux/api/paymentApi";

const TicketDetails = () => {
  const { purchaseId } = useParams();
  const [copied, setCopied] = useState(false);
  const [copiedTicketId, setCopiedTicketId] = useState(null);

  const copyToClipboard = async (text, type = "general") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "ticket") {
        setCopiedTicketId(text);
        setTimeout(() => setCopiedTicketId(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const {
    data,
    isLoading: loading,
    error,
  } = useGetPaymentSuccessDetailsQuery(purchaseId, {
    skip: !purchaseId,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted rounded-full mx-auto mb-5"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading your tickets...</h2>
            <p className="text-muted-foreground text-sm">
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-5">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Tickets Not Found
          </h2>
          <p className="text-muted-foreground mb-5">
            {error?.data?.message ||
              error?.message ||
              "The tickets you're looking for don't exist or you don't have permission to view them."}
          </p>
          <Link to="/">
            <Button variant="destructive" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { tickets, ticket_count, lottery } = data;
  const shippingAddress = {
    ...data.shipping_address,
    address_line1: data.shipping_address?.line1,
    address_line2: data.shipping_address?.line2,
  };
  const paymentSummary = {
    payment_reference: data.payment_reference,
    payment_method: data.payment_method,
    ticket_price: data.tickets?.[0]?.ticket_price || 0,
    quantity: data.quantity || 1,
    subtotal: (data.tickets?.[0]?.ticket_price || 0) * (data.quantity || 1),
    shipping_fee: data.shipping_fee || 0,
    tax: data.tax || 0,
    total: data.amount_total / 100 || 0,
  };

  return (
    <div className="min-h-screen px-5 py-10">
      <Confetti
        numberOfPieces={150}
        recycle={false}
        gravity={0.15}
        colors={["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"]}
      />

      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full mb-5">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-5">
          Payment Successful!
        </h1>
        <p className=" text-muted-foreground max-w-xl mx-auto">
          🎉 Congratulations! Your {ticket_count} lottery ticket
          {ticket_count > 1 ? "s have" : " has"} been confirmed. Good luck in
          the upcoming draw!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <TicketDetailsCard lottery={lottery} />
          <ShippingAddressCard shippingAddress={shippingAddress} />
        </div>
        <div className="lg:sticky lg:top-5 lg:self-start space-y-5">
          <TicketIdsGrid
            tickets={tickets}
            ticket_count={ticket_count}
            copyToClipboard={(id) => copyToClipboard(id, "ticket")}
            copiedTicketId={copiedTicketId}
          />
          <PaymentSummary
            summary={paymentSummary}
            copyToClipboard={copyToClipboard}
            copied={copied}
            setCopied={setCopied}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
