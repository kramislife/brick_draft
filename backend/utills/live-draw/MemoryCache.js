class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlMs = 300000) {
    // 5 minutes default
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlMs,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export default MemoryCache;
