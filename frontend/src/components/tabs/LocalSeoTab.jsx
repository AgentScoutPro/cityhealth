import { useIssues } from '../../hooks/useAudit'
import IssueCard from '../IssueCard'
import { Loader2, MapPin } from 'lucide-react'

export default function LocalSeoTab() {
  const { issues, loading } = useIssues('local')

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Local SEO</h1>
        {!loading && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-muted/60 bg-surface border border-neutral-800 rounded-card px-4 py-2.5">
        <MapPin size={11} className="shrink-0" />
        <span>Scope: cityhealthaz.com · 2 locations · Google Business Profile signals</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted text-sm">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
        </div>
      )}
    </div>
  )
}
