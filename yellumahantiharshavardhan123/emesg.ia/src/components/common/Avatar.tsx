export default function Avatar({ src, alt, size = 36 }: { src?: string | null; alt?: string | null; size?: number }) {
  const fallback = (alt?.[0] || 'U').toUpperCase()
  return (
    <div className="rounded-full bg-white/10 grid place-items-center overflow-hidden" style={{ width: size, height: size }}>
      {src ? <img src={src} alt={alt || ''} className="w-full h-full object-cover" /> : <span className="text-xs opacity-80">{fallback}</span>}
    </div>
  )
}
