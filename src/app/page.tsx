// app/page.tsx 
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BookmarksList from '@/components/BookmarksList'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (!user) return null

  return (
    <main>
      <BookmarksList />
    </main>
  )
}