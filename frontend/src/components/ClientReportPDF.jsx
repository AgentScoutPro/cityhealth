import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const C = {
  bg:      '#0a0a0a',
  surface: '#111111',
  border:  '#262626',
  text:    '#ededed',
  muted:   '#737373',
  emerald: '#34d399',
  red:     '#f87171',
  accent:  '#39ff14',
}

const s = StyleSheet.create({
  page:         { backgroundColor: C.bg, padding: 44, fontFamily: 'Helvetica' },

  /* header */
  headerBar:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
                  paddingBottom: 18, marginBottom: 28,
                  borderBottomWidth: 1, borderBottomColor: C.border },
  agencyName:   { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.accent, letterSpacing: 2 },
  agencySub:    { fontSize: 7, color: C.muted, marginTop: 3 },
  reportTitle:  { fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.text, textAlign: 'right' },
  reportMeta:   { fontSize: 8, color: C.muted, marginTop: 4, textAlign: 'right' },

  /* sections */
  section:      { marginBottom: 26 },
  sectionLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.muted,
                  letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },

  /* score row */
  scoreRow:     { flexDirection: 'row', gap: 10 },
  scoreCard:    { width: 110, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
                  borderRadius: 6, padding: 14 },
  scoreNum:     { fontSize: 30, fontFamily: 'Helvetica-Bold', color: C.text, lineHeight: 1 },
  scoreSubLabel:{ fontSize: 7, color: C.muted, marginTop: 4, letterSpacing: 1 },
  scoreDesc:    { flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
                  borderRadius: 6, padding: 14, justifyContent: 'center' },
  scoreDescTxt: { fontSize: 8.5, color: C.muted, lineHeight: 1.7 },

  /* comparison table */
  tableHead:    { flexDirection: 'row', paddingBottom: 7,
                  borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 2 },
  tableRow:     { flexDirection: 'row', paddingVertical: 9,
                  borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  colMetric:    { flex: 2.2, fontSize: 8.5, color: C.muted },
  colBaseline:  { flex: 1, fontSize: 9, color: C.muted, textAlign: 'right',
                  fontFamily: 'Helvetica-Bold' },
  colCurrent:   { flex: 1, fontSize: 9, color: C.emerald, textAlign: 'right',
                  fontFamily: 'Helvetica-Bold' },
  colDelta:     { flex: 0.9, fontSize: 8, textAlign: 'right' },
  headTxt:      { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.muted, letterSpacing: 0.8 },

  /* findings */
  findingRow:   { flexDirection: 'row', gap: 8, marginBottom: 9, alignItems: 'flex-start' },
  findingIdx:   { fontSize: 7, color: C.muted, width: 18, textAlign: 'right', marginTop: 1 },
  findingBar:   { width: 2, borderRadius: 1, backgroundColor: '#d97706', marginTop: 1 },
  findingTxt:   { flex: 1, fontSize: 8.5, color: C.text, lineHeight: 1.6 },

  /* footer */
  footer:       { position: 'absolute', bottom: 28, left: 44, right: 44,
                  flexDirection: 'row', justifyContent: 'space-between',
                  borderTopWidth: 1, borderTopColor: C.border, paddingTop: 8 },
  footerTxt:    { fontSize: 7, color: C.muted },
})

export function ClientReportPDF({ siteUrl, auditDate, score, scoreLabel, findings = [], snapshot = [] }) {
  return (
    <Document title={`SEO Report — ${siteUrl}`} author="COD3AI" creator="COD3AI.COM">
      <Page size="A4" style={s.page}>

        {/* ── Agency header ───────────────────────────────── */}
        <View style={s.headerBar}>
          <View>
            <Text style={s.agencyName}>COD3AI.COM</Text>
            <Text style={s.agencySub}>Digital Growth Agency</Text>
          </View>
          <View>
            <Text style={s.reportTitle}>SEO Audit Report</Text>
            <Text style={s.reportMeta}>{siteUrl}  ·  {auditDate}</Text>
          </View>
        </View>

        {/* ── Overall score ────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Overall Performance</Text>
          <View style={s.scoreRow}>
            <View style={s.scoreCard}>
              <Text style={s.scoreNum}>{score}</Text>
              <Text style={s.scoreSubLabel}>HEALTH SCORE</Text>
              <Text style={[s.scoreSubLabel, { color: C.emerald, marginTop: 6 }]}>{scoreLabel.toUpperCase()}</Text>
            </View>
            <View style={s.scoreDesc}>
              <Text style={s.scoreDescTxt}>
                This report compares {siteUrl}'s original audit baseline against current
                implemented improvements. Green values reflect measurable gains following
                the recommended fixes delivered by COD3AI. All metrics are sourced from
                live site analysis conducted on {auditDate}.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Snapshot comparison table ────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Baseline vs. Current — Snapshot Comparison</Text>
          <View style={s.tableHead}>
            <Text style={[s.colMetric,   s.headTxt]}>METRIC</Text>
            <Text style={[s.colBaseline, s.headTxt]}>BASELINE</Text>
            <Text style={[s.colCurrent,  s.headTxt, { color: C.emerald }]}>CURRENT</Text>
            <Text style={[s.colDelta,    s.headTxt]}>CHANGE</Text>
          </View>
          {snapshot.map((row, i) => {
            const improved   = row.dir === 'up' || row.dir === 'down-good'
            const deltaColor = improved ? C.emerald : C.red
            const delta = typeof row.current === 'number' && typeof row.baseline === 'number'
              ? (row.dir === 'down-good'
                  ? `−${row.baseline - row.current}`
                  : `+${(row.current - row.baseline).toFixed(row.current % 1 !== 0 ? 1 : 0)}`)
              : (improved ? '✓' : '↓')
            return (
              <View key={i} style={s.tableRow}>
                <Text style={s.colMetric}>{row.label}</Text>
                <Text style={s.colBaseline}>{row.baseline}{row.unit}</Text>
                <Text style={[s.colCurrent, { color: improved ? C.emerald : C.red }]}>
                  {row.current}{row.unit}
                </Text>
                <Text style={[s.colDelta, { color: deltaColor, fontFamily: 'Helvetica-Bold' }]}>
                  {delta}
                </Text>
              </View>
            )
          })}
        </View>

        {/* ── Key findings ─────────────────────────────────── */}
        {findings.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Key Findings</Text>
            {findings.slice(0, 8).map((f, i) => (
              <View key={i} style={s.findingRow}>
                <Text style={s.findingIdx}>{String(i + 1).padStart(2, '0')}</Text>
                <View style={[s.findingBar, { height: 10 }]} />
                <Text style={s.findingTxt}>{f}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Footer ───────────────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>COD3AI.COM — Confidential Client Report</Text>
          <Text style={s.footerTxt}>{auditDate}</Text>
        </View>

      </Page>
    </Document>
  )
}
