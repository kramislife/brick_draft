import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Clock, Hand, Bot, Zap, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const PickHistory = ({ pickHistory }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get pick method indicator
  const getPickMethodIndicator = (pickMethod) => {
    switch (pickMethod) {
      case "manual":
        return {
          icon: Hand,
          label: "Manual",
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          iconColor: "text-blue-400",
        };
      case "auto":
        return {
          icon: Bot,
          label: "Auto-Pick",
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          iconColor: "text-green-400",
        };
      case "afk":
        return {
          icon: Zap,
          label: "AFK Auto",
          color: "text-orange-400",
          bgColor: "bg-orange-500/20",
          borderColor: "border-orange-500/30",
          iconColor: "text-orange-400",
        };
      default:
        return {
          icon: Hand,
          label: "Manual",
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          iconColor: "text-gray-400",
        };
    }
  };

  return (
    <div className="col-span-3">
      <Card className="h-[700px] bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-white/10">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Pick History</h3>
            <Badge
              variant="secondary"
              className="ml-auto bg-slate-700 text-slate-300"
            >
              {pickHistory.length} {pickHistory.length === 1 ? "pick" : "picks"}
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 scroll-smooth">
            <AnimatePresence mode="popLayout">
              {pickHistory.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 py-12"
                >
                  <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">No picks yet!</p>
                  <p className="text-sm">The draft is just getting started.</p>
                </motion.div>
              ) : (
                pickHistory.map((pick, index) => {
                  const pickMethod = getPickMethodIndicator(
                    pick.pick_method || "manual"
                  );
                  const MethodIcon = pickMethod.icon;

                  return (
                    <motion.div
                      key={`${pick.user?._id}-${pick.part?._id}-${pick.timestamp}`}
                      initial={{ opacity: 0, x: 20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      transition={{
                        delay: Math.min(index * 0.05, 0.5), // ✅ Cap delay for performance
                        duration: 0.3,
                      }}
                      className="relative group"
                    >
                      <div
                        className={`bg-slate-800/70 rounded-lg p-3 border transition-all duration-300 hover:bg-slate-700/70 ${pickMethod.borderColor} hover:border-slate-500`}
                      >
                        <div className="space-y-3">
                          {/* Top Row - User Info */}
                          <div className="flex items-start gap-3">
                            {/* User Avatar */}
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarImage
                                src={pick.user?.profile_picture?.url}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                                {pick.user?.name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>

                            {/* User Details */}
                            <div className="flex-1 min-w-0">
                              {/* User Name and Pick Method */}
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-white text-sm truncate">
                                  {pick.user?.name || "Unknown"}
                                </p>
                              </div>

                              {/* Ticket Info */}
                              <div className="text-xs text-gray-400">
                                <span>Ticket {pick.ticket_id}</span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row - Part Info */}
                          <div className="border-t border-slate-600 pt-3">
                            <div className="flex items-center gap-3">
                              {/* Part Image */}
                              <div className="w-12 h-12 bg-slate-700 rounded-md flex items-center justify-center flex-shrink-0 p-1">
                                {pick.part?.item_image?.url ? (
                                  <img
                                    src={pick.part.item_image.url}
                                    alt={pick.part.name}
                                    className="w-full h-full object-contain rounded-md"
                                  />
                                ) : (
                                  <ImageIcon className="w-6 h-6 text-slate-400" />
                                )}
                              </div>

                              {/* Part Details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {pick.part?.name || "Unknown Part"}
                                </p>
                                <div className="flex items-center gap-2">
                                  {/* Color indicator */}
                                  {pick.part?.color?.color_name ? (
                                    <div className="flex items-center gap-1">
                                      <div
                                        className="w-2 h-2 rounded-full border border-white/30"
                                        style={{
                                          backgroundColor:
                                            pick.part.color.hex_code ||
                                            "#6b7280",
                                        }}
                                      />
                                      <span className="text-xs text-gray-400">
                                        {pick.part.color.color_name}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <div className="w-2 h-2 rounded-full border border-white/30 bg-slate-600" />
                                      <span className="text-xs text-slate-500">
                                        No color
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Value and Quantity */}
                              <div className="flex-shrink-0 text-right">
                                <div className="text-sm font-bold text-green-400">
                                  $
                                  {(
                                    pick.part?.total_value || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Qty: {pick.part?.quantity || 1}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pick Method Indicator */}
                        <div className="absolute top-3 right-3 z-10">
                          <Badge
                            className={`${pickMethod.bgColor} ${pickMethod.color} border ${pickMethod.borderColor} text-xs font-medium flex items-center gap-1`}
                          >
                            <MethodIcon className="w-3 h-3" />
                            {pickMethod.label}
                          </Badge>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Summary Stats */}
          {pickHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-white/10 pt-4 mt-4"
            >
              <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-lg p-3 border border-purple-400/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Total Value Drafted
                  </span>
                  <span className="text-lg font-bold text-purple-400">
                    $
                    {pickHistory
                      .reduce(
                        (sum, pick) => sum + (pick.part?.total_value || 0),
                        0
                      )
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PickHistory;
