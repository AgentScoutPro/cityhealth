import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const COLOR_MAP = {
  danger:  'text-danger',
  warning: 'text-warning',
  caution: 'text-caution',
  success: 'text-success',
}

const TREND_STYLES = {
  up:      { color: 'text-emerald-400', bg: 'bg-emerald-400/10', Icon: TrendingUp },
  down:    { color: 'text-red-400',     bg: 'bg-red-400/10',     Icon: TrendingDown },
  neutral: { color: 'text-muted',       bg: 'bg-surface2',       Icon: Minus },
}

export default function MetricCard({ label, value, sub, color, trend, trendDir = 'neutral', icon: Icon }) {
  const trendStyle = TREND_STYLES[trendDir] ?? TREND_STYLES.neutral
  const TrendIcon = trendStyle.Icon

  return (
    <div className="group bg-surface border border-neutral-800 rounded-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.2)] hover:border-neutral-700 hover:shadow-[0_2px_8px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-150">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.9px] text-muted/70 leading-none">{label}</p>
        {Icon && (
          <span className="p-1.5 bg-surface2 border border-neutral-800 rounded-sm group-hover:border-neutral-700 transition-colors">
            <Icon size={11} className="text-muted/50" />
          </span>
        )}
      </div>
      <p className={`text-[34px] font-black leading-none tabular-nums ${COLOR_MAP[color] || 'text-text'}`}>
        {value}
      </p>
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        {trend && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${trendStyle.color} ${trendStyle.bg}`}>
            <TrendIcon size={11} />
            {trend}
          </span>
        )}
        {sub && <p className="text-[11px] text-muted/70">{sub}</p>}
      </div>
    </div>
  )
}
