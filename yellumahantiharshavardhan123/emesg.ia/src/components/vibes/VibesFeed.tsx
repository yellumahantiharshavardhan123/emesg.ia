import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import type { Vibe, Profile } from '@/utils/types'
import VibeCard from '@/components/vibes/VibeCard'

export default function VibesFeed() {
  const [items, setItems] = useState<(Vibe & { user?: Profile | null })[]>([])
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('vibes')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
      const vibes = (data as Vibe[]) || []
      const withUsers = await Promise.all(
        vibes.map(async (v) => {
          const { data: u } = await supabase.from('profiles').select('*').eq('id', v.user_id).single()
          return { ...v, user: (u as Profile) ?? null }
        })
      )
      setItems(withUsers)
    }
    load()
  }, [])

  return (
    <div>
      {items.map((v) => (
        <VibeCard key={v.id} vibe={v} user={v.user ?? null} />
      ))}
    </div>
  )
}
