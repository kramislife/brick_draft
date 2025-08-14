import React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";

const DraftPartCard = ({
  part,
  onClick,
  disabled = false,
  isPicked = false,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`relative group transition-all duration-300 ${
        disabled ? "cursor-default" : "cursor-pointer"
      }`}
      onClick={disabled ? undefined : onClick}
    >
      {/* Main Card */}
      <div
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 overflow-hidden border-gray-600"
      >
        {/* Card Content */}
        <div className="relative p-4 h-full flex flex-col">
          {/* Part Image */}
          <div className="relative mb-3 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
            {part.item_image?.url ? (
              <img
                src={part.item_image.url}
                alt={part.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
            )}

            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>

          {/* Part Info */}
          <div className="flex-1 flex flex-col">
            {/* Part Name */}
            <h3
              className="text-white font-bold text-sm mb-2 group-hover:text-yellow-300 transition-colors overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }}
            >
              {part.name || "Unknown Part"}
            </h3>

            {/* Category & Color */}
            <div className="flex items-center gap-2 mb-3">
              {part.color?.color_name && (
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{
                      backgroundColor: part.color.hex_code || "#6b7280",
                    }}
                  />
                  <span className="text-xs text-slate-400">
                    {part.color.color_name}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Info */}
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                {/* Quantity */}
                <div className="text-slate-400 text-xs">
                  Qty:{" "}
                  <span className="text-white font-semibold">
                    {part.quantity || 1}
                  </span>
                </div>

                {/* Value */}
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    ${(part.total_value || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pick Action Overlay - Only show when it's user's turn */}
        {!disabled && !isPicked && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black text-lg font-bold">👆</span>
              </div>
              <p className="text-white font-bold text-sm mb-1">
                Pick this item
              </p>
              <p className="text-yellow-400 text-xs">Click to select</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DraftPartCard;
