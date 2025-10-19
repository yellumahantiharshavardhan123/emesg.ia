import { Check, CheckCheck, FileText, ImageIcon, PlayCircle } from 'lucide-react'
import { formatTime } from '@/utils/format'

export default function MessageBubble({ message, self }: { message: any; self: boolean }) {
  const isImage = message.media_url && /(png|jpg|jpeg|gif|webp)$/i.test(message.media_url)
  const isVideo = message.media_url && /(mp4|webm|ogg)$/i.test(message.media_url)
  const isDoc = message.media_url && !isImage && !isVideo

  return (
    <div className={`flex ${self ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] px-3 py-2 rounded-2xl border ${self ? 'bg-[#3B82F6]/20 border-[#3B82F6]/30' : 'bg-white/5 border-white/10'}`}>
        {message.content && <div className="whitespace-pre-wrap text-sm">{message.content}</div>}
        {message.media_url && (
          <div className="mt-2">
            {isImage && <img src={message.media_url} className="rounded-lg max-h-64" />}
            {isVideo && (
              <video controls className="rounded-lg max-h-64">
                <source src={message.media_url} />
              </video>
            )}
            {isDoc && (
              <a href={message.media_url} target="_blank" className="flex items-center gap-2 text-sm underline">
                <FileText size={16} /> {message.media_url.split('/').pop()}
              </a>
            )}
          </div>
        )}
        <div className="flex items-center gap-1 justify-end mt-1 text-[10px] opacity-60">
          <span>{formatTime(message.created_at)}</span>
          {typeof message.seen === 'boolean' ? (
            message.seen ? <CheckCheck size={14} /> : <Check size={14} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
