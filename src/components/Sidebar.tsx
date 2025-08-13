import React from 'react'

export type SectionKey = 'bets' | 'dutching' | 'dutchingEW' | 'bookies' | 'feedback'

interface SidebarProps {
  open: boolean
  active: SectionKey
  onClose: () => void
  onSelect: (key: SectionKey) => void
}

const items: Array<{ key: SectionKey; label: string }[]> = [
  [
    { key: 'bets', label: 'Apostas' },
  ],
  [
    { key: 'dutching', label: 'Calculadora: Dutching' },
    { key: 'dutchingEW', label: 'Calculadora: Dutching Each-Way' },
  ],
  [
    { key: 'bookies', label: 'Casas de Apostas' },
  ],
  [
    { key: 'feedback', label: 'Sugestões e Bugs' },
  ],
]

export default function Sidebar({ open, active, onClose, onSelect }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity z-40 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85%] z-50 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Menu lateral"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold">Menu</h2>
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onClose} aria-label="Fechar menu">
            ✕
          </button>
        </div>

        <nav className="p-2 space-y-4">
          {items.map((group, gi) => (
            <div key={gi} className="space-y-1">
              {group.map(item => (
                <button
                  key={item.key}
                  onClick={() => { onSelect(item.key); onClose() }}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800
                    ${active === item.key ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
                >
                  {item.label}
                </button>
              ))}
              {gi < items.length - 1 && <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
