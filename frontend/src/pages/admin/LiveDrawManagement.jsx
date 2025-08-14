import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetPerformanceMetricsQuery,
  useCleanupLiveDrawMutation,
} from "@/redux/api/liveDrawApi";
import { Activity, Users, Clock, Zap, Trash2 } from "lucide-react";

const LiveDrawManagement = () => {
  const { data: metrics, isLoading, refetch } = useGetPerformanceMetricsQuery();
  const [cleanupLiveDraw, { isLoading: isCleaning }] =
    useCleanupLiveDrawMutation();

  const handleCleanup = async () => {
    try {
      await cleanupLiveDraw().unwrap();
      refetch(); // Refresh metrics after cleanup
    } catch (error) {
      console.error("Error cleaning up live draw:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Live Draw Management</h1>
        <Button
          onClick={handleCleanup}
          disabled={isCleaning}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {isCleaning ? "Cleaning..." : "Cleanup Live Draw"}
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rooms</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.activeRooms || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalParticipants || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all active drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Picks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalPicks || 0}</div>
            <p className="text-xs text-muted-foreground">Parts picked today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Size</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.cacheStats
                ? Object.values(metrics.cacheStats).reduce((a, b) => a + b, 0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Cached items</p>
          </CardContent>
        </Card>
      </div>

      {/* Cache Details */}
      {metrics?.cacheStats && (
        <Card>
          <CardHeader>
            <CardTitle>Cache Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Lottery Cache</span>
                <Badge variant="secondary">
                  {metrics.cacheStats.lotteryCacheSize || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Priority Lists</span>
                <Badge variant="secondary">
                  {metrics.cacheStats.priorityListCacheSize || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">User Cache</span>
                <Badge variant="secondary">
                  {metrics.cacheStats.userCacheSize || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Live Draw System</span>
              <Badge variant="default" className="bg-green-500">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Performance</span>
              <Badge variant="default" className="bg-blue-500">
                Optimized
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Memory Usage</span>
              <Badge variant="default" className="bg-yellow-500">
                Normal
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveDrawManagement;
