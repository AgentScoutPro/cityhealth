import { useState, Component } from 'react'

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-muted gap-3">
        <p className="text-sm font-semibold text-red-400">Something went wrong</p>
        <p className="text-xs text-muted/60 max-w-sm text-center">{this.state.error?.message}</p>
        <button onClick={() => this.setState({ error: null })} className="text-xs px-3 py-1.5 rounded border border-neutral-800 hover:bg-surface mt-2">
          Retry
        </button>
      </div>
    )
    return this.props.children
  }
}
import {
  LayoutDashboard,
  Settings2,
  FileText,
  MapPin,
  Code2,
  PenLine,
  MessageSquare,
  ListChecks,
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import OverviewTab from './components/tabs/OverviewTab'
import TechnicalTab from './components/tabs/TechnicalTab'
import OnPageTab from './components/tabs/OnPageTab'
import LocalSeoTab from './components/tabs/LocalSeoTab'
import SchemaTab from './components/tabs/SchemaTab'
import ContentTab from './components/tabs/ContentTab'
import MetaTab from './components/tabs/MetaTab'
import ActionTab from './components/tabs/ActionTab'

export const NAV = [
  {
    label: 'Overview',
    items: [
      { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Audit Sections',
    items: [
      { id: 'technical', icon: Settings2,    label: 'Technical SEO',     badge: 4, badgeColor: 'orange' },
      { id: 'onpage',    icon: FileText,      label: 'On-Page SEO',       badge: 3, badgeColor: 'orange' },
      { id: 'local',     icon: MapPin,        label: 'Local SEO',         badge: 3, badgeColor: 'red'    },
      { id: 'schema',    icon: Code2,         label: 'Schema Markup',     badge: 2, badgeColor: 'red'    },
      { id: 'content',   icon: PenLine,       label: 'Content & E-E-A-T', badge: 3, badgeColor: 'yellow' },
      { id: 'meta',      icon: MessageSquare, label: 'Meta Descriptions', badge: 4, badgeColor: 'yellow' },
    ],
  },
  {
    label: 'Action Plan',
    items: [
      { id: 'actions', icon: ListChecks, label: 'Fix Checklist' },
    ],
  },
]

const TAB_COMPONENTS = {
  overview:  OverviewTab,
  technical: TechnicalTab,
  onpage:    OnPageTab,
  local:     LocalSeoTab,
  schema:    SchemaTab,
  content:   ContentTab,
  meta:      MetaTab,
  actions:   ActionTab,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const TabComponent = TAB_COMPONENTS[activeTab] || OverviewTab

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-bg text-text">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary>
            <TabComponent />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  )
}
