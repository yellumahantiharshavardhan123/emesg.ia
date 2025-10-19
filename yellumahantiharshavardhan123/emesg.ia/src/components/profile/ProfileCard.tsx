import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import type { Profile } from '@/utils/types'

export default function ProfileCard({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      setProfile((data as Profile) ?? null)
    }
    load()
  }, [userId])

  if (!profile) return <div className="glass p-6">Loading…</div>

  return (
    <div className="glass p-6">
      <div className="h-20 w-20 rounded-full bg-white/10 mb-4" />
      <div className="text-xl font-semibold">{profile.name ?? 'User'}</div>
      {profile.bio && <div className="opacity-70 mt-2">{profile.bio}</div>}
    </div>
  )
}
