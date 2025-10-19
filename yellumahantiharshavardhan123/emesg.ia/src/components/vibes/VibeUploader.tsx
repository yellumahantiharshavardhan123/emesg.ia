import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useStorageUpload } from '@/hooks/useStorageUpload'
import { supabase } from '@/supabaseClient'
import { ImagePlus } from 'lucide-react'

export default function VibeUploader() {
  const { user } = useAuth()
  const { upload } = useStorageUpload()
  const [caption, setCaption] = useState('')

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    const url = await upload('vibes', file, user.id)
    await supabase.from('vibes').insert({ user_id: user.id, content_url: url, caption, expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString() })
    setCaption('')
    e.currentTarget.value = ''
  }

  const onPostText = async () => {
    if (!user || caption.trim().length === 0) return
    await supabase.from('vibes').insert({ user_id: user.id, content_url: null, caption, expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString() })
    setCaption('')
  }

  return (
    <div className="flex items-center gap-2">
      <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Share a vibe…" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
      <label className="btn-outline"><ImagePlus size={16} /><input type="file" className="hidden" onChange={onFile} accept="image/*,video/*" /></label>
      <button className="btn-primary" onClick={onPostText}>Post</button>
    </div>
  )
}
