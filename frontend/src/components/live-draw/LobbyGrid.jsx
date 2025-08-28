import React from "react";
import { motion } from "motion/react";
import { Users, Crown, Ticket } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import UserControls from "./UserControls";
import AnimatedBackground from "@/components/ui/animated-background";
import { Badge } from "@/components/ui/badge";

const LAYOUT_ANIM_MS = 800; // should match transition.layout.duration

// Color utility for user assignment
const USER_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F43F5E", // Rose
  "#8B5A2B", // Brown
  "#64748B", // Slate
  "#A855F7", // Violet
  "#0EA5E9", // Sky
  "#22C55E", // Emerald
  "#EAB308", // Amber
  "#FB7185", // Pink Rose
  "#06B6D4", // Light Blue
];

// Color cache for performance
const colorCache = new Map();

const getUserColor = (userId) => {
  if (!userId) return USER_COLORS[0];

  if (colorCache.has(userId)) {
    return colorCache.get(userId);
  }

  // Simple hash function for consistent color assignment
  const hash = userId
    .toString()
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

  const color = USER_COLORS[Math.abs(hash) % USER_COLORS.length];
  colorCache.set(userId, color);
  return color;
};

const getUserGradient = (userId) => {
  const color = getUserColor(userId);
  // Convert hex to RGB for opacity
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return {
    background: `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.8) 0%, rgba(${r}, ${g}, ${b}, 0.6) 100%)`,
  };
};

const LobbyGrid = ({
  tickets,
  currentUser,
  isShuffling,
  onToggleReady,
  countdown,
  onCountdownComplete,
  uniqueUsers,
  readyUsers,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden relative">
      {/* Animated background */}
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 px-5 py-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Crown className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-extrabold text-white">Draft Lobby</h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="px-4 py-2 border-blue-500/20">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-blue-400">
                {readyUsers} of {uniqueUsers} Ready
              </span>
            </Badge>
            <Badge variant="outline" className="px-4 py-2 border-yellow-500/20">
              <Ticket className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-yellow-400">
                {tickets.length} Tickets in Play
              </span>
            </Badge>
          </div>
        </div>

        {countdown > 0 && (
          <CountdownTimer
            seconds={countdown}
            onComplete={onCountdownComplete}
          />
        )}

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Sidebar - Participants */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-white">
                    LEGO Royale Drafters
                  </h2>
                </div>
              </div>
              <div className="p-3">
                <UserControls
                  tickets={tickets}
                  currentUser={currentUser}
                  isShuffling={isShuffling}
                  onToggleReady={onToggleReady}
                />
              </div>
            </div>
          </div>

          {/* Main Content - Tickets */}
          <div className="flex-1">
            <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Active Tickets
                </h2>
                <p className="text-blue-400 text-sm">
                  All tickets are locked and loaded for the draft
                </p>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tickets.map((ticket) => {
                    const userColor = getUserColor(ticket.user?._id);
                    const userGradient = getUserGradient(ticket.user?._id);

                    return (
                      <motion.div
                        key={ticket.ticket_id}
                        layout
                        transition={{
                          layout: {
                            duration: LAYOUT_ANIM_MS / 1000,
                            ease: "easeInOut",
                          },
                          type: "spring",
                          stiffness: 120,
                          damping: 22,
                        }}
                        className={`relative overflow-hidden rounded-xl border ${
                          ticket.status === "ready"
                            ? "border-green-500/30"
                            : ticket.queueNumber
                            ? "border-yellow-500/30"
                            : "border-gray-700"
                        } `}
                        style={userGradient}
                      >
                        {/* Position Badge - Shows when countdown starts or shuffling is complete */}
                        {ticket.queueNumber && (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge
                              variant="accent"
                              className="rounded-full flex items-center justify-center font-bold text-sm bg-yellow-500 text-black border-none"
                            >
                              #{ticket.queueNumber}
                            </Badge>
                          </div>
                        )}

                        {/* Ready Badge - Shows only when ready and no queue number (before countdown) */}
                        {ticket.status === "ready" && !ticket.queueNumber && (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge className="bg-green-500 text-white border-none">
                              Ready
                            </Badge>
                          </div>
                        )}

                        <div className="p-4 pt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden shadow-lg"
                              style={{ backgroundColor: userColor }}
                            >
                              {ticket.user?.profile_picture?.url ? (
                                <img
                                  src={ticket.user.profile_picture.url}
                                  alt={ticket.user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                ticket.user?.name?.charAt(0) || "U"
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-lg">
                                {ticket.user?.name || "Anonymous"}
                              </h3>
                              <p className="text-blue-400 text-sm">
                                Ticket Holder
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-700">
                            <p className="text-yellow-400 text-xs font-semibold mb-1">
                              Ticket Code
                            </p>
                            <p className="text-white font-mono text-sm">
                              {ticket.ticket_id || "NO-TICKET-ID"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LobbyGrid;
