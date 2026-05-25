import { useMeta } from '../../hooks/useAudit'
import { Loader2, ArrowRight, AlertTriangle } from 'lucide-react'

function CharBadge({ count }) {
  if (!count) return <span className="text-[10px] text-red-400 font-bold">Missing</span>
  const ok = count >= 120 && count <= 160
  return (
    <span className={`text-[10px] font-bold ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>
      {count} chars
    </span>
  )
}

export default function MetaTab() {
  const pages = useMeta()

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Meta Descriptions</h1>
        {pages.length > 0 && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
            {pages.length} pages reviewed
          </span>
        )}
      </div>

      {pages.length === 0 ? (
        <div className="flex items-center gap-2 text-muted text-sm">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map(page => (
            <div key={page.id} className="bg-surface border border-neutral-800 rounded-card overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.3)]">

              {/* URL header */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-800 bg-surface2/40">
                <span className="text-[11px] font-mono text-muted/70 truncate flex-1">{page.url}</span>
              </div>

              <div className="p-4 space-y-3">
                {/* Current */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted/50">Current</span>
                    <CharBadge count={page.current_chars} />
                  </div>
                  <p className={`text-[13px] leading-relaxed px-3 py-2 rounded border ${page.current_desc ? 'text-text/70 bg-surface2 border-neutral-800' : 'text-red-400/70 bg-red-500/5 border-red-500/20 italic'}`}>
                    {page.current_desc ?? 'No meta description — Google will pull random page text'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-muted/30">
                  <div className="flex-1 h-px bg-neutral-800" />
                  <ArrowRight size={12} className="text-emerald-400/50" />
                  <div className="flex-1 h-px bg-neutral-800" />
                </div>

                {/* Suggested */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">Suggested</span>
                    <CharBadge count={page.suggested_chars} />
                  </div>
                  <p className="text-[13px] leading-relaxed text-emerald-400/90 bg-emerald-400/5 border border-emerald-400/15 px-3 py-2 rounded">
                    {page.suggested_desc}
                  </p>
                </div>

                {/* Issues */}
                {page.issues && (
                  <div className="flex items-start gap-2 pt-1">
                    <AlertTriangle size={11} className="text-amber-400/70 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted/60">{page.issues}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
