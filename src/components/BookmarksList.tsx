'use client'

import { useBookmarkData } from '@/context/BookmarkDataContext'

export default function BookmarksList() {
  const { bookmarks, loading } = useBookmarkData()

  if (loading) return <p>Loading...</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="border p-4 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="font-semibold">{bookmark.title}</h2>
          <p className="text-sm text-gray-600">{bookmark.description}</p>
          <a
            href={bookmark.url}
            target="_blank"
            className="text-blue-500 text-sm"
          >
            Visit
          </a>
        </div>
      ))}
    </div>
  )
}