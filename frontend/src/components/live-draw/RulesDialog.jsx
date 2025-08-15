import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Users,
  Target,
  Sparkles,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const rules = [
  {
    title: "Turn-Based System",
    icon: <Clock className="w-5 h-5 text-yellow-400" />,
    description:
      "Each player has exactly 15 seconds to make their selection. Timer starts when it's your turn.",
  },
  {
    title: "Snake Draft Pattern",
    icon: <Users className="w-5 h-5 text-blue-400" />,
    description:
      "Draft order reverses each round (1-2-3-4, then 4-3-2-1, then 1-2-3-4, etc.) ensuring fair distribution.",
  },
  {
    title: "Priority Selection",
    icon: <Target className="w-5 h-5 text-purple-400" />,
    description:
      "Prioritized parts are selected first. Rare and unique pieces get priority selection before common parts.",
  },
];

const proTips = [
  "Focus on completing sets rather than individual rare pieces",
  "Watch other players' selections to predict their strategies",
  "Save time by pre-planning your first few picks",
  "Use the trading phase to fill gaps in your collections",
];

const importantNotes = [
  "Missing a turn results in automatic random selection",
  "No communication allowed during drafting phase",
  "Trading phase is optional but recommended",
  "Final scoring is revealed only at the end",
];

const RulesDialog = ({
  open,
  onClose,
  onUnderstand,
  showUnderstandButton = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700 [&_svg]:text-white">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
              LEGO Royale Rules
            </DialogTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <DialogDescription className="text-sm text-muted/50">
              Master the art of strategic LEGO drafting
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        {/* Rules List */}
        <div className="space-y-3 mb-5">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
                ease: "easeOut",
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Card className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <motion.div
                      className="p-2 rounded-lg bg-gray-800 border border-gray-700"
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      {rule.icon}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {rule.title}
                      </h3>
                      <p className="text-sm text-muted/50 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card className="p-5 bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700">
              <motion.h4
                className="text-xl font-semibold text-red-400 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                </motion.div>
                Important Notes
              </motion.h4>
              <ul className="space-y-2">
                {importantNotes.map((note, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8 + index * 0.1,
                    }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                    <span className="text-gray-300">{note}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card className="p-5 bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700">
              <motion.h4
                className="text-xl font-semibold text-blue-400 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Lightbulb className="w-6 h-6 mr-3" />
                </motion.div>
                Pro Tips for Success
              </motion.h4>
              <div className="space-y-2.5">
                {proTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.1 + index * 0.1,
                    }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                    <span className="text-gray-300">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>

        <DialogFooter>
          {showUnderstandButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
              className="w-full"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={onUnderstand}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                  </motion.div>
                  I Understand, Let's Play!
                </Button>
              </motion.div>
            </motion.div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RulesDialog;
