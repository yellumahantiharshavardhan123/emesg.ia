import { useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useStorageUpload } from '@/hooks/useStorageUpload'

export default function MessageComposer({ onSend }: { onSend: (p: { content?: string; media_url?: string }) => Promise<void> }) {
  const { user } = useAuth()
  const { upload } = useStorageUpload()
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)

  const send = async () => {
    const body = text.trim()
    if (body.length === 0) return
    await onSend({ content: body })
    setText('')
  }

  const attach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || !user) return
    setUploading(true)
    try {
      const url = await upload('chat-media', f, user.id)
      await onSend({ media_url: url })
    } finally {
      setUploading(false)
      e.currentTarget.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className={`btn-outline ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
        <Paperclip size={16} />
        <input type="file" className="hidden" onChange={attach} />
      </label>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none" />
      <button onClick={send} className="btn-primary"><Send size={16} /></button>
    </div>
  )
}
