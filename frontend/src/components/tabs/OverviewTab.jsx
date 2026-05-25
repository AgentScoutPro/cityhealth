import { useAuditMeta } from '../../hooks/useAudit'
import ScoreRing from '../ScoreRing'
import MetricCard from '../MetricCard'
import {
  Loader2,
  AlertCircle,
  AlertTriangle,
  Globe,
  CalendarDays,
  ChevronRight,
  BarChart3,
  MousePointerClick,
  Eye,
  Search,
  FileSearch,
  CheckCircle2,
  Link2,
  Zap,
  Activity,
  Shield,
} from 'lucide-react'

/* ── Icon resolver: matches metric label keywords → Lucide icon ── */
const METRIC_ICON_MAP = [
  ['traffic',     MousePointerClick],
  ['organic',     MousePointerClick],
  ['clicks',      MousePointerClick],
  ['impressions', Eye],
  ['views',       Eye],
  ['keywords',    Search],
  ['ranking',     Search],
  ['pages',       FileSearch],
  ['indexed',     FileSearch],
  ['crawl',       FileSearch],
  ['issues',      AlertCircle],
  ['critical',    AlertCircle],
  ['errors',      AlertCircle],
  ['warnings',    AlertTriangle],
  ['passing',     CheckCircle2],
  ['links',       Link2],
  ['backlinks',   Link2],
  ['speed',       Zap],
  ['performance', Zap],
  ['score',       Activity],
  ['health',      Shield],
]

function resolveIcon(label = '') {
  const key = label.toLowerCase()
  const match = METRIC_ICON_MAP.find(([word]) => key.includes(word))
  return match ? match[1] : BarChart3
}

export default function OverviewTab() {
  const { data, summary, loading, error } = useAuditMeta()

  if (loading) return (
    <div className="flex items-center gap-2 text-muted text-sm pt-2">
      <Loader2 size={15} className="animate-spin" />
      Loading audit data…
    </div>
  )
  if (error) return (
    <div className="flex items-center gap-2 text-danger text-sm pt-2">
      <AlertCircle size={15} />
      Failed to load audit.
    </div>
  )
  if (!data) return null

  /* Score-keyed visual tokens — full class strings so Tailwind JIT picks them up */
  const scoreBorderCls = data.score >= 70 ? 'border-t-emerald-500' : data.score >= 50 ? 'border-t-amber-500'   : 'border-t-red-500'
  const scoreDotCls    = data.score >= 70 ? 'bg-emerald-400'        : data.score >= 50 ? 'bg-amber-400'         : 'bg-red-400'
  const scoreTextCls   = data.score >= 70 ? 'text-emerald-400'      : data.score >= 50 ? 'text-amber-400'       : 'text-red-400'
  const scoreLabel     = data.score >= 70 ? 'Good'                  : data.score >= 50 ? 'Needs Work'           : 'Critical'
  const findingCount   = data.key_findings?.length ?? 0

  return (
    <div className="space-y-10 max-w-5xl">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2.5">
          <h1 className="text-[26px] font-black tracking-tight leading-none">SEO Audit Report</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface border border-neutral-800 rounded-full px-2.5 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              <Globe size={10} className="shrink-0 opacity-60" />
              {data.site_url}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface border border-neutral-800 rounded-full px-2.5 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              <CalendarDays size={10} className="shrink-0 opacity-60" />
              Audited {new Date(data.audited_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Live status pill */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-neutral-800 shadow-[0_1px_3px_rgba(0,0,0,0.4)] text-[12px] font-semibold ${scoreTextCls}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${scoreDotCls}`} />
          {scoreLabel}
        </div>
      </div>

      {/* ── Performance Snapshot ─────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.2px] text-muted/60">
          <BarChart3 size={11} />
          Performance Snapshot
        </div>

        <div className="flex flex-wrap gap-4 items-stretch">

          {/* Score hero card */}
          <div className={`flex flex-col bg-surface border border-neutral-800 border-t-2 ${scoreBorderCls} rounded-card px-6 pt-4 pb-5 shadow-[0_1px_3px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.3)] min-w-[170px]`}>
            <p className="text-[9px] font-black uppercase tracking-[1.4px] text-muted/50 mb-3">Overall Health</p>
            <div className="flex-1 flex items-center justify-center">
              <ScoreRing score={data.score} label={scoreLabel} />
            </div>
          </div>

          {/* Metric grid */}
          <div className="flex-1 grid grid-cols-2 gap-3 min-w-[280px]">
            {summary?.map(m => (
              <MetricCard
                key={m.label}
                label={m.label}
                value={m.value}
                sub={m.sub}
                color={m.color}
                trend={m.trend}
                trendDir={m.trendDir}
                icon={resolveIcon(m.label)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── Key Findings ─────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.2px] text-muted/60">
            <AlertTriangle size={11} />
            Key Findings
          </div>
          {findingCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              {findingCount} {findingCount === 1 ? 'finding' : 'findings'}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {data.key_findings?.map((f, i) => (
            <div
              key={i}
              className="group flex items-start gap-3 bg-surface border border-neutral-800 rounded-card px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:bg-surface2 hover:border-neutral-700 hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all duration-150 cursor-default"
            >
              {/* Index + divider + icon cluster */}
              <div className="flex items-center gap-2 shrink-0 mt-[1px]">
                <span className="text-[9px] font-black tabular-nums text-muted/35 w-4 text-right leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-px h-3.5 bg-neutral-700/70 rounded-full" />
                <AlertTriangle size={13} className="text-amber-400/80" />
              </div>

              {/* Finding text */}
              <p className="flex-1 text-[13px] leading-snug text-text/85">{f}</p>

              {/* Animated chevron */}
              <ChevronRight
                size={13}
                className="text-muted/25 mt-[1px] shrink-0 group-hover:text-muted/60 group-hover:translate-x-0.5 transition-all duration-150"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
