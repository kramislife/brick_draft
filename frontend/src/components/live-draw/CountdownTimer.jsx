import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const CountdownTimer = ({ seconds, onComplete }) => {
  useEffect(() => {
    if (seconds === 0 && onComplete) {
      onComplete();
    }
  }, [seconds, onComplete]);

  const visible = seconds > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="countdown-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />

          {/* Center countdown content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated ring */}
            <motion.div
              className="relative w-56 h-56 md:w-64 md:h-64 rounded-full grid place-items-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
            >
              {/* Outer pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-emerald-400/40"
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Inner gradient circle */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 shadow-xl" />

              {/* Countdown number */}
              <motion.div
                key={seconds}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
                className="relative z-10 text-white text-7xl md:text-8xl font-extrabold drop-shadow-xl"
              >
                {seconds}
              </motion.div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="mt-6 text-white/90 text-lg md:text-2xl font-semibold"
            >
              Draft begins in...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CountdownTimer;
