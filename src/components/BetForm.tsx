import React, { useEffect, useState } from 'react'
import { Bet, BetStatus } from '@/types'

export interface BetFormValues {
  id?: string
  date: string
  game: string
  market: string
  odds: string
  stake: string
  status: BetStatus
  note?: string
}

const emptyForm: BetFormValues = {
  date: new Date().toISOString().slice(0,10),
  game: '',
  market: '',
  odds: '',
  stake: '',
  status: 'pending',
  note: ''
}

export default function BetForm({
  onSubmit,
  editing
}: {
  onSubmit: (bet: Bet) => void
  editing?: Bet | null
}) {
  const [values, setValues] = useState<BetFormValues>(emptyForm)

  useEffect(() => {
    if (editing) {
      setValues({
        id: editing.id,
        date: editing.date,
        game: editing.game,
        market: editing.market,
        odds: String(editing.odds),
        stake: String(editing.stake),
        status: editing.status,
        note: editing.note || ''
      })
    } else {
      setValues(emptyForm)
    }
  }, [editing?.id])

  const odds = Number(values.odds.replace(',', '.')) || 0
  const stake = Number(values.stake.replace(',', '.')) || 0
  const expectedProfit = odds > 1 && stake > 0 ? +(stake * (odds - 1)).toFixed(2) : 0
  const expectedReturn = odds > 0 && stake > 0 ? +(stake * odds).toFixed(2) : 0

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!values.date || !values.game || !values.market || !odds || !stake) return
    const bet: Bet = {
      id: values.id || crypto.randomUUID(),
      date: values.date,
      game: values.game.trim(),
      market: values.market.trim(),
      odds,
      stake,
      status: values.status,
      note: values.note?.trim()
    }
    onSubmit(bet)
    setValues(emptyForm)
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div>
          <label htmlFor="date" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Data</label>
          <input id="date" type="date" className="input" value={values.date} onChange={e => setValues(v => ({...v, date: e.target.value}))} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="game" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Jogo</label>
          <input id="game" type="text" className="input" placeholder="Time A x Time B" value={values.game} onChange={e => setValues(v => ({...v, game: e.target.value}))} />
        </div>
        <div>
          <label htmlFor="market" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Mercado</label>
          <input id="market" type="text" className="input" placeholder="Ex: Over 2.5" value={values.market} onChange={e => setValues(v => ({...v, market: e.target.value}))} />
        </div>
        <div>
          <label htmlFor="odds" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Odds</label>
          <input id="odds" type="number" step="0.01" inputMode="decimal" className="input" value={values.odds} onChange={e => setValues(v => ({...v, odds: e.target.value}))} />
        </div>
        <div>
          <label htmlFor="stake" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Stake</label>
          <input id="stake" type="number" step="0.01" inputMode="decimal" className="input" value={values.stake} onChange={e => setValues(v => ({...v, stake: e.target.value}))} placeholder="Ex: 3,50" />
        </div>
        <div>
          <label htmlFor="expectedProfit" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Lucro esperado</label>
          <input id="expectedProfit" className="input" readOnly value={expectedProfit ? expectedProfit.toFixed(2) : ''} placeholder="Preencha odds e stake" />
        </div>
        <div>
          <label htmlFor="expectedReturn" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Ganho potencial</label>
          <input id="expectedReturn" className="input" readOnly value={expectedReturn ? expectedReturn.toFixed(2) : ''} placeholder="Odds × Stake" />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Status</label>
          <select id="status" className="input" value={values.status} onChange={e => setValues(v => ({...v, status: e.target.value as BetStatus}))}>
            <option value="pending">Pendente</option>
            <option value="won">Ganha</option>
            <option value="lost">Perdida</option>
          </select>
        </div>
        <div className="md:col-span-6">
          <label htmlFor="note" className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Nota</label>
          <input id="note" type="text" className="input" placeholder="Opcional" value={values.note} onChange={e => setValues(v => ({...v, note: e.target.value}))} />
        </div>
        <div className="md:col-span-6 flex gap-2 justify-end">
          <button type="reset" className="btn-secondary" onClick={() => setValues(emptyForm)}>Limpar</button>
          <button type="submit" className="btn">{editing ? 'Salvar alterações' : 'Adicionar aposta'}</button>
        </div>
      </div>
    </form>
  )
}
