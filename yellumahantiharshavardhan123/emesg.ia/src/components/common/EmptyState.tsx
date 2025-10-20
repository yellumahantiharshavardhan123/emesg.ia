export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-6 text-center opacity-70">
      <div className="text-sm font-medium">{title}</div>
      {subtitle && <div className="text-xs mt-1">{subtitle}</div>}
    </div>
  )
}
