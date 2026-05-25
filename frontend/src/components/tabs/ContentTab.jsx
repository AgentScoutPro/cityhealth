import { useIssues } from '../../hooks/useAudit'
import IssueCard from '../IssueCard'
import { Loader2, PenLine } from 'lucide-react'

export default function ContentTab() {
  const { issues, loading } = useIssues('content')

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Content &amp; E-E-A-T</h1>
        {!loading && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
            {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-muted/60 bg-surface border border-neutral-800 rounded-card px-4 py-2.5">
        <PenLine size={11} className="shrink-0" />
        <span>Scope: E-E-A-T signals · blog content · provider credentials · entity consistency</span>
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
