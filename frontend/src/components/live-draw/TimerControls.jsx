import React, { useState } from "react";
import { Clock, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TimerControls = ({
  currentTimer = 15,
  onTimerChange,
  onClose,
  disabled = false,
}) => {
  const [customTime, setCustomTime] = useState(currentTimer.toString());

  // Predefined timer options (in seconds)
  const timerOptions = [15, 30, 45, 60, 75, 90, 105, 120];

  const handleIncrement = () => {
    const currentValue = parseInt(customTime) || currentTimer;
    const newTime = Math.min(300, currentValue + 1);
    setCustomTime(newTime.toString());
  };

  const handleDecrement = () => {
    const currentValue = parseInt(customTime) || currentTimer;
    const newTime = Math.max(5, currentValue - 1);
    setCustomTime(newTime.toString());
  };

  const handleCustomTimeChange = (e) => {
    const value = e.target.value;
    setCustomTime(value);
  };

  const handleCustomTimeSubmit = () => {
    const seconds = parseInt(customTime, 10);
    if (!isNaN(seconds) && seconds >= 5 && seconds <= 300) {
      onTimerChange(seconds);
      // Close the timer controls after successful update
      if (onClose) {
        onClose();
      }
    } else {
      // Reset to current timer if invalid
      setCustomTime(currentTimer.toString());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCustomTimeSubmit();
    }
  };

  const handleQuickOptionClick = (seconds) => {
    setCustomTime(seconds.toString());
  };

  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-800 border border-white/20 rounded-lg p-5 space-y-5">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-yellow-400" />
        <Label className="text-white font-semibold">Draft Timer</Label>
      </div>

      {/* Current Timer Display */}
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-400 pt-3">
          {formatTime(parseInt(customTime) || currentTimer)}
        </div>
      </div>

      {/* Increment/Decrement Controls with Input in Center */}
      <div className="flex items-center justify-center gap-2">
        <Button
          onClick={handleDecrement}
          disabled={disabled || currentTimer <= 5}
          variant="outline"
          className="w-20 h-10 bg-slate-700/50 text-white"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <Input
          type="number"
          min="5"
          max="300"
          value={customTime}
          onChange={handleCustomTimeChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="w-20 text-center bg-slate-700/50 text-white placeholder:text-gray-500"
          placeholder="15"
        />

        <Button
          onClick={handleIncrement}
          disabled={disabled || currentTimer >= 300}
          variant="outline"
          className="w-20 h-10 bg-slate-700/50 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Timer Options - Full Width Buttons */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Quick Options:</Label>
        <div className="grid grid-cols-4 gap-2">
          {timerOptions.map((seconds) => (
            <Button
              key={seconds}
              onClick={() => handleQuickOptionClick(seconds)}
              disabled={disabled}
              variant="outline"
              size="sm"
              className={`text-xs ${
                parseInt(customTime) === seconds
                  ? "bg-white"
                  : "bg-slate-700/50 text-white"
              }`}
            >
              {formatTime(seconds)}
            </Button>
          ))}
        </div>
      </div>

      {/* Set Button */}
      <Button
        onClick={handleCustomTimeSubmit}
        disabled={disabled}
        variant="accent"
        size="sm"
        className="w-full"
      >
        Set Timer
      </Button>
    </div>
  );
};

export default TimerControls;
