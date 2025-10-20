export default function ChatListItem({ title, subtitle, active, onClick }: { title: string; subtitle?: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-3 ${active?'bg-white/5':''}`}>
      <div className="h-9 w-9 rounded-full bg-white/10" />
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        {subtitle && <div className="text-xs opacity-60">{subtitle}</div>}
      </div>
    </button>
  )
}
