import React from "react";
import { CreditCard, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PaymentSummary = ({ summary, copyToClipboard, copied }) => {
  const rows = [
    {
      label: "Payment Method",
      value: summary.payment_method || "NA",
      isCurrency: false,
      capitalize: true,
      borderBottom: true,
    },
    {
      label: "Ticket Price",
      value: summary.ticket_price,
      isCurrency: true,
    },
    {
      label: "Quantity",
      value: summary.quantity,
    },
    {
      label: "Subtotal",
      value: summary.subtotal,
      isCurrency: true,
      borderBottom: true,
    },
    {
      label: "Shipping Fee",
      value: summary.shipping_fee,
      isCurrency: true,
    },
    {
      label: "Tax",
      value: summary.tax,
      isCurrency: true,
      borderBottom: true,
    },
  ];

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Payment Details</h3>
        </div>

        {/* Payment Reference */}
        <div className="pb-5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Payment Reference
          </Label>
          <div className="flex items-center gap-2">
            <div className="font-mono text-sm bg-muted rounded-lg p-2 flex-1">
              {summary.payment_reference}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(summary.payment_reference)}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Summary Rows */}
        <div className="space-y-5">
          {rows.map((row, index) => (
            <div
              key={index}
              className={`flex justify-between items-center ${
                row.borderBottom ? "border-b pb-2" : ""
              }`}
            >
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {row.label}
              </Label>
              <span className="font-semibold">
                {row.isCurrency
                  ? `$${Number(row.value).toFixed(2)}`
                  : row.capitalize
                  ? String(row.value).charAt(0).toUpperCase() +
                    String(row.value).slice(1)
                  : row.value}
              </span>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between items-center">
            <Label className="font-bold uppercase tracking-wide">Total</Label>
            <span className="font-bold text-emerald-500 text-lg">
              ${summary.total.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
