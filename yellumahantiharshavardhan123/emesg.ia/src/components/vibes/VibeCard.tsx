import type { Vibe, Profile } from '@/utils/types'

export default function VibeCard({ vibe, user }: { vibe: Vibe; user: Profile | null }) {
  const isImage = vibe.content_url && /(png|jpg|jpeg|gif|webp)$/i.test(vibe.content_url)
  const isVideo = vibe.content_url && /(mp4|webm|ogg)$/i.test(vibe.content_url)
  return (
    <div className="glass p-3 mb-3">
      <div className="text-sm mb-2 opacity-80">{user?.name ?? 'User'}</div>
      {vibe.content_url ? (
        <div>
          {isImage && <img src={vibe.content_url} className="rounded-lg" />}
          {isVideo && (
            <video controls className="rounded-lg">
              <source src={vibe.content_url} />
            </video>
          )}
        </div>
      ) : null}
      {vibe.caption && <div className="mt-2 text-sm">{vibe.caption}</div>}
    </div>
  )
}
