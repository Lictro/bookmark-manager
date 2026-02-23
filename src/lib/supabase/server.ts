import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookies()).getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(async ({ name, value, options }) =>
            (await cookies()).set(name, value, options)
          )
        }
      }
    }
  )
}