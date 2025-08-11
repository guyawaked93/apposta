import { AppState, Bet } from './types'

const KEY = 'aposta-manager:v1'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { bank: 0, bets: [] }
    const parsed = JSON.parse(raw) as AppState
    // sanitize
    const bets: Bet[] = (parsed.bets || []).map(b => ({
      id: b.id,
      date: b.date,
      game: b.game,
      market: b.market,
      odds: Number(b.odds),
      stake: Number(b.stake),
      status: b.status,
      note: b.note || '',
    }))
    return { bank: Number(parsed.bank || 0), bets }
  } catch {
    return { bank: 0, bets: [] }
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}
