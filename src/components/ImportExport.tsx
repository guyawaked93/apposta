import React, { useRef } from 'react'
import { Bet } from '@/types'
import { toCSV, fromCSV } from '@/utils/csv'

export default function ImportExport({ bets, onImport }: { bets: Bet[]; onImport: (bets: Bet[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  function doExport() {
    const csv = toCSV(bets)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apostas_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const parsed = fromCSV(text)
      onImport(parsed)
      if (inputRef.current) inputRef.current.value = ''
    }
    reader.readAsText(file, 'utf-8')
  }

  return (
    <div className="card flex flex-wrap gap-3 items-center justify-between">
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Importação/Exportação</div>
        <div className="text-xs text-gray-500">CSV com colunas: date, game, market, odds, stake, status, note</div>
      </div>
      <div className="flex gap-2">
        <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleImport} className="hidden" id="csvInput" />
        <label htmlFor="csvInput" className="btn-secondary cursor-pointer">Importar CSV</label>
        <button className="btn" onClick={doExport}>Exportar CSV</button>
      </div>
    </div>
  )
}
