import { Bet, BetStatus } from '@/types'

function escapeCSV(value: string) {
  if (value == null) return ''
  const needsQuotes = /[",\n]/.test(value)
  const v = value.replace(/"/g, '""')
  return needsQuotes ? `"${v}"` : v
}

export function toCSV(bets: Bet[]): string {
  const header = ['date','game','market','odds','stake','status','note']
  const rows = bets.map(b => [
    b.date,
    b.game,
    b.market,
    String(b.odds),
    String(b.stake),
    b.status,
    b.note || ''
  ])
  return [header.join(','), ...rows.map(r => r.map(c => escapeCSV(String(c))).join(','))].join('\n')
}

function splitCSVLine(line: string): string[] {
  const res: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i+1] === '"') { current += '"'; i++ } else { inQuotes = false }
      } else {
        current += ch
      }
    } else {
      if (ch === ',') { res.push(current); current = '' }
      else if (ch === '"') { inQuotes = true }
      else { current += ch }
    }
  }
  res.push(current)
  return res
}

export function fromCSV(csvText: string): Bet[] {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length)
  if (!lines.length) return []
  const header = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase())
  const idx = (name: string) => header.indexOf(name)
  const iDate = idx('date'), iGame = idx('game'), iMarket = idx('market'), iOdds = idx('odds'), iStake = idx('stake'), iStatus = idx('status'), iNote = idx('note')
  const bets: Bet[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i])
    const status = (cols[iStatus] || 'pending').trim().toLowerCase() as BetStatus
    bets.push({
      id: crypto.randomUUID(),
      date: (cols[iDate] || '').trim(),
      game: (cols[iGame] || '').trim(),
      market: (cols[iMarket] || '').trim(),
      odds: Number((cols[iOdds] || '0').replace(',', '.')),
      stake: Number((cols[iStake] || '0').replace(',', '.')),
      status: ['pending','won','lost'].includes(status) ? status : 'pending',
      note: (cols[iNote] || '').trim(),
    })
  }
  return bets
}
