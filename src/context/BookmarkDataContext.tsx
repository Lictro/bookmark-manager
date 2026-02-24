"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "../types/bookmark";

interface BookmarkDataContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  addBookmark: (data: {
    title: string;
    description?: string;
    url: string;
  }) => Promise<void>;
  updateBookmark: (
    id: string,
    updates: Partial<Bookmark>
  ) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  visitBookmark: (id: string) => Promise<void>;
}

const BookmarkDataContext = createContext<
  BookmarkDataContextType | undefined
>(undefined);

export const useBookmarkData = () => {
  const context = useContext(BookmarkDataContext);
  if (!context) {
    throw new Error("useBookmarkData must be used within BookmarkDataProvider");
  }
  return context;
};

export const BookmarkDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setBookmarks([]);
        return;
      }

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBookmarks(data || []);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async ({
    title,
    description,
    url,
  }: {
    title: string;
    description?: string;
    url: string;
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        description,
        url,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setBookmarks((prev) => [data, ...prev]);
  };

  const updateBookmark = async (
    id: string,
    updates: Partial<Bookmark>
  ) => {
    const { error } = await supabase
      .from("bookmarks")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const togglePin = async (id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    if (!bookmark) return;

    await updateBookmark(id, {
      is_pinned: !bookmark.is_pinned,
    });
  };

  const toggleArchive = async (id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    if (!bookmark) return;

    await updateBookmark(id, {
      is_archived: !bookmark.is_archived,
    });
  };

  const visitBookmark = async (id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    if (!bookmark) return;

    await updateBookmark(id, {
      view_count: bookmark.view_count + 1,
      last_visited: new Date().toISOString(),
    });
  };

  return (
    <BookmarkDataContext.Provider
      value={{
        bookmarks,
        loading,
        addBookmark,
        updateBookmark,
        deleteBookmark,
        togglePin,
        toggleArchive,
        visitBookmark,
      }}
    >
      {children}
    </BookmarkDataContext.Provider>
  );
};