import { useSchema } from '../../hooks/useAudit'
import { Loader2, CheckCircle2, XCircle, AlertCircle, Code2 } from 'lucide-react'

const STATUS = {
  present: { Icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', label: 'Present' },
  missing: { Icon: XCircle,      color: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/20',         label: 'Missing' },
  partial: { Icon: AlertCircle,  color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/20',     label: 'Partial' },
}

export default function SchemaTab() {
  const types = useSchema()

  const present = types.filter(t => t.status === 'present').length
  const missing = types.filter(t => t.status === 'missing').length
  const partial = types.filter(t => t.status === 'partial').length

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Schema Markup</h1>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">{present} present</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">{partial} partial</span>
          <span className="px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 border border-red-400/20">{missing} missing</span>
        </div>
      </div>

      {types.length === 0 ? (
        <div className="flex items-center gap-2 text-muted text-sm">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {types.map(type => {
            const cfg = STATUS[type.status] || STATUS.missing
            const { Icon } = cfg
            return (
              <div key={type.id} className="bg-surface border border-neutral-800 rounded-card px-4 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:bg-surface2 transition-colors">
                <div className="flex items-start gap-3">
                  <Icon size={16} className={`${cfg.color} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{type.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted mt-1 leading-relaxed">{type.note}</p>
                  </div>
                  <Code2 size={13} className="text-muted/30 shrink-0 mt-0.5" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
