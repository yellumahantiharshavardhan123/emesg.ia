import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import type { Chat, Group, Profile } from '@/utils/types'
import { useAuth } from '@/hooks/useAuth'
import { MessageSquare, Users2, Plus, Settings } from 'lucide-react'

export default function SidebarLeft({ onSelect, active }: { onSelect: (t: 'chat' | 'group', id: string) => void; active: { type: 'chat' | 'group' | null; id?: string | null } }) {
  const { user } = useAuth()
  const [chats, setChats] = useState<(Chat & { other?: Profile | null })[]>([])
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: chatData } = await supabase
        .from('chats')
        .select('*')
        .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)
        .order('created_at', { ascending: false })

      const withProfiles = await Promise.all(
        (chatData || []).map(async (c) => {
          const otherId = c.user1_id === user!.id ? c.user2_id : c.user1_id
          const { data: p } = await supabase.from('profiles').select('*').eq('id', otherId).single()
          return { ...c, other: p as Profile }
        })
      )

      setChats(withProfiles)

      const { data: groupsData } = await supabase
        .from('groups')
        .select('*')
        .contains('participants', [user!.id])
        .order('created_at', { ascending: false })
      setGroups((groupsData as Group[]) || [])
    }
    load()
  }, [user?.id])

  const createGroup = async () => {
    const name = prompt('Group name')?.trim()
    if (!name) return
    const { data, error } = await supabase.from('groups').insert({ name, photo: null, created_by: user!.id, participants: [user!.id] }).select('*').single()
    if (!error && data) onSelect('group', data.id)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        <div className="text-sm font-medium opacity-80">Recent</div>
        <button className="btn-outline" onClick={createGroup}><Plus size={16} /> New group</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-3 text-xs uppercase tracking-wide opacity-60">Chats</div>
        {chats.map((c) => (
          <button key={c.id} onClick={() => onSelect('chat', c.id)} className={`w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-3 ${active.type==='chat'&&active.id===c.id?'bg-white/5':''}`}>
            <div className="h-9 w-9 rounded-full bg-white/10" />
            <div className="flex-1">
              <div className="text-sm font-medium flex items-center gap-2"><MessageSquare size={14} /> {c.other?.name ?? 'User'}</div>
              <div className="text-xs opacity-60">Tap to open</div>
            </div>
          </button>
        ))}
        <div className="px-2 py-3 text-xs uppercase tracking-wide opacity-60">Groups</div>
        {groups.map((g) => (
          <div key={g.id} className={`px-3 py-2 hover:bg-white/5 flex items-center gap-3 ${active.type==='group'&&active.id===g.id?'bg-white/5':''}`}>
            <button onClick={() => onSelect('group', g.id)} className="flex-1 text-left flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/10" />
              <div className="flex-1">
                <div className="text-sm font-medium flex items-center gap-2"><Users2 size={14} /> {g.name}</div>
                <div className="text-xs opacity-60">Participants: {g.participants.length}</div>
              </div>
            </button>
            <button className="btn-outline" title="Manage participants" onClick={async () => {
              const input = prompt('Comma-separated user IDs (participants)', g.participants.join(','))
              if (input == null) return
              const arr = input.split(',').map((s) => s.trim()).filter(Boolean)
              await supabase.from('groups').update({ participants: arr }).eq('id', g.id)
              const { data: groupsData } = await supabase
                .from('groups')
                .select('*')
                .contains('participants', [user!.id])
                .order('created_at', { ascending: false })
              setGroups((groupsData as Group[]) || [])
            }}>
              <Settings size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
