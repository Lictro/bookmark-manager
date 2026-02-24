'use client'

import { useBookmarkData } from '@/context/BookmarkDataContext'
import { BookmarkCard } from './BookmarkCard'

export default function BookmarksList() {
  const { bookmarks, loading } = useBookmarkData()

  if (loading) return <p>Loading...</p>

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  )
}