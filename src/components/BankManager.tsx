import React, { useState } from 'react'
import { Bet } from '@/types'
import { exposure, realizedProfit } from '@/types'

interface Props {
  bank: number
  bets: Bet[]
  onChangeBank: (v: number) => void
}

export default function BankManager({ bank, bets, onChangeBank }: Props) {
  const profit = realizedProfit(bets)
  const exp = exposure(bets)
  const balance = bank + profit
  const available = Math.max(balance - exp, 0)

  const [delta, setDelta] = useState<string>('')

  function handleBankChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(',', '.')
    const v = raw === '' ? NaN : Number(raw)
    onChangeBank(Number.isFinite(v) ? v : 0)
  }

  function parseDelta(): number | null {
    const v = delta.replace(',', '.')
    if (v.trim() === '') return null
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : null
  }

  function deposit() {
    const n = parseDelta()
    if (n == null) return
    onChangeBank(bank + n)
    setDelta('')
  }

  function withdraw() {
    const n = parseDelta()
    if (n == null) return
    const next = Math.max(0, bank - n)
    onChangeBank(next)
    setDelta('')
  }

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Banca inicial</label>
          <div className="flex flex-wrap gap-2 items-end">
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              className="input"
              value={Number.isFinite(bank) && bank !== 0 ? bank : '' as any}
              onChange={handleBankChange}
              placeholder="0,00"
            />
            <button className="btn-secondary" onClick={() => onChangeBank(0)}>Zerar</button>
            <div className="flex items-end gap-2">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Aporte/Retirada</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  className="input"
                  value={delta}
                  onChange={e => setDelta(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" aria-label="Aportar na banca" title="Aportar na banca" className="btn-secondary" onClick={deposit}>+ Aportar</button>
                <button type="button" aria-label="Retirar da banca" title="Retirar da banca" className="btn-secondary" onClick={withdraw}>- Retirar</button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          <Metric label="Lucro Realizado" value={profit} color={profit >= 0 ? 'green' : 'red'} />
          <Metric label="Exposição" value={exp} color="gray" />
          <Metric label="Saldo" value={balance} color={balance >= 0 ? 'green' : 'red'} />
          <Metric label="Disponível" value={available} color="gray" />
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, color }: { label: string, value: number, color: 'green'|'red'|'gray' }) {
  const f = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
  const colorCls = color === 'green' ? 'text-green-600 dark:text-green-400' : color === 'red' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
  return (
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className={`font-semibold ${colorCls}`}>{f}</div>
    </div>
  )
}
