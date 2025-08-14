import React from "react";
import { motion } from "motion/react";

import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/ui/animated-background";

const DraftCompletionScreen = ({
  lotteryData,
  onViewResults,
  onBackToDraws,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
              <Trophy className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Draft Complete!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Congratulations! The {lotteryData?.title || "LEGO"} draft has
              finished successfully. All parts have been distributed to
              participants.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button onClick={onViewResults}>View Complete Results</Button>
            <Button onClick={onBackToDraws} variant="outline">
              Back to Live Draws
            </Button>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center mt-8"
          >
            <p className="text-gray-400 text-sm">
              Thank you for participating in the {lotteryData?.title || "LEGO"}{" "}
              draft! Your parts will be shipped to your registered address.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DraftCompletionScreen;
