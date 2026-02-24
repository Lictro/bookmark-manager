// app/page.tsx 
import BookmarksList from '@/components/BookmarksList'

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bookmark Manager</h1>
      <BookmarksList />
    </main>
  )
}