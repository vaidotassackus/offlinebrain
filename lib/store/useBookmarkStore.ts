import { create } from 'zustand';
import type { SQLiteDatabase } from 'expo-sqlite';
import { getBookmarks, toggleBookmark } from '../db/bookmarks';

interface BookmarkState {
  bookmarkedIds: Set<string>;
  loadBookmarks: (db: SQLiteDatabase) => Promise<void>;
  toggle: (db: SQLiteDatabase, articleId: string) => Promise<void>;
  isBookmarked: (articleId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedIds: new Set<string>(),

  loadBookmarks: async (db) => {
    const rows = await getBookmarks(db);
    set({ bookmarkedIds: new Set(rows.map((r) => r.id)) });
  },

  toggle: async (db, articleId) => {
    const isNowBookmarked = await toggleBookmark(db, articleId);
    set((state) => {
      const next = new Set(state.bookmarkedIds);
      if (isNowBookmarked) {
        next.add(articleId);
      } else {
        next.delete(articleId);
      }
      return { bookmarkedIds: next };
    });
  },

  isBookmarked: (articleId) => get().bookmarkedIds.has(articleId),
}));
