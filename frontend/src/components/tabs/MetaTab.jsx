import { MessageSquare } from 'lucide-react'

export default function MetaTab() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl font-black">Meta Descriptions</h1>
      <div className="flex items-center gap-3 bg-surface border border-neutral-800 rounded-card px-4 py-6 text-muted shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
        <MessageSquare size={18} className="shrink-0" />
        <p className="text-sm">Meta description audit results coming soon.</p>
      </div>
    </div>
  )
}
