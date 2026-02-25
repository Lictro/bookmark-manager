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
import { useAuth } from "./AuthContext";

interface BookmarkDataContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  addBookmark: (data: {
    title: string;
    description?: string;
    url: string;
    tags: string[];
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
  const { user, loading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    loadBookmarks();
  }, [authLoading, user]);

  const loadBookmarks = async () => {
    setLoading(true); // Start loading
    try {
      if (!user) {
        setBookmarks([]);
        return;
      }

      const { data, error } = await supabase
        .from("bookmarks")
        .select(`
          *,
          bookmark_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((bookmark: any) => ({
        ...bookmark,
        tags:
          bookmark.bookmark_tags?.map(
            (bt: any) => bt.tags?.name
          ) || [],
      }));

      setBookmarks(formatted);
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
    tags: newTags = [],
  }: {
    title: string;
    description?: string;
    url: string;
    tags?: string[];
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    try {
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from("bookmarks")
        .insert({
          title,
          description,
          url,
          user_id: user.id,
        })
        .select()
        .single(); 

      if (bookmarkError || !bookmarkData) throw bookmarkError;

      for (const tagName of newTags) {
        const { data: existingTag } = await supabase
          .from("tags")
          .select("*")
          .eq("name", tagName)
          .maybeSingle();

        let tagId: string;

        if (existingTag) {
          tagId = existingTag.id;
        } else {
          const { data: newTag } = await supabase
            .from("tags")
            .insert({ name: tagName })
            .select()
            .single();
          tagId = newTag.id;
        }
        await supabase.from("bookmark_tags").insert({
          bookmark_id: bookmarkData.id,
          tag_id: tagId,
        });
      }
      const bookmarkWithTags = {
        ...bookmarkData,
        tags: newTags,
      };
      setBookmarks((prev) => [bookmarkWithTags, ...prev]);
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const updateBookmark = async (
    id: string,
    updates: Partial<Bookmark> & { tags?: string[] }
  ) => {
    const { tags: newTags, ...bookmarkFields } = updates;

    try {
      const { error: bookmarkError } = await supabase
        .from("bookmarks")
        .update(bookmarkFields)
        .eq("id", id);

      if (bookmarkError) throw bookmarkError;

      if (newTags) {
        for (const tagName of newTags) {
          const { data: existingTag } = await supabase
            .from("tags")
            .select("*")
            .eq("name", tagName)
            .single();

          if (!existingTag) {
            await supabase.from("tags").insert({ name: tagName });
          }
        }

        await supabase.from("bookmark_tags").delete().eq("bookmark_id", id);

        for (const tagName of newTags) {
          const { data: tag } = await supabase
            .from("tags")
            .select("*")
            .eq("name", tagName)
            .single();

          if (tag) {
            await supabase.from("bookmark_tags").insert({
              bookmark_id: id,
              tag_id: tag.id,
            });
          }
        }
      }

      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...bookmarkFields, tags: newTags || [] } : b))
      );
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
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