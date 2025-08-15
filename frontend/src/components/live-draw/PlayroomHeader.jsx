import React from "react";
import { motion } from "motion/react";
import { Zap, BookOpen, ListTodo, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const PlayroomHeader = ({
  countdown,
  currentDrafter,
  currentUser,
  currentRound = 1,
  onRulesClick,
  onPriorityListClick,
  userPriorityCount = 0, // ✅ Add user priority count
  pickedPriorityCount = 0, // ✅ Add picked priority count
  showPriorityButton = true, // ✅ New prop to control visibility
}) => {
  const navigate = useNavigate();

  // Check if current user is the current drafter
  const isCurrentUserTurn = currentDrafter?.user_id === currentUser?._id;

  // Calculate countdown progress for visual indicator
  const maxCountdown = 15;
  const countdownProgress = Math.max(0, countdown) / maxCountdown;

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="relative z-20 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md border-b border-white/10 p-4">
      <div className="grid grid-cols-12 items-center gap-4">
        {/* Left - Title and Stats */}
        <div className="col-span-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleHomeClick}
              variant="ghost"
              size="sm"
              className="p-0 h-auto w-auto hover:bg-transparent group"
              title="Go back to Home"
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-6 h-6 text-black font-bold" />
              </motion.div>
            </Button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                LEGO Draft Arena
              </h1>
              <p className="text-xs text-gray-400">Live Draft in Progress</p>
            </div>
          </div>
        </div>

        {/* Center - Simplified Layout with Current Turn and Countdown */}
        <div className="col-span-6">
          <div className="flex flex-col items-center">
            {/* Current Drafter Info */}
            {currentDrafter && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center justify-center gap-4">
                  <motion.div
                    animate={isCurrentUserTurn ? { scale: [1, 1.05, 1] } : {}}
                    transition={{
                      duration: 1,
                      repeat: isCurrentUserTurn ? Infinity : 0,
                    }}
                  >
                    <Avatar className="w-8 h-8 ring-2 ring-yellow-400/50">
                      <AvatarImage
                        src={currentDrafter.user?.profile_picture?.url}
                      />
                      <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-purple-500">
                        {currentDrafter.user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {isCurrentUserTurn ? "Your Turn" : "Current Turn"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-lg">
                        {currentDrafter.user?.name || "Unknown"}
                      </span>
                      {isCurrentUserTurn && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          You
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Countdown Timer */}
            <div className="relative">
              <motion.div
                key={countdown}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                {/* Countdown Circle */}
                <div className="relative w-28 h-28 mx-auto">
                  <svg
                    className="w-28 h-28 transform -rotate-90"
                    viewBox="0 0 112 112"
                  >
                    {/* Background circle */}
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke={
                        Math.max(0, countdown) <= 5 ? "#f87171" : "#fbbf24"
                      }
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      initial={{
                        strokeDasharray: "314.16",
                        strokeDashoffset: "314.16",
                      }}
                      animate={{
                        strokeDashoffset: 314.16 * (1 - countdownProgress),
                        stroke:
                          Math.max(0, countdown) <= 5 ? "#f87171" : "#fbbf24",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>

                  {/* Countdown Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      key={countdown}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-4xl font-bold transition-colors duration-300 ${
                        Math.max(0, countdown) <= 5
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {Math.max(0, countdown)}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right - Round Info and Action Buttons */}
        <div className="col-span-3 flex items-center justify-end">
          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Round Information */}
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800/50 border-white/20 text-white hover:bg-slate-700/50 hover:border-yellow-400/50 transition-all duration-200"
            >
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Round <span className="text-blue-400">{currentRound}</span>
                </p>
              </div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRulesClick}
              className="bg-slate-800/50 border-white/20 text-white hover:bg-slate-700/50 hover:border-yellow-400/50 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Rules</span>
            </Button>

            {showPriorityButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPriorityListClick}
                className="bg-slate-800/50 border-white/20 text-white hover:bg-slate-700/50 hover:border-green-400/50 transition-all duration-200 relative"
              >
                <ListTodo className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Priority</span>

                {/* Priority List Status Indicator */}
                {userPriorityCount > 0 && (
                  <div className="ml-2 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">
                      {userPriorityCount - pickedPriorityCount}
                    </span>
                    <span className="text-xs text-slate-400">/</span>
                    <span className="text-xs text-slate-400">
                      {userPriorityCount}
                    </span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayroomHeader;
