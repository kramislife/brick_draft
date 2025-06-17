import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { announcements } from "@/constant/data";

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const announcement = announcements[currentIndex];
    if (!announcement.hasSale || !announcement.endTime) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = announcement.endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const announcement = announcements[currentIndex];
  const showTimer = announcement.hasSale && timeLeft;

  return (
    <div className="bg-accent transition-colors duration-500 px-5">
      <div className="flex items-center justify-center h-10 font-[Inter] text-black text-sm font-medium">
        <div
          className={`transition-opacity duration-500 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          {showTimer ? (
            <div className="flex items-center gap-2">
              <p>{announcement.text}</p>
              <div className="flex items-center gap-1 font-mono font-bold">
                {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map(
                  (value, index) => (
                    <div key={index} className="flex items-center">
                      <Button
                        variant="ghost"
                        className={`bg-white/50 rounded ${
                          index === 2 ? "animate-pulse" : ""
                        }`}
                        size="timer"
                      >
                        {String(value).padStart(2, "0")}
                      </Button>
                      {index < 2 && <span className="px-0.5">:</span>}
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <p>{announcement.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}
