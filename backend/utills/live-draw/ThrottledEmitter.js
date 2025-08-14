class ThrottledEmitter {
  constructor(io, drawId, delay = 100) {
    this.io = io;
    this.drawId = drawId;
    this.delay = delay;
    this.pendingUpdates = new Map();
    this.timeout = null;
  }

  emit(event, data) {
    this.pendingUpdates.set(event, data);

    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.flush();
      }, this.delay);
    }
  }

  flush() {
    this.pendingUpdates.forEach((data, event) => {
      this.io.to(this.drawId).emit(event, data);
    });
    this.pendingUpdates.clear();
    this.timeout = null;
  }

  // Immediate emission for critical events
  emitImmediate(event, data) {
    this.io.to(this.drawId).emit(event, data);
  }

  // Batch multiple events
  batchEmit(events) {
    events.forEach(({ event, data }) => {
      this.pendingUpdates.set(event, data);
    });

    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.flush();
      }, this.delay);
    }
  }

  // Cleanup
  cleanup() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.pendingUpdates.clear();
  }
}

export default ThrottledEmitter;
