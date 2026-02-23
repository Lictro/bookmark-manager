// app/page.tsx (o donde esté)
import { createServerSupabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import data from '@/data/data.json'

export default async function Home() {
  const supabase = createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar si hay bookmarks
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('*')

  if (!existing || existing.length === 0) {
    await supabase.from('bookmarks').insert(
      data.map((item) => ({
        ...item,
      }))
    )
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Bookmark Manager
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookmarks?.map((bookmark: any) => (
          <div
            key={bookmark.id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold">
              {bookmark.title}
            </h2>
            <p className="text-sm text-gray-600">
              {bookmark.description}
            </p>
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
    </main>
  )
}