import { Bookmark, SortOption } from "@/types/bookmark";
import { formatDistanceToNow } from "date-fns";

export const formatDate = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
  });
};

export const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return '';
  }
};

export function filterBookmarks(
  bookmarks: Bookmark[],
  searchQuery: string,
  selectedTags: string[],
  showArchived: boolean
): Bookmark[] {
  const query = searchQuery.trim().toLowerCase();

  return bookmarks.filter((bookmark) => {
    if (bookmark.is_archived !== showArchived) return false;

    if (query) {
      const matchesSearch =
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    if (selectedTags.length) {
      const bookmarkTags = bookmark.tags ?? [];

      const matchesTags = selectedTags.every((tag) =>
        bookmarkTags.includes(tag)
      );

      if (!matchesTags) return false;
    }

    return true;
  });
}

export function sortBookmarks(
  bookmarks: Bookmark[],
  sortBy: SortOption
): Bookmark[] {
  const sorted = [...bookmarks].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );

      case 'visited':
        return (
          new Date(b.last_visited ?? 0).getTime() -
          new Date(a.last_visited ?? 0).getTime()
        );

      case 'views':
        return b.view_count - a.view_count;

      default:
        return 0;
    }
  });

  const pinned = sorted.filter((b) => b.is_pinned);
  const unpinned = sorted.filter((b) => !b.is_pinned);

  return [...pinned, ...unpinned];
}