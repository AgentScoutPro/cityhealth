import { useState } from 'react'
import { ChevronDown, ChevronRight, Wrench } from 'lucide-react'

const IMPACT_STYLES = {
  High:   'bg-danger/15 text-danger border border-danger/30',
  Medium: 'bg-warning/15 text-warning border border-warning/30',
  Low:    'bg-caution/15 text-caution border border-caution/30',
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
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${IMPACT_STYLES[issue.impact] || IMPACT_STYLES.Low}`}>
          {issue.impact}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-neutral-800">
          {issue.description && (
            <p className="text-sm text-muted mt-3">{issue.description}</p>
          )}
          {issue.recommendation && (
            <div className="bg-surface2 border border-neutral-800 rounded-card p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Wrench size={11} className="text-accent" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Fix</p>
              </div>
              <p className="text-sm text-text">{issue.recommendation}</p>
            </div>
          )}
          {issue.evidence && (
            <p className="text-[12px] text-muted italic">{issue.evidence}</p>
          )}
        </div>
      )}
    </div>
  )
}
