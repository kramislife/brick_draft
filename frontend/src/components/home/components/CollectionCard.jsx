import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, ArrowRight } from "lucide-react";

const CollectionCard = ({ collection, setCount = 0, onClick }) => {
  const navigate = useNavigate();
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow group cursor-pointer min-h-[320px] flex flex-col justify-end bg-gray-100"
      style={{ minHeight: 320 }}
      onClick={onClick}
    >
      {/* Background image */}
      <img
        src={collection.image?.url || "/placeholder-image.jpg"}
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg";
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      {/* Card content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        <div className="mb-8" /> {/* Spacer for bottom content */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-between items-end p-6">
          <div className="text-white">
            <div className="text-2xl font-bold mb-1 drop-shadow-lg">
              {collection.name}
            </div>
            {collection.description && (
              <div className="text-base opacity-90 mb-3 max-w-xs drop-shadow-lg">
                {collection.description}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Box className="w-5 h-5 mr-1" />
              {setCount} set{setCount !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            className="flex items-center gap-1 text-white font-semibold text-base bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg transition"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Explore <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
