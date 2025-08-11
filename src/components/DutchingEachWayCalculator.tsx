import React, { useMemo, useState } from 'react'

// Simplified Each-Way: split stake between Win and Place; requires place terms (fractions) and places paid.
function parseNumber(v: string) { return Number(String(v || '').replace(',', '.')) || 0 }

export default function DutchingEachWayCalculator() {
  const [budgetInput, setBudgetInput] = useState('')
  const [oddsInput, setOddsInput] = useState('')
  const [placesPaid, setPlacesPaid] = useState(3)
  const [placeFraction, setPlaceFraction] = useState(0.25) // 1/4 odds by default

  const budget = parseNumber(budgetInput)
  const odds = parseNumber(oddsInput)

  const result = useMemo(() => {
    const half = budget / 2
    const winReturn = half * odds
    const placeOdds = 1 + (odds - 1) * placeFraction
    const placeReturn = half * placeOdds
    return {
      winStake: half,
      placeStake: half,
      winReturn,
      placeReturn,
      winProfit: winReturn + placeReturn - budget,
      placeProfit: placeReturn - budget, // if only placed
      placeTerms: `${Math.round(placeFraction * 100)}%`,
    }
  }, [budget, odds, placeFraction])

  function format(n: number) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-3">Calculadora: Dutching Each-Way (simplificado)</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Divide a aposta em Vencer e Colocar com termos de colocação.</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Banca</label>
          <input className="input w-full" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} inputMode="decimal" placeholder="Ex: 10" />
        </div>
        <div>
          <label className="block text-sm mb-1">Odds decimais</label>
          <input className="input w-full" value={oddsInput} onChange={e => setOddsInput(e.target.value)} inputMode="decimal" placeholder="Ex: 5" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm mb-1">Fração para colocar</label>
          <select className="input w-full" value={placeFraction}
            onChange={e => setPlaceFraction(parseNumber(e.target.value))}>
            <option value={0.5}>1/2</option>
            <option value={0.3333333333}>1/3</option>
            <option value={0.25}>1/4</option>
            <option value={0.2}>1/5</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Lugares pagos</label>
          <input className="input w-full" value={placesPaid} onChange={e => setPlacesPaid(Number(e.target.value) || 1)} inputMode="numeric" />
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <div>Aposta Win: {format(result.winStake)}</div>
        <div>Aposta Place: {format(result.placeStake)} (termos {result.placeTerms})</div>
        <div>Retorno se vencer: {format(result.winReturn)} + {format(result.placeReturn)} = {format(result.winReturn + result.placeReturn)}</div>
        <div>Lucro se vencer: {format(result.winProfit)}</div>
        <div>Retorno se apenas colocar: {format(result.placeReturn)}</div>
        <div>Lucro se apenas colocar: {format(result.placeProfit)}</div>
      </div>

      <div className="mt-4 text-xs text-gray-500">Nota: Regras Each-Way podem variar por casa/mercado. Esta é uma aproximação simples.</div>
    </div>
  )
}
