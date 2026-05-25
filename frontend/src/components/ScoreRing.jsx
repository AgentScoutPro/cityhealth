import { useEffect, useRef } from 'react'

const RADIUS = 50
const CIRC = 2 * Math.PI * RADIUS

export default function ScoreRing({ score, label }) {
  const ringRef = useRef(null)

  useEffect(() => {
    if (!ringRef.current) return
    const offset = CIRC - (score / 100) * CIRC
    ringRef.current.style.strokeDashoffset = offset
  }, [score])

  const color = score >= 70 ? 'var(--color-success)'
              : score >= 50 ? 'var(--color-warning)'
              : 'var(--color-danger)'

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative w-[120px] h-[120px] mb-3">
        <svg viewBox="0 0 120 120" width="120" height="120" className="-rotate-90">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-warning)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--color-surface2)" strokeWidth="10" />
          <circle
            ref={ringRef}
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[32px] font-black leading-none" style={{ color }}>{score}</span>
          <span className="text-[11px] text-muted mt-0.5">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}
