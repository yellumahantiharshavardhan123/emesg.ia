import { useEffect, useState } from 'react'
import SidebarLeft from '@/components/layout/SidebarLeft'
import SidebarRight from '@/components/layout/SidebarRight'
import TopBar from '@/components/layout/TopBar'
import ChatInterface from '@/components/chat/ChatInterface'
import { useAuth } from '@/hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()
  const [active, setActive] = useState<{ type: 'chat' | 'group' | null; id?: string | null }>({ type: null, id: null })

  useEffect(() => {
    // default: no chat selected
  }, [])

  return (
    <div className="min-h-screen text-white">
      <TopBar />
      <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)_360px] gap-4 p-4">
        <div className="glass h-[calc(100vh-96px)] overflow-hidden">
          <SidebarLeft onSelect={(t, id) => setActive({ type: t, id })} active={active} />
        </div>
        <div className="glass h-[calc(100vh-96px)]">
          <ChatInterface active={active} currentUserId={user!.id} />
        </div>
        <div className="glass h-[calc(100vh-96px)] overflow-hidden">
          <SidebarRight />
        </div>
      </div>
    </div>
  )
}
