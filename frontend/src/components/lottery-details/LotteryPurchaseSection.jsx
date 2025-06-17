import React from "react";
import { Plus, Minus, Gift, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LotteryPurchaseSection = ({
  set,
  quantity,
  setQuantity,
  paymentMethod,
}) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const total = (set.price * quantity).toFixed(2);

  return (
    <div className="space-y-5">
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

      {/* Payment Options */}
      <Tabs defaultValue="credit-card" className="w-full">
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
          value="credit-card"
          className="space-y-4 mt-4 bg-white dark:bg-slate-800/50 p-5 rounded-lg shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Card Number
            </label>
            <Input
              placeholder="1234 5678 9012 3456"
              className="w-full border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Expiry Date
              </label>
              <Input
                placeholder="MM/YY"
                className="w-full border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVC</label>
              <Input
                placeholder="123"
                className="w-full border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="paypal"
          className="mt-4 bg-white dark:bg-slate-800/50 p-5 rounded-lg shadow-sm"
        >
          <div className="text-center py-6 flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              You'll be redirected to PayPal to complete your purchase securely.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Purchase Button */}
      <Button variant="accent" className="w-full">
        <Gift className="w-5 h-5" />
        Buy {quantity > 1 ? `${quantity} Tickets` : "Ticket"} Now
      </Button>

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
