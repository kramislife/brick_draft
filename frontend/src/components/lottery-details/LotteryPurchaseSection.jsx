import React, { useState } from "react";
import { Plus, Minus, Gift, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCreateCheckoutSessionMutation } from "@/redux/api/paymentApi";

const LotteryPurchaseSection = ({
  set,
  quantity,
  setQuantity,
  paymentMethod,
  userEmail,
  deliveryMethod,
  lottery_status,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [selectedDelivery, setSelectedDelivery] = useState("delivery");

  // Check if lottery is live or completed
  const isLotteryActive =
    lottery_status === "live" || lottery_status === "completed";
  const isLotteryLive = lottery_status === "live";
  const isLotteryCompleted = lottery_status === "completed";

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleBuyTicket = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession({
        lotteryId: set.id,
        quantity,
        email: userEmail,
        delivery_method: selectedDelivery,
      }).unwrap();

      if (result.url) {
        // Open Stripe in a new tab
        const stripeWindow = window.open(
          result.url,
          "_blank",
          "noopener,noreferrer"
        );
        // Poll to check if the tab is closed
        const pollTimer = setInterval(() => {
          if (stripeWindow.closed) {
            clearInterval(pollTimer);
            // Redirect to the success page using the URL-friendly set name from backend
            window.location.href = `/ticket-success/${result.urlFriendlySetName}/${result.purchase_id}`;
          }
        }, 500);
      } else {
        toast.error(result.message || "Failed to create checkout session");
      }
    } catch (err) {
      toast.error(err.data?.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const total = (set.price * quantity).toFixed(2);

  return (
    <div className="space-y-5">
      {/* Status Message - Show when lottery is active */}
      {isLotteryActive && (
        <div className="text-center p-6 bg-muted/50 rounded-lg border">
          {isLotteryLive ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-orange-600">
                Lottery is Live!
              </h3>
              <p className="text-sm text-orange-600/80">
                This lottery is currently live! You can watch the draft in
                progress, but ticket sales have ended.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-green-600">
                Lottery Completed
              </h3>
              <p className="text-sm text-green-600/80">
                This lottery has been completed. Check the results to see the
                winners!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Purchase UI - Only show when lottery is upcoming */}
      {!isLotteryActive && (
        <>
          {/* Price Card */}
          <Card className="dark:border-none shadow-md overflow-hidden p-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-emerald-500">
                    ${set.price.toFixed(2)}
                  </span>
                  <span className="ml-2">per ticket</span>
                </div>

                <Ticket className="h-5 w-5 text-emerald-500" />
              </div>

              {/* Quantity Selection and Total */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-3">Quantity:</span>
                    <div className="flex items-center">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-12 text-center font-bold text-emerald-500">
                        {quantity}
                      </div>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleIncrement}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center bg-muted-foreground/10 rounded-lg px-4 py-2">
                    <span className="text-emerald-500 mr-2">Total:</span>
                    <span className="text-2xl font-bold text-emerald-500">
                      ${total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Method Selection */}
          <Tabs value={selectedDelivery} onValueChange={setSelectedDelivery}>
            <TabsList className="w-full grid grid-cols-2 h-10">
              {deliveryMethod.map((method) => (
                <TabsTrigger
                  key={method.value}
                  value={method.value}
                  className="flex items-center justify-center gap-2 h-8 dark:data-[state=active]:bg-accent"
                >
                  <span>{method.icon}</span>
                  {method.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Payment Options */}
          <Tabs defaultValue="credit-card">
            <TabsList className="w-full grid grid-cols-2 h-10">
              {paymentMethod.map((method) => (
                <TabsTrigger
                  key={method.type}
                  value={method.type}
                  className="flex items-center justify-center gap-2 h-8 dark:data-[state=active]:bg-accent"
                >
                  {method.content.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.src}
                      alt={image.alt}
                      className={image.className}
                    />
                  ))}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent
              value="paypal"
              className="mt-4 bg-white dark:bg-slate-800/50 p-5 rounded-lg shadow-sm"
            >
              <div className="text-center py-6 flex flex-col items-center gap-4">
                <p className="text-muted-foreground">
                  You'll be redirected to PayPal to complete your purchase
                  securely.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Purchase Button */}
          <Button
            variant="accent"
            className="w-full"
            onClick={handleBuyTicket}
            isLoading={isLoading}
            disabled={isLoading}
          >
            <Gift className="w-5 h-5" />
            {isLoading
              ? "Redirecting to Stripe..."
              : `Buy ${quantity > 1 ? `${quantity} Tickets` : "Ticket"} Now`}
          </Button>
        </>
      )}

      {/* How it works section */}
      <div className="border-t pt-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground dark:text-accent">
            How it works:
          </span>{" "}
          Each ticket gives you a chance to win a random piece from the{" "}
          <span className="font-medium text-accent">{set.name}</span> set. Some
          pieces are rarer than others! Collect all pieces to complete your
          dream collection. Start your collection today!
        </p>
      </div>
    </div>
  );
};

export default LotteryPurchaseSection;
