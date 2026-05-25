const BASE = '/api'
const AUDIT_ID = 1

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

async function patch(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  getAudit:   () => get(`/audit/${AUDIT_ID}`),
  getSummary: () => get(`/audit/${AUDIT_ID}/summary`),
  getIssues:  (category) => get(`/audit/${AUDIT_ID}/issues${category ? `?category=${category}` : ''}`),
  getPassing: () => get(`/audit/${AUDIT_ID}/passing`),
  getSchema:  () => get(`/audit/${AUDIT_ID}/schema`),
  getMeta:    () => get(`/audit/${AUDIT_ID}/meta`),
  getActions: () => get(`/audit/${AUDIT_ID}/actions`),
  toggleAction: (id, completed) => patch(`/actions/${id}`, { completed }),
}
