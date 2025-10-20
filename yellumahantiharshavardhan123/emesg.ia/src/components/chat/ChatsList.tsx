import type { Chat, Group, Profile } from '@/utils/types'

export default function ChatsList({ chats, groups, active, onSelect }: { chats: (Chat & { other?: Profile | null })[]; groups: Group[]; active?: { type: 'chat'|'group'|null; id?: string|null }; onSelect: (t: 'chat'|'group', id: string) => void }) {
  return (
    <div>
      <div className="px-2 py-3 text-xs uppercase tracking-wide opacity-60">Chats</div>
      {chats.map((c) => (
        <button key={c.id} onClick={() => onSelect('chat', c.id)} className={`w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-3 ${active?.type==='chat'&&active?.id===c.id?'bg-white/5':''}`}>
          <div className="h-9 w-9 rounded-full bg-white/10" />
          <div className="flex-1">
            <div className="text-sm font-medium">{c.other?.name ?? 'User'}</div>
            <div className="text-xs opacity-60">Tap to open</div>
          </div>
        </button>
      ))}
      <div className="px-2 py-3 text-xs uppercase tracking-wide opacity-60">Groups</div>
      {groups.map((g) => (
        <button key={g.id} onClick={() => onSelect('group', g.id)} className={`w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-3 ${active?.type==='group'&&active?.id===g.id?'bg-white/5':''}`}>
          <div className="h-9 w-9 rounded-full bg-white/10" />
          <div className="flex-1">
            <div className="text-sm font-medium">{g.name}</div>
            <div className="text-xs opacity-60">{g.participants.length} members</div>
          </div>
        </button>
      ))}
    </div>
  )
}
