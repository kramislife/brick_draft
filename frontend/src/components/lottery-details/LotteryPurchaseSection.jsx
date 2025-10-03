import React from "react";
import { Plus, Minus, Gift, Ticket, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StripeLogo from "@/assets/images/stripe.svg";
import { useLotteryPurchase, usePayPalCheckout } from "@/hooks/useLottery";

const LotteryPurchaseSection = ({
  lotteryId,
  price,
  quantity,
  setQuantity,
  userEmail,
  lottery_status,
  isTicketSalesClosed,
  lotteryName,
}) => {
  const {
    isLoading,
    selectedDelivery,

    isLotteryLive,
    total,
    handleDecrement,
    handleIncrement,
    handleBuyTicket,
    handleDeliveryChange,
  } = useLotteryPurchase({
    lotteryId,
    price,
    quantity,
    setQuantity,
    userEmail,
    lottery_status,
    isTicketSalesClosed,
  });
  const { paypalButtonsRef } = usePayPalCheckout({
    lotteryId,
    quantity,
    userEmail,
    selectedDelivery,
    lotteryName,
  });

  return (
    <div className="space-y-5">
      {/* Status Message - Show when ticket sales are closed or lottery is live */}
      {(isTicketSalesClosed || isLotteryLive) && (
        <div className="text-center p-6 bg-muted/50 rounded-lg border">
          {isLotteryLive ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-orange-600">
                Lottery is Live!
              </h3>
              <p className="text-sm text-orange-600/80">
                This lottery is currently live! You can watch the draft in
                progress.
              </p>
            </div>
          ) : isTicketSalesClosed ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-red-600 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                Ticket Sales Closed
              </h3>
              <p className="text-sm text-red-600/80">
                Ticket sales have closed for this lottery. The draw will begin
                soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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

      {/* Purchase Section - Only show if ticket sales are open and lottery is not live */}
      {!isTicketSalesClosed && !isLotteryLive && (
        <Card className="p-5">
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>
                <Button variant="outline" size="sm" onClick={handleIncrement}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Price per Ticket */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Price per ticket
              </span>
              <span className="font-semibold">${price}</span>
            </div>

            {/* Delivery Method */}
            {/* <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Delivery method
              </span>
              <Tabs
                value={selectedDelivery}
                onValueChange={handleDeliveryChange}
                className="w-auto"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="delivery" className="text-xs">
                    <Gift className="w-3 h-3 mr-1" />
                    Delivery
                  </TabsTrigger>
                  <TabsTrigger value="pickup" className="text-xs">
                    <Ticket className="w-3 h-3 mr-1" />
                    Pickup
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div> */}

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${total}
                </span>
              </div>
            </div>

            {/* Buy Buttons */}
            <div className="relative">
              <Button
                onClick={handleBuyTicket}
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 py-7 text-lg text-black font-bold rounded-sm relative z-10"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <img src={StripeLogo} alt="Stripe" className="h-10" />
                  </span>
                )}
              </Button>
              <div
                className="w-full mt-2 relative z-0"
                ref={paypalButtonsRef}
              />
            </div>
          </div>
        </Card>
      )}

      {/* How it works section */}
      <div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground dark:text-accent">
            How it works:
          </span>{" "}
          Each ticket gives you a chance to pick a 100% new and genuine LEGO
          piece from the{" "}
          <span className="font-medium text-accent">{lotteryName}</span> set.
          Some pieces are rarer than others! Collect all pieces to complete your
          dream collection. Start your collection today!
        </p>
      </div>
    </div>
  );
};

export default LotteryPurchaseSection;
