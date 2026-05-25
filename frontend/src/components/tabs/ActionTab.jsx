import { useActions } from '../../hooks/useAudit'
import { Loader2, CheckSquare, Square, Clock } from 'lucide-react'

const PHASE_COLORS = ['border-red-500/40', 'border-amber-400/40', 'border-emerald-400/40']
const PHASE_LABELS = ['text-red-400', 'text-amber-400', 'text-emerald-400']

export default function ActionTab() {
  const { phases, loading, toggle } = useActions()

  const totalItems     = phases.reduce((n, p) => n + p.items.length, 0)
  const completedItems = phases.reduce((n, p) => n + p.items.filter(i => i.completed).length, 0)
  const pct = totalItems ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Fix Checklist</h1>
        {!loading && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
            {completedItems}/{totalItems} done · {pct}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!loading && totalItems > 0 && (
        <div className="bg-surface border border-neutral-800 rounded-card px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-muted/60 mb-2">
            <span>Overall progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted text-sm">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-8">
          {phases.map((phase, pi) => (
            <div key={phase.phase}>
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${PHASE_COLORS[pi] || 'border-neutral-800'}`}>
                <span className={`text-[11px] font-black uppercase tracking-widest ${PHASE_LABELS[pi] || 'text-muted'}`}>
                  Phase {phase.phase}
                </span>
                <span className="text-[13px] font-bold text-text">{phase.label}</span>
                <span className="ml-auto text-[10px] text-muted/50">
                  {phase.items.filter(i => i.completed).length}/{phase.items.length} done
                </span>
              </div>

              <div className="space-y-2">
                {phase.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id, !item.completed)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-card border text-left transition-all duration-150
                      ${item.completed
                        ? 'bg-emerald-400/5 border-emerald-400/20 opacity-60'
                        : 'bg-surface border-neutral-800 hover:bg-surface2 hover:border-neutral-700'}
                      shadow-[0_1px_3px_rgba(0,0,0,0.2)]`}
                  >
                    {item.completed
                      ? <CheckSquare size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      : <Square size={15} className="text-muted/40 shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${item.completed ? 'line-through text-muted/50' : 'text-text'}`}>
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-[12px] text-muted/60 mt-0.5 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    {item.effort && (
                      <div className="flex items-center gap-1 shrink-0 text-[10px] text-muted/40">
                        <Clock size={10} />
                        {item.effort}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
