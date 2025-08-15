import React from "react";
import { AnimatePresence } from "motion/react";
import { Loader, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveDrawDetails } from "@/hooks/useLiveDrawDetails";
import AnimatedBackground from "@/components/ui/animated-background";

// Import child components
import WelcomeScreen from "@/components/live-draw/WelcomeScreen";
import RulesDialog from "@/components/live-draw/RulesDialog";
import LobbyGrid from "@/components/live-draw/LobbyGrid";
import PlayroomScreen from "@/components/live-draw/PlayroomScreen";
import DraftCompletionScreen from "@/components/live-draw/DraftCompletionScreen";
import AdminControls from "@/components/live-draw/AdminControls";

// Main LiveDrawDetails Component
const LiveDrawDetails = () => {
  const {
    // State
    phase,
    rulesOpen,
    setRulesOpen,
    tickets,
    countdown,
    isShuffling,
    loading,
    connected,
    draftCompleted,
    phaseInitialized,
    isStartingDraft,
    pickHistory,
    currentDrafter,
    draftCountdown,
    pickedParts,
    currentRound,
    currentPick,
    autoPickStatus,
    priorityViewOpen,
    setPriorityViewOpen,
    priorityEditOpen,
    selectedParts,
    saving,
    selectAllLoading,
    isSelectAllMode,
    paginationParams,
    animatedTickets,
    isAnimating,
    priorityListData,
    isPriorityLoading,
    availablePriorityParts,
    availableParts,
    priorityListStats,
    userPurchaseId,
    lotteryData,
    lotteryLoading,
    currentUser,

    // Computed values
    uniqueUsers,
    readyUsers,
    allReady,
    isAdmin,
    sortedQueue,

    // Event handlers
    handleToggleReady,
    handleStartDraft,
    handleCancelCountdown,
    handlePartPick,
    handleAutoPickToggle,
    handleReadRules,
    handleStartPlaying,
    handleRulesUnderstood,
    handleRulesClose,
    handleCountdownComplete,
    handleViewResults,
    handleBackToDraws,
    handlePriorityListClick,
    handlePriorityEditClose,
    handlePaginationChange,
    handleAddPart,
    handleRemovePart,
    handleSave,
    handleSelectAll,
    handleClearAll,

    // Parts data
    allParts,
    isPartsLoading,
    isLoadingMore,
    hasMore,
    partsError,
    isCurrentUserTurn,
    lastElementRef,
    totalPartsCount,

    // DraftQueue refs
    scrollContainerRef,
    currentDrafterRef,

    // PriorityListViewDialog data
    priorityViewData,
    isPriorityViewLoading,
    priorityViewError,
    hasValidPurchaseId,

    // Refs
    socketRef,
  } = useLiveDrawDetails();

  // Loading state
  if (loading || lotteryLoading || !phaseInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden relative">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-gray-300">Connecting to live draw...</p>
        </div>
      </div>
    );
  }

  // Connection error state
  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-5 overflow-hidden relative">
        <AnimatedBackground />
        <div className="relative z-10 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">
            Connection Lost
          </h2>
          <p className="text-gray-300 mb-6">
            Unable to connect to the live draw. Please check your internet
            connection and try again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="destructive"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={handleBackToDraws}>
              Back to Draws
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Admin Controls - Positioned in front of all phases */}
      {isAdmin && (
        <AdminControls
          phase={phase}
          allReady={allReady}
          onStartDraft={handleStartDraft}
          starting={isStartingDraft}
        />
      )}

      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <WelcomeScreen
            key="welcome"
            onReadRules={handleReadRules}
            onStartPlaying={handleStartPlaying}
            isLoggedIn={Boolean(currentUser?._id)}
          />
        )}

        {phase === "lobby" && (
          <LobbyGrid
            key="lobby"
            tickets={animatedTickets}
            currentUser={currentUser}
            isShuffling={isShuffling || isAnimating}
            onToggleReady={handleToggleReady}
            countdown={countdown}
            onCountdownComplete={handleCountdownComplete}
            uniqueUsers={uniqueUsers}
            readyUsers={readyUsers}
          />
        )}

        {phase === "playroom" && (
          <PlayroomScreen
            key="playroom"
            lotteryData={lotteryData?.lottery}
            tickets={tickets}
            currentDrafter={currentDrafter}
            countdown={draftCountdown}
            pickHistory={pickHistory}
            pickedParts={pickedParts}
            currentRound={currentRound}
            currentPick={currentPick}
            onPartPick={handlePartPick}
            socketRef={socketRef}
            onAutoPickToggle={handleAutoPickToggle}
            autoPickStatus={autoPickStatus}
            // Priority list props
            priorityViewOpen={priorityViewOpen}
            priorityEditOpen={priorityEditOpen}
            selectedParts={selectedParts}
            saving={saving}
            selectAllLoading={selectAllLoading}
            isSelectAllMode={isSelectAllMode}
            paginationParams={paginationParams}
            priorityListData={priorityListData}
            isPriorityLoading={isPriorityLoading}
            availablePriorityParts={availablePriorityParts}
            priorityListStats={priorityListStats}
            userPurchaseId={userPurchaseId}
            onPriorityListClick={handlePriorityListClick}
            onPriorityEditClose={handlePriorityEditClose}
            onPaginationChange={handlePaginationChange}
            onAddPart={handleAddPart}
            onRemovePart={handleRemovePart}
            onSave={handleSave}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
            // Additional props needed
            currentUser={currentUser}
            sortedQueue={sortedQueue}
            rulesOpen={rulesOpen}
            setRulesOpen={setRulesOpen}
            setPriorityViewOpen={setPriorityViewOpen}
            // Parts data props
            allParts={allParts}
            isPartsLoading={isPartsLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            partsError={partsError}
            lastElementRef={lastElementRef}
            isCurrentUserTurn={isCurrentUserTurn}
            availableParts={availableParts}
            totalPartsCount={totalPartsCount}
            // DraftQueue refs
            scrollContainerRef={scrollContainerRef}
            currentDrafterRef={currentDrafterRef}
            // PriorityListViewDialog data
            priorityViewData={priorityViewData}
            isPriorityViewLoading={isPriorityViewLoading}
            priorityViewError={priorityViewError}
            hasValidPurchaseId={hasValidPurchaseId}
          />
        )}

        {phase === "completed" && (
          <DraftCompletionScreen
            key="completed"
            pickHistory={pickHistory}
            lotteryData={lotteryData?.lottery}
            onViewResults={handleViewResults}
            onBackToDraws={handleBackToDraws}
          />
        )}
      </AnimatePresence>

      <RulesDialog
        open={rulesOpen}
        onClose={handleRulesClose}
        onUnderstand={handleRulesUnderstood}
      />
    </div>
  );
};

export default LiveDrawDetails;
