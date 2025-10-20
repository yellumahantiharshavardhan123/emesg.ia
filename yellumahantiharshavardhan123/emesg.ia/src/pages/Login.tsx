import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'
import { LogIn, Phone, Shield } from 'lucide-react'

export default function Login() {
  const { user, signInWithGoogle } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user])

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="glass w-full max-w-md p-8 text-center">
        <div className="mb-6 text-3xl font-semibold tracking-tight">E‑MESG</div>
        <p className="text-white/70 mb-8">Realtime chat with vibes. Sign in to get started.</p>
        <div className="space-y-3">
          <button className="btn-primary w-full justify-center" onClick={signInWithGoogle}>
            <LogIn size={18} /> Continue with Google
          </button>
          <button className="btn-outline w-full justify-center" disabled title="Coming soon">
            <Phone size={18} /> Sign in with phone
          </button>
        </div>
        <div className="mt-6 text-xs text-white/50 flex items-center justify-center gap-2">
          <Shield size={14} /> Powered by Supabase Auth
        </div>
      </div>
    </div>
  )
}
