import React from "react";
import RulesDialog from "./RulesDialog";
import PriorityListDialog from "@/components/ticket-details/PriorityListDialog";
import PriorityListViewDialog from "./PriorityListViewDialog";
import PlayroomHeader from "./PlayroomHeader";
import DraftQueue from "./DraftQueue";
import PartsGrid from "./PartsGrid";
import PickHistory from "./PickHistory";
import AnimatedBackground from "@/components/ui/animated-background";

const PlayroomScreen = ({
  lotteryData,
  tickets = [],
  currentDrafter,
  countdown = 15,
  pickHistory = [],
  pickedParts = [],
  currentRound = 1,
  currentPick = 1,
  onPartPick,
  socketRef,
  onAutoPickToggle,
  autoPickStatus = { currentRound: false, nextRound: false },
  // Priority list props
  priorityViewOpen,
  priorityEditOpen,
  selectedParts,
  saving,
  selectAllLoading,
  isSelectAllMode,
  paginationParams,
  priorityListData,
  isPriorityLoading,
  availablePriorityParts,
  priorityListStats,
  userPurchaseId,
  onPriorityListClick,
  onPriorityEditClose,
  onPaginationChange,
  onAddPart,
  onRemovePart,
  onSave,
  onSelectAll,
  onClearAll,
  // Additional props needed
  currentUser,
  sortedQueue,
  rulesOpen,
  setRulesOpen,
  setPriorityViewOpen,
  // Parts data props
  allParts,
  isPartsLoading,
  isLoadingMore,
  hasMore,
  partsError,
  lastElementRef,
  isCurrentUserTurn,
  availableParts,
  totalPartsCount,
  // DraftQueue refs
  scrollContainerRef,
  currentDrafterRef,
  // PriorityListViewDialog data
  priorityViewData,
  isPriorityViewLoading,
  priorityViewError,
  hasValidPurchaseId,
}) => {
  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <PlayroomHeader
        currentDrafter={currentDrafter}
        countdown={countdown}
        currentUser={currentUser}
        currentRound={currentRound}
        currentPick={currentPick}
        totalTickets={tickets.length}
        onRulesClick={() => setRulesOpen(true)}
        onPriorityListClick={onPriorityListClick}
        userPriorityCount={priorityListStats.userPriorityCount}
        pickedPriorityCount={priorityListStats.pickedPriorityCount}
        showPriorityButton={Boolean(currentUser?._id)}
      />

      {/* Main Content */}
      <div className="relative z-10 p-5 grid grid-cols-12 gap-4">
        {/* Left Sidebar - Draft Queue */}
        <DraftQueue
          sortedQueue={sortedQueue}
          currentDrafter={currentDrafter}
          currentUser={currentUser}
          onAutoPickToggle={onAutoPickToggle}
          autoPickEnabled={autoPickStatus.currentRound}
          autoPickStatus={autoPickStatus}
          scrollContainerRef={scrollContainerRef}
          currentDrafterRef={currentDrafterRef}
          showAutoPickToggle={Boolean(currentUser?._id)}
        />

        {/* Center Content - Parts Grid */}
        <PartsGrid
          lotteryData={lotteryData}
          currentDrafter={currentDrafter}
          currentUser={currentUser}
          onPartPick={onPartPick}
          pickedParts={pickedParts}
          // Parts data props
          allParts={allParts}
          isLoading={isPartsLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={partsError}
          // Infinite scroll props
          lastElementRef={lastElementRef}
          // Computed values
          isCurrentUserTurn={isCurrentUserTurn}
          availableParts={availableParts}
          // Auto-pick status props
          autoPickEnabled={autoPickStatus.currentRound}
          isAutoPicking={false}
          // Guest user prop
          isGuest={!Boolean(currentUser?._id)}
          // Total parts count for display - use actual lottery parts count
          totalParts={totalPartsCount}
        />

        {/* Right Sidebar - Pick History */}
        <PickHistory pickHistory={pickHistory} />
      </div>

      {/* Dialogs */}
      <RulesDialog
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        onUnderstand={() => setRulesOpen(false)}
        showUnderstandButton={false}
      />

      {/* Priority List View Dialog */}
      <PriorityListViewDialog
        open={priorityViewOpen}
        onClose={() => setPriorityViewOpen(false)}
        userPurchaseId={userPurchaseId}
        pickedParts={pickedParts}
        pickHistory={pickHistory}
        priorityData={priorityViewData}
        isLoading={isPriorityViewLoading}
        error={priorityViewError}
        hasValidPurchaseId={hasValidPurchaseId}
        currentUser={currentUser}
      />

      {/* Priority List Edit Dialog */}
      <PriorityListDialog
        open={priorityEditOpen}
        onClose={onPriorityEditClose}
        selectedParts={selectedParts}
        availableParts={availablePriorityParts}
        totalPages={priorityListData?.totalPages || 1}
        currentPage={priorityListData?.page || 1}
        startEntry={priorityListData?.startEntry || 0}
        endEntry={priorityListData?.endEntry || 0}
        data={{
          totalAllParts: priorityListData?.totalParts || 0,
          availableCategories: priorityListData?.availableCategories || [],
          availableColors: priorityListData?.availableColors || [],
        }}
        handleAddPart={onAddPart}
        handleRemovePart={onRemovePart}
        handleSave={onSave}
        handleSelectAll={onSelectAll}
        handleClearAll={onClearAll}
        saving={saving}
        selectAllLoading={selectAllLoading}
        isLoading={isPriorityLoading}
        onParamsChange={onPaginationChange}
        isSelectAllMode={isSelectAllMode}
      />
    </div>
  );
};

export default PlayroomScreen;
