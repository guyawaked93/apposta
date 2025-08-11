import React, { useEffect, useMemo, useState } from 'react'
import BankManager from './components/BankManager'
import BetForm from './components/BetForm'
import BetsTable from './components/BetsTable'
import ImportExport from './components/ImportExport'
import Stats from './components/Stats'
import ThemeToggle from './components/ThemeToggle'
import { AppState, Bet } from './types'
import { loadState, saveState } from './storage'
import Sidebar, { SectionKey } from './components/Sidebar'
import DutchingCalculator from './components/DutchingCalculator'
import DutchingEachWayCalculator from './components/DutchingEachWayCalculator'
import Bookies from './components/Bookies'

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [editing, setEditing] = useState<Bet | null>(null)
  const [filter, setFilter] = useState<'all'|'pending'|'won'|'lost'>('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [section, setSection] = useState<SectionKey>('bets')

  useEffect(() => { saveState(state) }, [state])

  const filtered = useMemo(() => {
    let bets = [...state.bets]
    if (filter !== 'all') bets = bets.filter(b => b.status === filter)
    bets.sort((a,b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
    return bets
  }, [state.bets, filter])

  function upsertBet(bet: Bet) {
    setState((s: AppState) => {
      const exists = s.bets.some((b: Bet) => b.id === bet.id)
      const bets = exists ? s.bets.map((b: Bet) => b.id === bet.id ? bet : b) : [bet, ...s.bets]
      return { ...s, bets }
    })
    setEditing(null)
  }

  function removeBet(id: string) {
    if (!confirm('Excluir aposta?')) return
    setState((s: AppState) => ({ ...s, bets: s.bets.filter((b: Bet) => b.id !== id) }))
  }

  function updateBet(bet: Bet) { setState((s: AppState) => ({ ...s, bets: s.bets.map((b: Bet) => b.id === bet.id ? bet : b) })) }

  function importBets(newBets: Bet[]) {
    if (!newBets.length) return
    const existingKeys = new Set(state.bets.map((b: Bet) => `${b.date}|${b.game}|${b.market}|${b.stake}`))
    const dedup = newBets.filter(b => !existingKeys.has(`${b.date}|${b.game}|${b.market}|${b.stake}`))
    setState((s: AppState) => ({ ...s, bets: [...dedup, ...s.bets] }))
  }

  return (
    <div className="container py-6">
      {/* Sidebar Drawer */}
      <Sidebar open={sidebarOpen} active={section} onClose={() => setSidebarOpen(false)} onSelect={setSection} />

      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div>
            <h1 className="text-2xl font-bold">Gerenciador de Apostas</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Controle banca, apostas, resultados e ROI. Dados ficam no seu navegador.</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid gap-4">
        {section === 'bets' && (
          <>
            <BankManager bank={state.bank} bets={state.bets} onChangeBank={v => setState((s: AppState) => ({ ...s, bank: v }))} />

            <div className="card flex gap-3 items-end">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Filtro</label>
                <select className="input" value={filter} onChange={e => setFilter(e.target.value as any)} aria-label="Filtro de status">
                  <option value="all">Todas</option>
                  <option value="pending">Pendentes</option>
                  <option value="won">Ganhas</option>
                  <option value="lost">Perdidas</option>
                </select>
              </div>
            </div>

            <BetForm onSubmit={upsertBet} editing={editing} />

            <Stats bets={state.bets} />

            <BetsTable
              bets={filtered}
              onUpdate={updateBet}
              onDelete={removeBet}
              onEdit={setEditing}
            />

            <ImportExport bets={state.bets} onImport={importBets} />
          </>
        )}

        {section === 'dutching' && (
          <DutchingCalculator />
        )}

        {section === 'dutchingEW' && (
          <DutchingEachWayCalculator />
        )}

        {section === 'bookies' && (
          <Bookies />
        )}
      </div>
    </div>
  )
}
