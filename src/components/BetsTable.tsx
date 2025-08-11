import React, { useEffect, useState } from 'react'
import { Bet, BetStatus, betProfit } from '@/types'

interface Props {
  bets: Bet[]
  onUpdate: (bet: Bet) => void
  onDelete: (id: string) => void
  onEdit: (bet: Bet) => void
}

function statusBadge(s: BetStatus) {
  if (s === 'won') return <span data-testid="status-badge" className="badge badge-green">Ganha</span>
  if (s === 'lost') return <span data-testid="status-badge" className="badge badge-red">Perdida</span>
  return <span data-testid="status-badge" className="badge badge-gray">Pendente</span>
}

type SortKey = 'date' | 'game' | 'market' | 'odds' | 'stake' | 'status' | 'profit'

type SortState = { key: SortKey; dir: 'asc' | 'desc' }

function sortBets(bets: Bet[], sort: SortState): Bet[] {
  const sorted = [...bets]
  sorted.sort((a, b) => {
    let av: number | string = ''
    let bv: number | string = ''
    switch (sort.key) {
      case 'date': av = a.date; bv = b.date; break
      case 'game': av = a.game.toLowerCase(); bv = b.game.toLowerCase(); break
      case 'market': av = a.market.toLowerCase(); bv = b.market.toLowerCase(); break
      case 'odds': av = a.odds; bv = b.odds; break
      case 'stake': av = a.stake; bv = b.stake; break
      case 'status': av = a.status; bv = b.status; break
      case 'profit': av = betProfit(a); bv = betProfit(b); break
    }
    if (av < bv) return sort.dir === 'asc' ? -1 : 1
    if (av > bv) return sort.dir === 'asc' ? 1 : -1
    return 0
  })
  return sorted
}

export default function BetsTable({ bets, onUpdate, onDelete, onEdit }: Props) {
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(1)
  const pageSize = 10

  const sorted = sortBets(bets, sort)
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const clampedPage = Math.min(page, pageCount)
  const start = (clampedPage - 1) * pageSize
  const end = Math.min(start + pageSize, sorted.length)
  const visible = sorted.slice(start, end)

  useEffect(() => { setPage(1) }, [sort.key, sort.dir, bets.length])

  function onSort(key: SortKey) {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'date' ? 'desc' : 'asc' })
  }

  function goto(p: number) { setPage(Math.min(Math.max(1, p), pageCount)) }

  return (
    <div className="card overflow-x-auto">
      <table className="table min-w-[900px]">
        <thead className="sticky-th">
          <tr className="text-xs uppercase text-gray-500">
            <th><button className="btn-secondary !py-1 !px-2" onClick={() => onSort('date')}>Data</button></th>
            <th><button className="btn-secondary !py-1 !px-2" onClick={() => onSort('game')}>Jogo</button></th>
            <th><button className="btn-secondary !py-1 !px-2" onClick={() => onSort('market')}>Mercado</button></th>
            <th><button className="btn-secondary !py-1 !px-2" onClick={() => onSort('odds')}>Odds</button></th>
            <th><button className="btn-secondary !py-1 !px-2" onClick={() => onSort('stake')}>Stake</button></th>
            <th><button className="btn-secondary !py-1 !px-2" onClick={() => onSort('profit')}>Lucro</button></th>
            <th><button className="btn-secondary !py-1 !px-2" onClick={() => onSort('status')}>Status</button></th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(b => (
            <tr key={b.id}>
              <td>{new Date(b.date).toLocaleDateString('pt-BR')}</td>
              <td className="whitespace-pre-wrap">{b.game}{b.note ? <div className="text-xs text-gray-500">{b.note}</div> : null}</td>
              <td>{b.market}</td>
              <td>{b.odds.toFixed(2)}</td>
              <td>{fmtBRL(b.stake)}</td>
              <td className={b.status === 'won' ? 'text-green-600' : b.status === 'lost' ? 'text-red-600' : ''}>
                {b.status === 'pending' ? '-' : fmtBRL(betProfit(b))}
              </td>
              <td>{statusBadge(b.status)}</td>
              <td className="text-right">
                <div className="flex flex-wrap gap-2 justify-end">
                  {b.status === 'pending' ? (
                    <>
                      <button className="btn !bg-green-600 hover:!bg-green-700 !text-xs !py-1" onClick={() => onUpdate({ ...b, status: 'won' })}>Ganhou</button>
                      <button className="btn !bg-red-600 hover:!bg-red-700 !text-xs !py-1" onClick={() => onUpdate({ ...b, status: 'lost' })}>Perdeu</button>
                    </>
                  ) : (
                    <select className="input !h-8 !py-0 !text-xs w-28" value={b.status} onChange={e => onUpdate({ ...b, status: e.target.value as BetStatus })}>
                      <option value="pending">Pendente</option>
                      <option value="won">Ganha</option>
                      <option value="lost">Perdida</option>
                    </select>
                  )}
                  <button className="btn-secondary !text-xs !py-1" onClick={() => onEdit(b)}>Editar</button>
                  <button className="btn !bg-red-600 hover:!bg-red-700 !text-xs !py-1" onClick={() => onDelete(b.id)}>Excluir</button>
                </div>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center text-gray-500 py-6">Nenhuma aposta cadastrada</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-500">Mostrando {sorted.length ? start + 1 : 0}–{end} de {sorted.length}</div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary !py-1 !px-2" disabled={clampedPage === 1} onClick={() => goto(1)}>«</button>
          <button className="btn-secondary !py-1 !px-2" disabled={clampedPage === 1} onClick={() => goto(clampedPage - 1)}>Anterior</button>
          <span className="text-sm">Página {clampedPage} de {pageCount}</span>
          <button className="btn-secondary !py-1 !px-2" disabled={clampedPage === pageCount} onClick={() => goto(clampedPage + 1)}>Próxima</button>
          <button className="btn-secondary !py-1 !px-2" disabled={clampedPage === pageCount} onClick={() => goto(pageCount)}>»</button>
        </div>
      </div>
    </div>
  )
}

function fmtBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}
