import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Shuffle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TicketCard = ({ ticket, isShuffling }) => {
  const isReady = ticket.status === "ready";
  const queueNumber = ticket.queueNumber;

  // Debug logging for ticket data
  if (!ticket.ticket_id) {
    console.error("Ticket missing ticket_id:", ticket);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
        isReady
          ? "border-2 border-green-500 bg-green-50 dark:bg-green-950/20"
          : queueNumber
          ? "border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
          : "border border-muted bg-card"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={ticket.user?.profile_picture?.url} />
            <AvatarFallback>
              {ticket.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">
              {ticket.user?.name || "Anonymous"}
            </h3>
            <Badge
              variant="outline"
              className="text-xs mt-1 min-w-0 max-w-full truncate block"
              title={ticket.ticket_id || "NO-TICKET-ID"}
            >
              {ticket.ticket_id || "NO-TICKET-ID"}
            </Badge>
          </div>
        </div>

        <div className="text-center">
          {isShuffling ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="flex justify-center"
            >
              <Shuffle className="w-6 h-6 text-indigo-500" />
            </motion.div>
          ) : queueNumber ? (
            <div className="text-lg font-bold text-indigo-600">
              Queue #{queueNumber}
            </div>
          ) : isReady ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Ready</span>
            </div>
          ) : (
            <div className="text-muted-foreground">Waiting...</div>
          )}
        </div>
      </CardContent>
    </motion.div>
  );
};

export default TicketCard;
