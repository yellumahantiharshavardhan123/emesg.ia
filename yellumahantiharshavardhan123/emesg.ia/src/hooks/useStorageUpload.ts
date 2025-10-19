import { supabase } from '@/supabaseClient'

export function useStorageUpload() {
  const upload = async (bucket: 'chat-media' | 'vibes', file: File, userId: string) => {
    const ext = file.name.split('.').pop() || 'bin'
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }
  return { upload }
}
