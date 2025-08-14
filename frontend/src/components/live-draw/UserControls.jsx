import React from "react";
import { UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UserControls = ({ tickets, currentUser, isShuffling, onToggleReady }) => {
  // Get unique users from tickets
  const uniqueUsers = tickets.reduce((users, ticket) => {
    if (!users.find((u) => u.user_id === ticket.user_id)) {
      const userTickets = tickets.filter((t) => t.user_id === ticket.user_id);
      const isReady = userTickets.some((t) => t.status === "ready");
      const hasQueueNumbers = userTickets.some((t) => t.queueNumber);

      users.push({
        user_id: ticket.user_id,
        user: ticket.user,
        ticketCount: userTickets.length,
        isReady,
        hasQueueNumbers,
      });
    }
    return users;
  }, []);

  // Sort users - current user first, then by ready status, then by name
  const sortedUsers = uniqueUsers.sort((a, b) => {
    // Current user always first
    if (a.user_id === currentUser?._id) return -1;
    if (b.user_id === currentUser?._id) return 1;

    // Then by ready status (ready users first)
    if (a.isReady && !b.isReady) return -1;
    if (!a.isReady && b.isReady) return 1;

    // Finally by name
    const nameA = a.user?.name || "Anonymous";
    const nameB = b.user?.name || "Anonymous";
    return nameA.localeCompare(nameB);
  });

  if (sortedUsers.length === 0) return null;

  return (
    <div className="space-y-3">
      {sortedUsers.map((user) => {
        const isOwnUser = user.user_id === currentUser?._id;

        return (
          <div
            key={user.user_id}
            className={`rounded-lg border transition-all duration-300 overflow-hidden ${
              user.isReady
                ? "border-green-400 bg-gradient-to-r from-green-900/30 to-green-800/30"
                : user.hasQueueNumbers
                ? "border-orange-400 bg-gradient-to-r from-orange-900/30 to-yellow-800/30"
                : "border-slate-600 bg-gradient-to-r from-slate-800/50 to-slate-700/50"
            } ${
              isOwnUser
                ? user.isReady
                  ? "ring-2 ring-green-400"
                  : "ring-2 ring-yellow-400"
                : ""
            }`}
          >
            {/* User Info Row */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                  {user.user?.profile_picture?.url ? (
                    <img
                      src={user.user.profile_picture.url}
                      alt={user.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.user?.name?.charAt(0) || "U"
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm truncate">
                      {user.user?.name || "Anonymous"}
                    </span>
                    {isOwnUser && (
                      <Badge className="text-xs px-2 py-0 bg-yellow-400 text-black font-bold">
                        YOU
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-200">
                    <span>
                      {user.ticketCount} ticket{user.ticketCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {user.hasQueueNumbers ? (
                  <div
                    className="w-3 h-3 rounded-full bg-orange-400 animate-pulse"
                    title="In Queue"
                  />
                ) : user.isReady ? (
                  <div
                    className="w-3 h-3 rounded-full bg-green-400 animate-pulse"
                    title="Ready"
                  />
                ) : (
                  <div
                    className="w-3 h-3 rounded-full bg-slate-400"
                    title="Waiting"
                  />
                )}
              </div>
            </div>

            {/* Action Button (only for current user) */}
            {isOwnUser && !user.hasQueueNumbers && (
              <div className="px-3 pb-3">
                <Button
                  onClick={() => onToggleReady(!user.isReady)}
                  variant={user.isReady ? "destructive" : "default"}
                  className={`w-full h-8 text-xs font-semibold ${
                    user.isReady
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-none"
                  }`}
                  disabled={isShuffling}
                >
                  {user.isReady ? (
                    <>
                      <UserX className="w-3 h-3 mr-1" />
                      Not Ready
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3 h-3 mr-1" />
                      Ready
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Status Text for Others */}
            {!isOwnUser && (
              <div className="px-3 pb-3">
                <div className="text-center text-xs font-medium py-1">
                  {user.hasQueueNumbers ? (
                    <span className="text-orange-400">🎯 In Queue</span>
                  ) : user.isReady ? (
                    <span className="text-green-400">✓ Ready</span>
                  ) : (
                    <span className="text-slate-400">⏳ Waiting</span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserControls;
