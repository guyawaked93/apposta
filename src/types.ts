export type BetStatus = 'pending' | 'won' | 'lost'

export interface Bet {
  id: string
  date: string // ISO yyyy-mm-dd
  game: string
  market: string
  odds: number
  stake: number
  status: BetStatus
  note?: string
}

export interface AppState {
  bank: number
  bets: Bet[]
}

export function betProfit(b: Bet): number {
  if (b.status === 'won') return (b.odds - 1) * b.stake
  if (b.status === 'lost') return -b.stake
  return 0
}

export function exposure(bets: Bet[]): number {
  return bets.filter(b => b.status === 'pending').reduce((s, b) => s + b.stake, 0)
}

export function realizedProfit(bets: Bet[]): number {
  return bets.filter(b => b.status !== 'pending').reduce((s, b) => s + betProfit(b), 0)
}

export function settledStake(bets: Bet[]): number {
  return bets.filter(b => b.status !== 'pending').reduce((s, b) => s + b.stake, 0)
}

export function winrate(bets: Bet[]): number {
  const settled = bets.filter(b => b.status !== 'pending')
  if (!settled.length) return 0
  const wins = settled.filter(b => b.status === 'won').length
  return (wins / settled.length) * 100
}

export function roi(bets: Bet[]): number {
  const st = settledStake(bets)
  if (!st) return 0
  return (realizedProfit(bets) / st) * 100
}
