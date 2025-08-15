import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetLotteriesQuery,
  useGetSocketConfigQuery,
} from "@/redux/api/lotteryApi";
import LiveDrawCard from "@/components/live-draw/LiveDrawCard";
import AnimatedBackground from "@/components/ui/animated-background";
import io from "socket.io-client";
import { Award, Calendar, Star, TvMinimalPlay } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Utility functions
const getCountdown = (drawDate, drawTime) => {
  if (!drawDate || !drawTime) return null;
  const target = new Date(`${drawDate}T${drawTime}`);
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
};

const formatCountdown = (c) => {
  if (!c) return null;
  const parts = [];
  if (c.days > 0) parts.push(`${c.days}d`);
  if (c.hours > 0 || c.days > 0) parts.push(`${c.hours}h`);
  parts.push(`${c.minutes}m`);
  parts.push(`${c.seconds}s`);
  return parts.join(" ");
};

const LiveDraw = () => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const { data: lotteriesData, isLoading, refetch } = useGetLotteriesQuery();
  const { data: socketConfig } = useGetSocketConfigQuery();
  const lotteries = lotteriesData?.lotteries || [];
  const [countdowns, setCountdowns] = useState({});

  // Process lotteries with countdown data
  const processedLotteries = useMemo(() => {
    return lotteries.map((lottery) => {
      const isLive = lottery.lottery_status === "live";
      const isUpcoming = lottery.lottery_status === "upcoming";
      const isCompleted = lottery.lottery_status === "completed";

      const countdown =
        countdowns[lottery._id] ||
        (isUpcoming ? getCountdown(lottery.drawDate, lottery.drawTime) : null);

      return {
        ...lottery,
        isLive,
        isUpcoming,
        isCompleted,
        countdown,
        formattedCountdown: formatCountdown(countdown),
      };
    });
  }, [lotteries, countdowns]);

  // Group lotteries by status
  const groupedLotteries = useMemo(() => {
    const live = processedLotteries.filter((lottery) => lottery.isLive);
    const upcoming = processedLotteries.filter((lottery) => lottery.isUpcoming);
    const completed = processedLotteries.filter(
      (lottery) => lottery.isCompleted
    );
    return { live, upcoming, completed };
  }, [processedLotteries]);

  const sectionConfig = [
    {
      key: "live",
      title: "Live Draws",
      icon: TvMinimalPlay,
      iconColor: "text-red-500",
      badgeColor: "bg-red-600",
      badgeText: "active",
      data: groupedLotteries.live,
    },
    {
      key: "upcoming",
      title: "Upcoming Draws",
      icon: Calendar,
      iconColor: "text-blue-500",
      badgeColor: "bg-blue-600",
      badgeText: "scheduled",
      data: groupedLotteries.upcoming,
    },
    {
      key: "completed",
      title: "Completed Draws",
      icon: Award,
      iconColor: "text-green-500",
      badgeColor: "bg-green-600",
      badgeText: "completed",
      data: groupedLotteries.completed,
    },
  ];

  // Update countdowns for upcoming lotteries
  useEffect(() => {
    const upcomingLotteries = lotteries.filter(
      (lottery) => lottery.lottery_status === "upcoming"
    );

    if (upcomingLotteries.length === 0) return;

    const interval = setInterval(() => {
      const newCountdowns = {};
      let hasChanges = false;

      upcomingLotteries.forEach((lottery) => {
        const newCountdown = getCountdown(lottery.drawDate, lottery.drawTime);
        if (newCountdown !== countdowns[lottery._id]) {
          newCountdowns[lottery._id] = newCountdown;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setCountdowns((prev) => ({ ...prev, ...newCountdowns }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lotteries, countdowns]);

  // Socket connection
  useEffect(() => {
    if (!socketConfig?.socketUrl) return;
    socketRef.current = io(socketConfig.socketUrl);
    socketRef.current.on("statusUpdate", (data) => {
      console.log("📡 Received statusUpdate event:", data);
      refetch();
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [socketConfig, refetch]);

  // LOADING ONLY
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Loading Lottery Draws...
          </h3>
          <p className="text-gray-300">
            Please wait while we fetch the latest lottery information.
          </p>
        </div>
      </div>
    );
  }

  // EMPTY ONLY
  if (sectionConfig.every((section) => section.data.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-2">
            No Lottery Draws Available
          </h3>
          <p className="text-gray-300">
            There are currently no lottery draws scheduled or active.
          </p>
        </div>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden relative">
      <AnimatedBackground />
      <section className="relative z-10 px-5 py-10">
        {/* Header */}
        <div className="relative mb-12 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
            <h1 className="text-5xl font-extrabold">Live Casino Draws</h1>
            <Star className="w-5 h-5 fill-blue-500 text-blue-500" />
          </div>
          <p className="text-lg max-w-2xl mx-auto mb-6">
            Experience the thrill of live lottery draws with real-time excitement and incredible prizes!
          </p>
          <div className="flex justify-center items-center gap-5">
            <div className="flex items-center gap-2">
              <TvMinimalPlay className="w-5 h-5 text-red-500" />
              <span className="text-red-600 font-bold text-2xl">
                {groupedLotteries.live.length}
              </span>
              <span className="font-medium">Live Now</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-blue-600 font-bold text-2xl">
                {groupedLotteries.upcoming.length}
              </span>
              <span className="font-medium">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        {sectionConfig.map(
          (section) =>
            section.data.length > 0 && (
              <div key={section.key} className="mb-10">
                <div className="flex items-center gap-4 mb-5">
                  <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span>{section.title}</span>
                    <Badge className={`ml-3 ${section.badgeColor} rounded-full`}>
                      {section.data.length} {section.badgeText}
                    </Badge>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {section.data.map((lottery) => (
                    <LiveDrawCard
                      key={lottery._id || lottery.id}
                      lottery={lottery}
                    />
                  ))}
                </div>
              </div>
            )
        )}
      </section>
    </div>
  );
};

export default LiveDraw;
