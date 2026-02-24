'use client'

import { useBookmarkData } from '@/context/BookmarkDataContext'
import { useBookmarkUI } from '@/context/BookmarkUIContext'
import { BookmarkCard } from './BookmarkCard'
import { filterBookmarks, sortBookmarks } from '@/utils/bookmarksUtils'
import { Header } from './Header'
import { EmptyState } from './EmptyState'

export default function BookmarksList() {
  const { bookmarks, loading } = useBookmarkData()
  const { searchQuery, selectedTags, sortBy, showArchived } = useBookmarkUI();

  {/* Data Processing */}
  const filteredBookmarks = filterBookmarks(bookmarks, searchQuery, selectedTags, showArchived);
  const sortedBookmarks = sortBookmarks(filteredBookmarks, sortBy);

  {/* Loading State */}
  if (loading) return <p>Loading...</p>

  {/* Main Layout */}
  return (
     <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <Header />
      
      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {/* Title & Description */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {showArchived ? 'Archived Bookmarks' : 'All Bookmarks'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {sortedBookmarks.length} {sortedBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
              </p>
            </div>

            {/* Bookmarks Grid or Empty State */}
            {sortedBookmarks.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {sortedBookmarks.map(bookmark => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))}
              </div>
            ) : (
              <EmptyState type={
                showArchived ? 'archived' : searchQuery ? 'search' : selectedTags.length > 0 ? 'filter' : 'search'
              } />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}