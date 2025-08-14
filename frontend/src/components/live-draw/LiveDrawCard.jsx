import React, { useEffect, useState } from "react";
import { Clock, Calendar, Lock, Zap, Award, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LiveDrawCard = ({ lottery }) => {
  const navigate = useNavigate();
  const {
    isLive,
    isUpcoming,
    isCompleted,
    countdown,
    formattedCountdown,
    image,
    title,
    name,
    formattedDrawDate,
    drawDate,
    formattedDrawTime,
    drawTime,
    _id,
  } = lottery;

  // Grace window after countdown reaches 0 to avoid briefly showing 'Draw Locked'
  const [inGraceWindow, setInGraceWindow] = useState(false);
  useEffect(() => {
    // When countdown disappears (<= 0) but backend hasn't flipped to live yet
    if (!isLive && isUpcoming && !formattedCountdown) {
      setInGraceWindow(true);
      const t = setTimeout(() => setInGraceWindow(false), 30000); // 30s grace
      return () => clearTimeout(t);
    }
    // If it becomes live or completes, end grace immediately
    if (isLive || isCompleted) {
      setInGraceWindow(false);
    }
  }, [isLive, isUpcoming, formattedCountdown, isCompleted]);

  const handleCardClick = () => {
    if (isLive || inGraceWindow) {
      navigate(`/live-draw/${_id}`);
    }
  };

  const statusConfig = {
    live: {
      color: "red",
      icon: <Zap className="w-3 h-3 fill-current" />,
      label: "LIVE NOW",
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      pulse: true,
      accent: "text-red-400",
      border: "border-red-500/30",
    },
    upcoming: {
      color: "blue",
      icon: <Clock className="w-3 h-3" />,
      label: "UPCOMING",
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      pulse: false,
      accent: "text-blue-400",
      border: "border-blue-500/30",
    },
    completed: {
      color: "green",
      icon: <Award className="w-3 h-3 fill-current" />,
      label: "COMPLETED",
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      pulse: false,
      accent: "text-green-400",
      border: "border-green-500/30",
    },
  };

  const status = isLive ? "live" : isCompleted ? "completed" : "upcoming";
  const { bg, accent, border } = statusConfig[status];

  const showStartingState =
    !isLive &&
    !isCompleted &&
    (inGraceWindow || (isUpcoming && !formattedCountdown));

  return (
    <Card
      className="relative overflow-hidden border-none p-0 gap-0 group w-full bg-gradient-to-br from-gray-900 to-gray-800 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={image?.url || image || "/placeholder-lottery.jpg"}
          alt={title || name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Title with glow effect */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="font-bold text-white line-clamp-1">{title || name}</h3>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="py-5">
        {/* Date and Time */}
        <div
          className={`flex items-center gap-4 mb-3 p-3 rounded-lg bg-gray-800/50 border ${border}`}
        >
          <div className="flex items-center gap-2 text-sm">
            <Calendar className={`w-4 h-4 ${accent}`} />
            <span className="text-gray-300">
              {formattedDrawDate || drawDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className={`w-4 h-4 ${accent}`} />
            <span className="text-gray-300">
              {formattedDrawTime || drawTime}
            </span>
          </div>
        </div>

        {/* Countdown or Action Button */}
        <div className="mt-2">
          {isLive ? (
            <Button className="w-full bg-red-500">
              <Zap className="w-4 h-4 fill-current" />
              <span>Join Live Draw</span>
            </Button>
          ) : isUpcoming && formattedCountdown ? (
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center border-r border-gray-600 last:border-r-0">
                  <div className="text-xl font-mono font-bold text-yellow-400">
                    {countdown?.days.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-300 uppercase">Days</div>
                </div>
                <div className="flex flex-col items-center border-r border-gray-600 last:border-r-0">
                  <div className="text-xl font-mono font-bold text-yellow-400">
                    {countdown?.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-300 uppercase">Hours</div>
                </div>
                <div className="flex flex-col items-center border-r border-gray-600 last:border-r-0">
                  <div className="text-xl font-mono font-bold text-yellow-400">
                    {countdown?.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-300 uppercase">Mins</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xl font-mono font-bold text-yellow-400">
                    {countdown?.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-300 uppercase">Secs</div>
                </div>
              </div>
            </div>
          ) : showStartingState ? (
            <div className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 border border-amber-400/40 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Starting...</span>
            </div>
          ) : isCompleted ? (
            <div className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 font-medium rounded-lg flex items-center justify-center gap-2 border border-gray-700">
              <Award className="w-4 h-4 text-green-400" />
              <span>Draw Completed</span>
            </div>
          ) : (
            <div className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 font-medium rounded-lg flex items-center justify-center gap-2 border border-gray-700">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Draw Locked</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Hover Overlay */}
      {isCompleted || isUpcoming ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 backdrop-blur-sm rounded-xl bg-black/70">
          <div className="text-center text-white p-4">
            <div
              className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${bg} shadow-lg`}
            >
              {isCompleted ? (
                <Award className="w-5 h-5 text-white" />
              ) : showStartingState ? (
                <Zap className="w-5 h-5 text-white" />
              ) : (
                <Lock className="w-5 h-5 text-white" />
              )}
            </div>
            <p className="text-lg font-bold mb-1">
              {isCompleted
                ? "Draw Complete!"
                : showStartingState
                ? "Starting..."
                : "Draw Locked"}
            </p>
            <p className="text-sm text-gray-300">
              {isCompleted
                ? "Results available now"
                : showStartingState
                ? "Going live any moment"
                : "Will unlock when live"}
            </p>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default LiveDrawCard;
