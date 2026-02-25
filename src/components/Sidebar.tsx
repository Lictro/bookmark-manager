import React from 'react';
import { Archive, Bookmark, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { getUniqueTags } from '@/utils/bookmarksUtils';
import { useBookmarkData } from '@/context/BookmarkDataContext';
import { useBookmarkUI } from '@/context/BookmarkUIContext';
import { ScrollArea } from './ui/scroll-area';

export const Sidebar: React.FC = () => {
  const { bookmarks, loading } = useBookmarkData()
  const { selectedTags, setSelectedTags, showArchived, setShowArchived } = useBookmarkUI();

  const allTags = getUniqueTags(bookmarks);

  const toggleTag = (tag: string) => {
    if(selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const activeBookmarksCount = bookmarks.filter(b => !b.is_archived).length;
  const archivedBookmarksCount = bookmarks.filter(b => b.is_archived).length;

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Bookmarks</h2>
        
        <nav className="space-y-1">
          <button
            onClick={() => setShowArchived(false)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              !showArchived
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <Bookmark className="size-4" />
            <span className="flex-1 text-left">All Bookmarks</span>
            <Badge variant="secondary" className="ml-auto">
              {activeBookmarksCount}
            </Badge>
          </button>

          <button
            onClick={() => setShowArchived(true)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              showArchived
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <Archive className="size-4" />
            <span className="flex-1 text-left">Archived</span>
            <Badge variant="secondary" className="ml-auto">
              {archivedBookmarksCount}
            </Badge>
          </button>
        </nav>
      </div>

      <Separator />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Tags</h3>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto py-1 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-2 pb-6">
            {allTags.map(tag => {
              const count = bookmarks.filter(
                b => b.tags.includes(tag) && b.is_archived === showArchived
              ).length;
              const isSelected = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <span className="flex-1 text-left">{tag}</span>
                  <Badge variant={isSelected ? 'default' : 'secondary'} className="ml-auto">
                    {count}
                  </Badge>
                  {isSelected && <X className="size-3" />}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};