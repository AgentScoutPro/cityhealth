import { useIssues, usePassing } from '../../hooks/useAudit'
import IssueCard from '../IssueCard'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function TechnicalTab() {
  const { issues, loading } = useIssues('technical')
  const passing = usePassing()
  const techPassing = passing.filter(p => p.category === 'technical')

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl font-black">Technical SEO</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-muted text-sm">
          <Loader2 size={15} className="animate-spin" />
          Loading…
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
        </div>
      )}

      {techPassing.length > 0 && (
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-muted mb-3">Passing Checks</h2>
          <div className="space-y-1.5">
            {techPassing.map(p => (
              <div key={p.id} className="flex items-center gap-2.5 bg-surface border border-neutral-800 rounded-card px-4 py-2.5 hover:bg-surface2 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <CheckCircle2 size={15} className="text-success shrink-0" />
                <span className="text-sm">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
