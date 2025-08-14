import React from "react";
import { motion } from "motion/react";
import { Users, Crown, Ticket } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import UserControls from "./UserControls";
import AnimatedBackground from "@/components/ui/animated-background";
import { Badge } from "@/components/ui/badge";

const LAYOUT_ANIM_MS = 800; // should match transition.layout.duration

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
                  {tickets.map((ticket) => (
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
                          ? "border-green-500/30 bg-gradient-to-br from-green-950/50 to-green-900/50"
                          : ticket.queueNumber
                          ? "border-yellow-500/30 bg-gradient-to-br from-yellow-950/50 to-yellow-900/50"
                          : "border-gray-700 bg-gradient-to-br from-gray-800/60 to-gray-700/60"
                      } `}
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
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden shadow-lg">
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
                  ))}
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
