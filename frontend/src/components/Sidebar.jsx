import { NAV } from '../App'

const BADGE_COLOR = {
  red:    'bg-danger text-white',
  orange: 'bg-warning text-white',
  yellow: 'bg-caution text-bg',
  green:  'bg-success text-bg',
}

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="w-[220px] shrink-0 bg-surface border-r border-neutral-800 sticky top-0 h-screen overflow-y-auto flex flex-col">
      {/* COD3AI Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-neutral-800">
        <div className="bg-brand rounded-card px-3 py-2.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(57,255,20,0.08)] to-transparent" />
          <div className="relative">
            <p className="text-[9px] font-bold text-white/60 tracking-wider text-right leading-none mb-1">est 2075</p>
            <p className="font-serif font-black text-[22px] text-white leading-none tracking-tight">
              c<span className="text-accent italic">O</span>d3x
            </p>
            <p className="text-[9px] font-bold tracking-[2px] text-white/75 mt-1">COD3AI.COM</p>
          </div>
        </div>
        <p className="text-[11px] text-muted mt-2.5">SEO Audit · cityhealthaz.com</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-4">
        {NAV.map(section => (
          <div key={section.label}>
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-muted px-2 py-1">
              {section.label}
            </p>
            {section.items.map(item => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-[13px] font-medium
                    transition-all duration-150 text-left
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset
                    ${isActive
                      ? 'bg-accent-dim text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_3px_rgba(0,0,0,0.3)]'
                      : 'text-muted hover:bg-surface2 hover:text-text'}
                  `}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge != null && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${BADGE_COLOR[item.badgeColor] || 'bg-danger text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
