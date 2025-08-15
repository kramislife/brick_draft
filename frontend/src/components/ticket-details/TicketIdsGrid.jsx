import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket as TicketIcon, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const TicketIdsGrid = ({
  tickets,
  ticket_count,
  copyToClipboard,
  copiedTicketId,
}) => {
  if (!tickets || tickets.length === 0) return null;
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <TicketIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">
            Your ticket{ticket_count > 1 ? "s" : ""} ({ticket_count})
          </h3>
        </div>
        <div className="space-y-3">
          {tickets.map((ticket, index) => (
            <div
              key={`ticket-${index}-${ticket.ticket_id || "unknown"}`}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold text-emerald-600">
                    {index + 1}
                  </span>
                </div>
                <span className="font-mono text-sm">
                  {typeof ticket.ticket_id === "string"
                    ? ticket.ticket_id
                    : ticket.ticket_id?.ticket_id || "NO-TICKET-ID"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    typeof ticket.ticket_id === "string"
                      ? ticket.ticket_id
                      : ticket.ticket_id?.ticket_id || "NO-TICKET-ID"
                  )
                }
              >
                {copiedTicketId ===
                (typeof ticket.ticket_id === "string"
                  ? ticket.ticket_id
                  : ticket.ticket_id?.ticket_id || "NO-TICKET-ID") ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketIdsGrid;
