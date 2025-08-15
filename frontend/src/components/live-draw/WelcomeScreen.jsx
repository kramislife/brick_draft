import React from "react";
import { motion } from "motion/react";
import { Trophy, Gamepad2, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/ui/animated-background";

const WelcomeScreen = ({ onReadRules, onStartPlaying, isLoggedIn = true }) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden relative">
    {/* Animated background */}
    <AnimatedBackground />

    <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
      <div className="text-center max-w-2xl mx-auto">
        {/* Main Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Trophy Icon with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="mb-5"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            </motion.div>
          </motion.div>

          {/* Title with Stagger Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-5"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-block"
            >
              Welcome to{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            >
              LEGO Royale!
            </motion.span>
          </motion.h1>

          {/* Description with Fade In */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-lg md:text-xl text-muted/50 max-w-xl mx-auto"
          >
            The ultimate LEGO draft experience awaits. Get ready to build your
            dream collection!
          </motion.p>
        </motion.div>

        {/* Buttons Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          {/* Read Rules Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={onReadRules}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <BookOpenCheck className="w-5 h-5" />
              </motion.div>
              <span className="ml-2">Read Rules</span>
            </Button>
          </motion.div>

          {/* Start Playing / Watch Live Draw Button */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="accent"
              onClick={onStartPlaying}
              size="lg"
              className="transition-all duration-300 bg-gradient-to-r from-yellow-400 to-orange-500"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Gamepad2 className="w-5 h-5 " />
              </motion.div>
              <span className="ml-2">
                {isLoggedIn ? "Start Playing" : "Watch Live Draw"}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default WelcomeScreen;
