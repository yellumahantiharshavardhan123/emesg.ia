import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/supabaseClient'
import { useStorageUpload } from '@/hooks/useStorageUpload'

export default function ProfileEditor() {
  const { user, profile } = useAuth()
  const { upload } = useStorageUpload()

  const [name, setName] = useState(profile?.name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [photo, setPhoto] = useState(profile?.photo_url ?? '')

  useEffect(() => {
    setName(profile?.name ?? '')
    setBio(profile?.bio ?? '')
    setPhoto(profile?.photo_url ?? '')
  }, [profile?.id])

  const onSave = async () => {
    await supabase.from('profiles').update({ name, bio, photo_url: photo }).eq('id', user!.id)
  }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || !user) return
    const url = await upload('chat-media', f, user.id)
    setPhoto(url)
  }

  return (
    <div className="glass p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-20 w-20 rounded-full bg-white/10 shrink-0 overflow-hidden">
          {photo && <img src={photo} className="w-full h-full object-cover" />}
        </div>
        <label className="btn-outline">Change photo<input type="file" className="hidden" onChange={onFile} accept="image/*" /></label>
      </div>
      <div className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" />
      </div>
      <div className="mt-4 flex justify-end"><button className="btn-primary" onClick={onSave}>Save</button></div>
    </div>
  )
}
