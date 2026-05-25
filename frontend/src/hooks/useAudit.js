import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

export function useAuditMeta() {
  const [data, setData] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.getAudit(), api.getSummary()])
      .then(([audit, sum]) => { setData(audit); setSummary(sum) })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, summary, loading, error }
}

export function useIssues(category) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getIssues(category)
      .then(setIssues)
      .catch(() => setIssues([]))
      .finally(() => setLoading(false))
  }, [category])

  return { issues, loading }
}

export function usePassing() {
  const [checks, setChecks] = useState([])
  useEffect(() => {
    api.getPassing().then(setChecks).catch(() => setChecks([]))
  }, [])
  return checks
}

export function useSchema() {
  const [types, setTypes] = useState([])
  useEffect(() => {
    api.getSchema().then(setTypes).catch(() => setTypes([]))
  }, [])
  return types
}

export function useMeta() {
  const [pages, setPages] = useState([])
  useEffect(() => {
    api.getMeta().then(setPages).catch(() => setPages([]))
  }, [])
  return pages
}

export function useActions() {
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getActions()
      .then(setPhases)
      .catch(() => setPhases([]))
      .finally(() => setLoading(false))
  }, [])

  const toggle = useCallback(async (itemId, completed) => {
    setPhases(prev => prev.map(phase => ({
      ...phase,
      items: phase.items.map(item =>
        item.id === itemId ? { ...item, completed: completed ? 1 : 0 } : item
      ),
    })))
    try {
      await api.toggleAction(itemId, completed)
    } catch {
      // revert optimistic update on error
      setPhases(prev => prev.map(phase => ({
        ...phase,
        items: phase.items.map(item =>
          item.id === itemId ? { ...item, completed: completed ? 0 : 1 } : item
        ),
      })))
    }
  }, [])

  return { phases, loading, toggle }
}
