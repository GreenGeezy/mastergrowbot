
/**
 * Simple cache utility for storing and retrieving chat messages
 */
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  conversationId: string;
};

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export class MessageCache {
  private static cache: Map<string, CacheEntry<any>> = new Map();

  static getCacheKey(userId: string, conversationId: string): string {
    return `${userId}:${conversationId}`;
  }

  static get<T>(userId: string, conversationId: string): T | null {
    const key = this.getCacheKey(userId, conversationId);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if cache has expired
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  static set<T>(userId: string, conversationId: string, data: T): void {
    const key = this.getCacheKey(userId, conversationId);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      conversationId
    });
  }

  static invalidate(userId: string, conversationId: string): void {
    const key = this.getCacheKey(userId, conversationId);
    this.cache.delete(key);
  }

  static clearAll(): void {
    this.cache.clear();
  }
}
