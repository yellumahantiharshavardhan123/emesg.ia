import { useAuth } from '@/hooks/useAuth'
import { LogOut, UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopBar() {
  const { profile, signOut } = useAuth()
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Link to="/dashboard" className="text-lg font-semibold">E‑MESG</Link>
      <div className="flex items-center gap-3">
        <Link to="/profile" className="btn-outline"><UserCircle2 size={18} /> {profile?.name ?? 'Profile'}</Link>
        <button onClick={signOut} className="btn-outline"><LogOut size={18} /> Sign out</button>
      </div>
    </div>
  )
}
