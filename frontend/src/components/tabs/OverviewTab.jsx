import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuditMeta } from '../../hooks/useAudit'
import ScoreRing from '../ScoreRing'
import MetricCard from '../MetricCard'
import {
  Loader2, AlertCircle, AlertTriangle, Globe, CalendarDays,
  ChevronRight, BarChart3, MousePointerClick, Eye, Search,
  FileSearch, CheckCircle2, Link2, Zap, Activity, Shield,
  TrendingUp, TrendingDown, Download,
} from 'lucide-react'

/* ── Static demo data ─────────────────────────────────────────── */
const TRAFFIC_DATA = [
  { month: 'Jun', sessions: 1240 },
  { month: 'Jul', sessions: 1380 },
  { month: 'Aug', sessions: 1290 },
  { month: 'Sep', sessions: 1520 },
  { month: 'Oct', sessions: 1680 },
  { month: 'Nov', sessions: 1590 },
  { month: 'Dec', sessions: 1420 },
  { month: 'Jan', sessions: 1750 },
  { month: 'Feb', sessions: 1920 },
  { month: 'Mar', sessions: 2150 },
  { month: 'Apr', sessions: 2380 },
  { month: 'May', sessions: 2640 },
]

const SNAPSHOT_METRICS = [
  { label: 'Mobile Speed Score', baseline: 41,   current: 78,   unit: '/100', dir: 'up' },
  { label: 'Organic Keywords',   baseline: 112,  current: 289,  unit: '',     dir: 'up' },
  { label: 'Health Score',       baseline: 54,   current: 82,   unit: '/100', dir: 'up' },
  { label: 'Core Web Vitals',    baseline: 'Fail', current: 'Pass', unit: '', dir: 'up' },
  { label: 'Crawl Errors',       baseline: 23,   current: 4,    unit: '',     dir: 'down-good' },
  { label: 'Avg. Position',      baseline: 34.2, current: 18.7, unit: '',     dir: 'up' },
]

/* ── Icon resolver ────────────────────────────────────────────── */
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

/* ── Custom dark tooltip ──────────────────────────────────────── */
function TrafficTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#111', border: '1px solid #262626',
      borderRadius: 8, padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontSize: 10, color: '#737373', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 900, color: '#34d399', lineHeight: 1 }}>
        {payload[0].value.toLocaleString()}
      </p>
      <p style={{ fontSize: 10, color: '#737373', marginTop: 3 }}>organic sessions</p>
    </div>
  )
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

  const scoreBorderCls = data.score >= 70 ? 'border-t-emerald-500' : data.score >= 50 ? 'border-t-amber-500' : 'border-t-red-500'
  const scoreDotCls    = data.score >= 70 ? 'bg-emerald-400'       : data.score >= 50 ? 'bg-amber-400'       : 'bg-red-400'
  const scoreTextCls   = data.score >= 70 ? 'text-emerald-400'     : data.score >= 50 ? 'text-amber-400'     : 'text-red-400'
  const scoreLabel     = data.score >= 70 ? 'Good'                 : data.score >= 50 ? 'Needs Work'         : 'Critical'
  const findingCount   = data.key_findings?.length ?? 0

  const pdfProps = {
    siteUrl:    data.site_url,
    auditDate:  new Date(data.audit_date).toLocaleDateString(),
    score:      data.score,
    scoreLabel,
    findings:   data.key_findings ?? [],
    snapshot:   SNAPSHOT_METRICS,
  }

  const [pdfLoading, setPdfLoading] = useState(false)

  async function handleDownloadPDF() {
    setPdfLoading(true)
    try {
      const [{ pdf }, { ClientReportPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../ClientReportPDF'),
      ])
      const blob = await pdf(<ClientReportPDF {...pdfProps} />).toBlob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `cod3ai-seo-report-${(data.site_url ?? 'report').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setPdfLoading(false)
    }
  }

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
              Audited {new Date(data.audit_date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-neutral-800 shadow-[0_1px_3px_rgba(0,0,0,0.4)] text-[12px] font-semibold ${scoreTextCls}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${scoreDotCls}`} />
          {scoreLabel}
        </div>
      </div>

      {/* ── Snapshot Comparison ──────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.2px] text-muted/60">
          <BarChart3 size={11} />
          Snapshot Comparison
        </div>

        <div className="bg-surface border border-neutral-800 rounded-card overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.2)]">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_100px_100px_72px] items-center px-5 py-3 border-b border-neutral-800 bg-surface2/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted/50">Metric</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted/50 text-right">Baseline</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 text-right">Current</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted/50 text-right">Delta</span>
          </div>

          {/* Rows */}
          {SNAPSHOT_METRICS.map((m, i) => {
            const improved  = m.dir === 'up' || m.dir === 'down-good'
            const DeltaIcon = improved ? TrendingUp : TrendingDown
            const deltaClr  = improved ? 'text-emerald-400' : 'text-red-400'
            const delta = typeof m.current === 'number' && typeof m.baseline === 'number'
              ? (m.dir === 'down-good'
                  ? `−${m.baseline - m.current}`
                  : `+${(m.current - m.baseline % 1 !== 0 ? (m.current - m.baseline).toFixed(1) : m.current - m.baseline)}`)
              : null
            const isLast = i === SNAPSHOT_METRICS.length - 1
            return (
              <div
                key={i}
                className={`grid grid-cols-[1fr_100px_100px_72px] items-center px-5 py-3.5 hover:bg-surface2/40 transition-colors ${!isLast ? 'border-b border-neutral-800/50' : ''}`}
              >
                <span className="text-[13px] text-text/80 font-medium">{m.label}</span>
                <span className="text-[13px] text-muted/55 tabular-nums text-right font-mono">{m.baseline}{m.unit}</span>
                <span className="text-[13px] text-emerald-400 tabular-nums text-right font-bold">{m.current}{m.unit}</span>
                <div className={`flex items-center justify-end gap-1 ${deltaClr}`}>
                  <DeltaIcon size={12} strokeWidth={2.5} />
                  {delta && <span className="text-[11px] font-bold tabular-nums">{delta}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Organic Traffic Trend ────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.2px] text-muted/60">
            <Activity size={11} />
            Organic Traffic Baseline
          </div>
          <span className="text-[10px] text-muted/40">12-mo · cityhealthaz.com</span>
        </div>

        <div className="bg-surface border border-neutral-800 rounded-card pt-5 pr-5 pb-4 pl-2 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.2)]">
          {/* Hero stat above chart */}
          <div className="flex items-baseline gap-2 pl-3 mb-4">
            <span className="text-[28px] font-black text-text tabular-nums leading-none">2,640</span>
            <span className="text-[11px] text-muted/60">sessions / May</span>
            <span className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[11px] font-semibold">
              <TrendingUp size={10} />
              +112.9%
            </span>
          </div>

          <ResponsiveContainer width="100%" height={188}>
            <AreaChart data={TRAFFIC_DATA} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#34d399" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f1f1f"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: '#404040', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                tick={{ fill: '#404040', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={42}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
              />
              <Tooltip
                content={<TrafficTooltip />}
                cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 2' }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#trafficGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#34d399', stroke: '#0a0a0a', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Performance Snapshot ─────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.2px] text-muted/60">
          <BarChart3 size={11} />
          Performance Snapshot
        </div>
        <div className="flex flex-wrap gap-4 items-stretch">
          <div className={`flex flex-col bg-surface border border-neutral-800 border-t-2 ${scoreBorderCls} rounded-card px-6 pt-4 pb-5 shadow-[0_1px_3px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.3)] min-w-[170px]`}>
            <p className="text-[9px] font-black uppercase tracking-[1.4px] text-muted/50 mb-3">Overall Health</p>
            <div className="flex-1 flex items-center justify-center">
              <ScoreRing score={data.score} label={scoreLabel} />
            </div>
          </div>
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
              <div className="flex items-center gap-2 shrink-0 mt-[1px]">
                <span className="text-[9px] font-black tabular-nums text-muted/35 w-4 text-right leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-px h-3.5 bg-neutral-700/70 rounded-full" />
                <AlertTriangle size={13} className="text-amber-400/80" />
              </div>
              <p className="flex-1 text-[13px] leading-snug text-text/85">{f}</p>
              <ChevronRight
                size={13}
                className="text-muted/25 mt-[1px] shrink-0 group-hover:text-muted/60 group-hover:translate-x-0.5 transition-all duration-150"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Download PDF ─────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 pb-6 border-t border-neutral-800/60">
        <div className="space-y-0.5">
          <p className="text-[12px] font-semibold text-text/70">Client-ready PDF report</p>
          <p className="text-[11px] text-muted/50">Baseline vs. current · branded COD3AI layout</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          className={`
            inline-flex items-center gap-2.5 px-4 py-2.5 rounded-card border
            text-[13px] font-semibold transition-all duration-150 select-none
            ${pdfLoading
              ? 'border-neutral-800 bg-surface text-muted/50 cursor-wait'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-pointer hover:bg-emerald-500/18 hover:border-emerald-500/50 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_14px_rgba(52,211,153,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_22px_rgba(52,211,153,0.12)]'}
          `}
        >
          {pdfLoading
            ? <Loader2 size={14} className="animate-spin" />
            : <Download size={14} />}
          {pdfLoading ? 'Generating…' : 'Download Client PDF Report'}
        </button>
      </div>

    </div>
  )
}
