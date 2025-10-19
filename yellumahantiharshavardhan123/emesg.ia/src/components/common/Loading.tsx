export default function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="p-6 text-center opacity-70">{label}</div>
}
