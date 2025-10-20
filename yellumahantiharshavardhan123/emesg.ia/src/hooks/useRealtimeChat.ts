import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/supabaseClient'
import type { Message, GroupMessage } from '@/utils/types'

export function useRealtimeChat(params: { chatId?: string; groupId?: string; userId: string }) {
  const { chatId, groupId, userId } = params
  const [messages, setMessages] = useState<(Message | GroupMessage)[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    if (chatId) {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })
      setMessages((data as any[]) || [])
    } else if (groupId) {
      const { data } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
      setMessages((data as any[]) || [])
    }
    setLoading(false)
  }, [chatId, groupId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!chatId && !groupId) return
    const channel = supabase.channel(`realtime:${chatId ?? groupId}`)

    if (chatId) {
      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
        const record = payload.new as Message
        if (payload.eventType === 'INSERT') setMessages((prev) => [...prev, record])
        if (payload.eventType === 'UPDATE') setMessages((prev) => prev.map((m: any) => (m.id === record.id ? record : m)))
      })
    } else if (groupId) {
      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'group_messages', filter: `group_id=eq.${groupId}` }, (payload) => {
        const record = payload.new as GroupMessage
        if (payload.eventType === 'INSERT') setMessages((prev) => [...prev, record])
      })
    }

    channel.subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, groupId])

  const send = useCallback(
    async (input: { content?: string; media_url?: string }) => {
      if (chatId) {
        const { error } = await supabase.from('messages').insert({ chat_id: chatId, sender_id: userId, content: input.content ?? null, media_url: input.media_url ?? null })
        if (error) throw error
      } else if (groupId) {
        const { error } = await supabase.from('group_messages').insert({ group_id: groupId, sender_id: userId, content: input.content ?? null, media_url: input.media_url ?? null })
        if (error) throw error
      }
    },
    [chatId, groupId, userId]
  )

  const markSeen = useCallback(async () => {
    if (chatId) {
      await supabase.from('messages').update({ seen: true }).eq('chat_id', chatId).neq('sender_id', userId)
    } else if (groupId) {
      await supabase.from('group_reads').upsert({ group_id: groupId, user_id: userId, last_read_at: new Date().toISOString() })
    }
  }, [chatId, groupId, userId])

  return { messages, loading, send, markSeen }
}
