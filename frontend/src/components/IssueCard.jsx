import { useState } from 'react'
import { ChevronDown, ChevronRight, Wrench } from 'lucide-react'

const PRIORITY_STYLES = {
  critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  high:     'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  medium:   'bg-amber-400/15 text-amber-400 border border-amber-400/30',
  low:      'bg-neutral-500/15 text-neutral-400 border border-neutral-500/30',
}

export default function IssueCard({ issue }) {
  const [open, setOpen] = useState(false)
  const ChevronIcon = open ? ChevronDown : ChevronRight

  return (
    <div className="bg-surface border border-neutral-800 rounded-card overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
        onClick={() => setOpen(o => !o)}
      >
        <ChevronIcon size={15} className="text-muted shrink-0" />
        <span className="flex-1 text-sm font-semibold">{issue.title}</span>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${PRIORITY_STYLES[issue.priority] || PRIORITY_STYLES.low}`}>
          {issue.priority}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2.5 border-t border-neutral-800">
          {issue.impact && (
            <p className="text-sm text-muted mt-3 leading-relaxed">{issue.impact}</p>
          )}
          {issue.fix && (
            <div className="bg-surface2 border border-neutral-800 rounded-card p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Wrench size={11} className="text-accent" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Fix</p>
              </div>
              <p className="text-sm text-text leading-relaxed">{issue.fix}</p>
            </div>
          )}
          {issue.evidence && (
            <p className="text-[12px] text-muted/70 italic border-l-2 border-neutral-700 pl-3">{issue.evidence}</p>
          )}
        </div>
      )}
    </div>
  )
}
