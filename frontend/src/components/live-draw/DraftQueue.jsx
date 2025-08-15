import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DraftQueue = ({
  sortedQueue,
  currentDrafter,
  currentUser,
  onAutoPickToggle,
  autoPickEnabled = false,
  autoPickStatus = { currentRound: false, nextRound: false },
  // Additional props for auto-scroll functionality
  scrollContainerRef,
  currentDrafterRef,
  // New control to hide auto-pick UI for guests
  showAutoPickToggle = true,
}) => {
  return (
    <div className="col-span-3">
      <Card className="h-[700px] bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-none">
        <CardContent className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Draft Order</h3>
            <Badge
              variant="secondary"
              className="ml-auto bg-slate-700 text-slate-300"
            >
              {sortedQueue.length}
            </Badge>
          </div>

          {/* Scrollable Queue */}
          <div
            ref={scrollContainerRef}
            className={`flex-1 overflow-y-auto space-y-2 ${
              showAutoPickToggle
                ? "mb-4 min-h-0 max-h-[580px]"
                : "min-h-0 max-h-[580px]"
            }`}
          >
            <AnimatePresence>
              {sortedQueue.map((ticket, index) => {
                const isCurrentDrafter =
                  currentDrafter?.ticket_id === ticket.ticket_id;
                const isCurrentUser = ticket.user_id === currentUser?._id;

                return (
                  <motion.div
                    key={ticket.ticket_id}
                    ref={isCurrentDrafter ? currentDrafterRef : null}
                    data-ticket-id={ticket.ticket_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-3 rounded-lg border transition-all duration-300 ${
                      isCurrentDrafter
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400 shadow-lg shadow-green-400/20 animate-pulse"
                        : "bg-slate-800/50 border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    {/* Simple green border for current drafter */}
                    {isCurrentDrafter && (
                      <div className="absolute inset-0 rounded-lg border-2 border-green-400" />
                    )}

                    <div className="relative flex items-center gap-3">
                      {/* Queue Position */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCurrentDrafter
                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-black"
                            : "bg-slate-600 text-white"
                        }`}
                      >
                        {ticket.queueNumber || index + 1}
                      </div>

                      {/* User Avatar */}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={ticket.user?.profile_picture?.url} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {ticket.user?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-semibold truncate ${
                              isCurrentDrafter ? "text-green-300" : "text-white"
                            }`}
                          >
                            {ticket.user?.name || "Unknown"}
                          </p>
                          {isCurrentUser && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-blue-500 text-white"
                            >
                              YOU
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {ticket.ticket_id}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Auto-Pick Toggle Section - Show when draft is active */}
          {showAutoPickToggle && currentDrafter && (
            <div className="border-t border-slate-600 pt-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <Label className="text-sm font-medium text-white">
                    Auto-Pick Mode
                  </Label>
                </div>
                <Switch
                  checked={
                    autoPickEnabled ||
                    autoPickStatus.currentRound ||
                    autoPickStatus.nextRound
                  }
                  onCheckedChange={(enabled) => {
                    if (onAutoPickToggle) {
                      // Always schedule for next round when toggled on
                      onAutoPickToggle(enabled);
                    }
                  }}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              {/* Auto-Pick Status Display */}
              {(autoPickEnabled ||
                autoPickStatus.currentRound ||
                autoPickStatus.nextRound) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {/* Current Round Auto-Pick */}
                  {(autoPickEnabled || autoPickStatus.currentRound) && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="text-xs text-blue-300">
                        <p className="font-medium">🤖 Auto-Pick Active</p>
                        <p className="text-blue-200/80">
                          {currentDrafter?.user_id === currentUser?._id
                            ? "Will auto-pick when your turn starts!"
                            : "Will auto-pick when it's your turn."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Next Round Auto-Pick */}
                  {autoPickStatus.nextRound && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="text-xs text-orange-300">
                        <p className="font-medium">⏰ Auto-Pick Scheduled</p>
                        <p className="text-orange-200/80">
                          Auto-pick will be activated for the next round
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Show message when draft hasn't started yet */}
          {!currentDrafter && showAutoPickToggle && (
            <div className="border-t border-slate-600 pt-4">
              <div className="text-center p-3">
                <Bot className="w-4 h-4 text-slate-400 mx-auto mb-2" />
                <p className="text-yellow-400 text-xs font-medium mb-1">
                  Auto-pick will be available once the draft starts
                </p>
                <p className="text-slate-400 text-xs">
                  Toggle auto-pick on to automatically select parts when it's
                  your turn
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftQueue;
