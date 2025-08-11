import React from 'react'
import { Bet } from '@/types'
import { roi, winrate, settledStake } from '@/types'

export default function Stats({ bets }: { bets: Bet[] }) {
  const wr = winrate(bets)
  const r = roi(bets)
  const st = settledStake(bets)
  const settled = bets.filter(b => b.status !== 'pending')
  const totalReturn = settled.reduce((s, b) => s + (b.status === 'won' ? b.stake * b.odds : 0), 0)
  const avgOdds = bets.length ? bets.reduce((s, b) => s + b.odds, 0) / bets.length : 0

  return (
    <div className="card">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Info label="Apostas" value={bets.length.toString()} />
        <Info label="Winrate" value={`${wr.toFixed(1)}%`} />
        <Info label="ROI" value={`${r.toFixed(1)}%`} />
        <Info label="Stake liquidada" value={fmtBRL(st)} />
        <Info label="Retorno total" value={fmtBRL(totalReturn)} />
        <Info label="Odds média" value={avgOdds ? avgOdds.toFixed(2) : '-'} />
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}

function fmtBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}
