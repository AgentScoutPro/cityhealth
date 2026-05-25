import { MapPin } from 'lucide-react'

export default function LocalSeoTab() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl font-black">Local SEO</h1>
      <div className="flex items-center gap-3 bg-surface border border-neutral-800 rounded-card px-4 py-6 text-muted shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
        <MapPin size={18} className="shrink-0" />
        <p className="text-sm">Local SEO audit results coming soon.</p>
      </div>
    </div>
  )
}
