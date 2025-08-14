import React from "react";
import { Play, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminControls = ({ phase, allReady, onStartDraft, starting = false }) => {
  if (phase !== "lobby") return null;

  return (
    <div className="fixed bottom-6 right-6 space-y-2 z-50">
      <Button
        onClick={onStartDraft}
        disabled={starting}
        className={`gap-2 shadow-xl border-2 transition-all duration-300 hover:scale-105 ${
          allReady
            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-green-400/30 hover:border-green-400/50"
            : "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white border-red-400/30 hover:border-red-400/50"
        }`}
      >
        {starting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Starting Draft...
          </>
        ) : allReady ? (
          <>
            <Play className="w-4 h-4" />
            Start Draft
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            Force Start Draft
          </>
        )}
      </Button>
    </div>
  );
};

export default AdminControls;
