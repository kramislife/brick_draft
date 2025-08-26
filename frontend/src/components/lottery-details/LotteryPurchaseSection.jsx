import React from "react";
import { Plus, Minus, Gift, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLotteryPurchase } from "@/hooks/useLottery";

const LotteryPurchaseSection = ({
  lotteryId,
  price,
  quantity,
  setQuantity,
  userEmail,
  lottery_status,
  lotteryName,
}) => {
  const {
    isLoading,
    selectedDelivery,
    isLotteryActive,
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
  });

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

      {/* Purchase Section - Only show if lottery is not active */}
      {!isLotteryActive && (
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
            <div className="flex items-center justify-between">
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
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${total}
                </span>
              </div>
            </div>

            {/* Buy Button */}
            <Button
              onClick={handleBuyTicket}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? "Processing..." : "Buy Ticket"}
            </Button>
          </div>
        </Card>
      )}

      {/* How it works section */}
      <div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground dark:text-accent">
            How it works:
          </span>{" "}
          Each ticket gives you a chance to win a random piece from the{" "}
          <span className="font-medium text-accent">{lotteryName}</span> set.
          Some pieces are rarer than others! Collect all pieces to complete your
          dream collection. Start your collection today!
        </p>
      </div>
    </div>
  );
};

export default LotteryPurchaseSection;
