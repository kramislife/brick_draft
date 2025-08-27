import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";

const ShippingAddressCard = ({ shippingAddress, addressType }) => {
  if (addressType !== "shipping" || !shippingAddress) return null;

  const columns = [
    [
      { label: "Name", value: shippingAddress.name },
      { label: "City", value: shippingAddress.city || shippingAddress.admin_area_2 },
      { label: "State", value: shippingAddress.state || shippingAddress.admin_area_1 },
    ],
    [
      { label: "Country", value: shippingAddress.country || shippingAddress.country_code },
      { label: "Postal Code", value: shippingAddress.postal_code },
      {
        label: "Address",
        value:
          shippingAddress.address_line1 ||
          shippingAddress.address_line_1 +
            (shippingAddress.address_line2
              ? `, ${shippingAddress.address_line2 || shippingAddress.address_line_2}`
              : ""),
      },
    ],
  ];

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Shipping Address</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {columns.map((column, idx) => (
            <div className="space-y-5" key={idx}>
              {column.map(({ label, value }) => (
                <div key={label}>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                  </Label>
                  <div className="font-semibold">{value || "N/A"}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingAddressCard;
