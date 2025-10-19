import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/supabaseClient'
import type { Profile } from '@/utils/types'

export type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) await upsertAndLoadProfile(session.user)
      setLoading(false)
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) await upsertAndLoadProfile(session.user)
      else setProfile(null)
    })

    init()
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const upsertAndLoadProfile = async (u: User) => {
    const name = (u.user_metadata?.full_name || u.user_metadata?.name || '').toString() || null
    const photo = (u.user_metadata?.avatar_url || u.user_metadata?.picture || '').toString() || null

    await supabase.from('profiles').upsert({ id: u.id, name, photo_url: photo }, { onConflict: 'id' })

    const { data } = await supabase.from('profiles').select('*').eq('id', u.id).single()
    setProfile((data as Profile) ?? null)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = useMemo(() => ({ user, session, profile, loading, signInWithGoogle, signOut }), [user, session, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
