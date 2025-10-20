import { useEffect, useMemo, useRef, useState } from 'react'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import { useAuth } from '@/hooks/useAuth'
import MessageBubble from '@/components/chat/MessageBubble'
import MessageComposer from '@/components/chat/MessageComposer'
import { supabase } from '@/supabaseClient'
import type { GroupRead } from '@/utils/types'

export default function ChatInterface({ active, currentUserId }: { active: { type: 'chat' | 'group' | null; id?: string | null }; currentUserId: string }) {
  const [seenBy, setSeenBy] = useState<number>(0)
  const { messages, send, markSeen } = useRealtimeChat({ chatId: active.type === 'chat' ? active.id! : undefined, groupId: active.type === 'group' ? active.id! : undefined, userId: currentUserId })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => { if (active.id) markSeen() }, [active.id])

  useEffect(() => {
    const computeSeenBy = async () => {
      if (active.type !== 'group' || !active.id || messages.length === 0) { setSeenBy(0); return }
      const lastTs = messages[messages.length - 1]?.created_at
      const { data } = await supabase.from('group_reads').select('*').eq('group_id', active.id)
      const reads = (data as GroupRead[]) || []
      const count = reads.filter((r) => new Date(r.last_read_at).getTime() >= new Date(lastTs).getTime()).length
      setSeenBy(count)
    }
    computeSeenBy()
  }, [messages, active])

  if (!active.type || !active.id) return <div className="h-full grid place-items-center text-white/60">Select a chat or group</div>

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-white/10 text-sm opacity-80">{active.type === 'chat' ? 'Direct chat' : `Group chat • Seen by ${seenBy}`}</div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m: any) => (
          <MessageBubble key={m.id} message={m} self={m.sender_id === currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-white/10 p-3">
        <MessageComposer onSend={send} />
      </div>
    </div>
  )
}
