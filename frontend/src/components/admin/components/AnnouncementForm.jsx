import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock } from "lucide-react";

const AnnouncementForm = () => {
  const [announcement, setAnnouncement] = useState("");
  const [promoAvailable, setPromoAvailable] = useState(false);
  const [endDate, setEndDate] = useState();
  const [endTime, setEndTime] = useState("23:59");

  // Calculate countdown for preview
  const getCountdown = () => {
    if (!endDate) return null;

    const now = new Date();
    const end = new Date(endDate);
    const [hours, minutes] = endTime.split(":");
    end.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const diff = end - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const remainingMinutes = Math.floor(
      (diff % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { days, hours: remainingHours, minutes: remainingMinutes };
  };

  const countdown = getCountdown();


  return (
    <div className="space-y-5">
      {/* Announcement Text */}
      <div className="space-y-2">
        <Label htmlFor="announcement">Announcement</Label>
        <Textarea
          id="announcement"
          placeholder="Enter announcement here..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          You can use emojis at the beginning of the announcement for better
          visibility.
        </p>
      </div>

      {/* Promo Available Toggle */}
      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <Label htmlFor="promo-toggle">Promo Available</Label>
          <p className="text-xs text-muted-foreground">
            Set when the countdown timer should end.
          </p>
        </div>
        <Switch
          id="promo-toggle"
          checked={promoAvailable}
          onCheckedChange={setPromoAvailable}
        />
      </div>

      {/* End Date & Time (shown when promo is enabled) */}
      {promoAvailable && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* End Date (Native input) */}
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end-date"
                  type="date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (selectedDate) {
                      setEndDate(new Date(selectedDate));
                    }
                  }}
                  className="pl-10"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card className="border-0 shadow-none p-0">
          <CardContent className="p-0">
            <div className="bg-accent text-black p-3 rounded-lg">
              <div className="flex items-center justify-center text-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {announcement || "⚡ Your announcement will appear here..."}
                  </span>
                  {promoAvailable && countdown && (
                    <div className="flex items-center gap-1 ml-4">
                      <span className="bg-foreground text-accent px-2 py-1 rounded text-xs font-mono">
                        {countdown.days.toString().padStart(2, "0")}
                      </span>
                      <span className="text-xs">:</span>
                      <span className="bg-foreground text-accent px-2 py-1 rounded text-xs font-mono">
                        {countdown.hours.toString().padStart(2, "0")}
                      </span>
                      <span className="text-xs">:</span>
                      <span className="bg-foreground text-accent px-2 py-1 rounded text-xs font-mono">
                        {countdown.minutes.toString().padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementForm;
