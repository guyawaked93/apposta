import React, { useMemo, useState } from 'react'

interface Runner { id: string; odds: number }

function parseNumber(v: string) {
  if (!v) return 0
  return Number(String(v).replace(',', '.')) || 0
}

export default function DutchingCalculator() {
  const [budgetInput, setBudgetInput] = useState('')
  const [runners, setRunners] = useState<Runner[]>([
    { id: crypto.randomUUID(), odds: 0 },
    { id: crypto.randomUUID(), odds: 0 },
  ])

  const budget = parseNumber(budgetInput)

  const totals = useMemo(() => {
    const inv = runners.map(r => (r.odds > 0 ? 1 / r.odds : 0))
    const sumInv = inv.reduce((a, b) => a + b, 0)
    const stakes = runners.map((r, i) => (sumInv > 0 ? (inv[i] / sumInv) * budget : 0))
    const returns = runners.map((r, i) => stakes[i] * r.odds)
    const profit = returns.map((ret) => ret - budget)
    return { stakes, returns, profit, sumInv }
  }, [runners, budget])

  function addRunner() { setRunners(rs => [...rs, { id: crypto.randomUUID(), odds: 0 }]) }
  function removeRunner(id: string) { setRunners(rs => rs.length > 2 ? rs.filter(r => r.id !== id) : rs) }
  function updateOdds(id: string, v: string) {
    const odds = parseNumber(v)
    setRunners(rs => rs.map(r => r.id === id ? { ...r, odds } : r))
  }

  function format(n: number) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-3">Calculadora: Dutching</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Divida sua aposta entre múltiplos resultados para retorno igual, baseado nas odds decimais.</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Banca para dividir</label>
          <input className="input w-full" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} placeholder="Ex: 10" inputMode="decimal" />
        </div>
        <div className="self-end text-sm">
          <div>Somatório 1/odds: {totals.sumInv ? totals.sumInv.toFixed(4) : '-'}</div>
          {budget > 0 && totals.sumInv > 0 && (
            <div className="text-gray-600 dark:text-gray-300">Retorno esperado em qualquer vencedor: {format(totals.returns[0] || 0)}</div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {runners.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2">
            <div className="w-24 text-sm text-gray-600">Corredor {i + 1}</div>
            <input className="input flex-1" placeholder="Odds" value={r.odds || ''}
              onChange={e => updateOdds(r.id, e.target.value)} inputMode="decimal" />
            <div className="w-40 text-sm">Aposta: {format(totals.stakes[i] || 0)}</div>
            <div className="w-40 text-sm">Retorno: {format(totals.returns[i] || 0)}</div>
            <button className="btn btn-ghost" onClick={() => removeRunner(r.id)} aria-label={`Remover corredor ${i + 1}`}>−</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="btn" onClick={addRunner}>Adicionar corredor</button>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Exemplo: odds 12 e 4 com R$ 10 resultam em apostas ~R$ 2,50 e ~R$ 7,50 e retorno ~R$ 30, como na explicação.
      </div>
    </div>
  )
}
