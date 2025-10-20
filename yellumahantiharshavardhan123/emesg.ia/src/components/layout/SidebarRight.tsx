import VibesFeed from '@/components/vibes/VibesFeed'
import VibeUploader from '@/components/vibes/VibeUploader'

export default function SidebarRight() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-white/10 text-sm font-medium opacity-80">Vibes</div>
      <div className="p-3 border-b border-white/10"><VibeUploader /></div>
      <div className="flex-1 overflow-y-auto p-2">
        <VibesFeed />
      </div>
    </div>
  )
}
