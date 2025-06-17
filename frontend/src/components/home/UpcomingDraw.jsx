import React, { useState, useEffect } from "react";
import { Trophy, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lotteryData } from "@/constant/data";
import { Card } from "@/components/ui/card";

const UpcomingDraw = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  const upcomingDraws = lotteryData
    .sort(
      (a, b) =>
        new Date(`${a.drawDate} ${a.drawTime}`) -
        new Date(`${b.drawDate} ${b.drawTime}`)
    )
    .slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const drawDate = new Date(
        `${upcomingDraws[currentIndex].drawDate} ${upcomingDraws[currentIndex].drawTime}`
      ).getTime();
      const distance = drawDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentDraw = upcomingDraws[currentIndex];
  const filledPercentage =
    ((currentDraw.totalSlots - currentDraw.slotsAvailable) /
      currentDraw.totalSlots) *
    100;

  const urgencyLevel =
    filledPercentage > 85
      ? "critical"
      : filledPercentage > 70
      ? "high"
      : "medium";

  return (
    <section className="py-10 px-5 bg-secondary/50">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Button
            className="rounded-full h-13 [&_svg:not([class*='size-'])]:size-7"
            variant="accent"
          >
            <Trophy className="text-accent-foreground" />
          </Button>
          <h2 className="gradient-text text-5xl font-black">
            Live <span className="text-accent">Prize Draws</span>
          </h2>
        </div>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Don't miss your chance to win these incredible LEGO sets! Our next
          draws are happening soon.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="relative h-[550px] rounded-2xl overflow-hidden shadow-2xl border">
            <div className="absolute inset-0">
              <img
                src={currentDraw.image}
                alt={currentDraw.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
            <div className="absolute top-6 right-6 bg-red-500/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-accent" />
              <span className="text-white font-bold text-sm">
                {currentDraw.features}
              </span>
            </div>
            <div className="absolute top-6 left-6 bg-red-500/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <span className="text-white font-bold text-sm">
                {urgencyLevel === "critical"
                  ? "🔥 ALMOST SOLD OUT"
                  : "⚡ DRAWING SOON"}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h3 className="text-4xl font-black text-white mb-2">
                {currentDraw.name}
              </h3>
              <p className="text-gray-300 mb-5">{currentDraw.description}</p>

              <div className="grid grid-cols-4 gap-3 mb-5">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div
                    key={unit}
                    className="bg-black/50 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
                  >
                    <div className="text-3xl font-black text-yellow-400 mb-1">
                      {String(value).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-300 uppercase font-semibold tracking-wider">
                      {unit}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Button
                  size="lg"
                  variant="accent"
                  className="w-full font-black text-xl"
                >
                  🎯 ENTER DRAW NOW - ${currentDraw.price}
                </Button>
              </div>

              <div className="text-center mt-3">
                <p className="text-sm text-muted-foreground">
                  💳 Secure payment • 🎁 Instant confirmation • 🏆 Fair draw
                  guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {upcomingDraws.map((draw, index) => (
            <div
              key={draw.id}
              onClick={() => setCurrentIndex(index)}
              className="cursor-pointer transition-all duration-300"
            >
              <Card
                className={`p-5 gradient-blue-darker ${
                  currentIndex === index
                    ? "border-accent"
                    : "hover:border-accent/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={draw.image}
                      alt={draw.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    {currentIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-accent rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-xl mb-1">{draw.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Draw: {draw.drawDate} at {draw.drawTime}
                    </p>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${draw.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {draw.totalSlots - draw.slotsAvailable}/
                        {draw.totalSlots} filled
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          draw.slotsAvailable < 500
                            ? "text-red-500 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {draw.slotsAvailable} left
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingDraw;
