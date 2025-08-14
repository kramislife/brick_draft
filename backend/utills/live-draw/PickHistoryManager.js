class PickHistoryManager {
  constructor() {
    this.pickedPartIds = new Set();
    this.pickHistory = [];
    this.partMap = new Map(); // partId -> partData for quick access
  }

  addPick(pick) {
    const partId = pick.part._id.toString();
    this.pickedPartIds.add(partId);
    this.partMap.set(partId, pick.part);
    this.pickHistory.unshift(pick);
  }

  isPartPicked(partId) {
    return this.pickedPartIds.has(partId.toString());
  }

  getPickedPartIds() {
    return Array.from(this.pickedPartIds);
  }

  getPickHistory() {
    return this.pickHistory;
  }

  getPartData(partId) {
    return this.partMap.get(partId.toString());
  }

  getTotalPicks() {
    return this.pickHistory.length;
  }

  clear() {
    this.pickedPartIds.clear();
    this.pickHistory = [];
    this.partMap.clear();
  }
}

export default PickHistoryManager;
