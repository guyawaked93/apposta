import React from 'react'

export default function Bookies() {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Casas de Apostas</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Se você curte o projeto, use nossos links de indicação. Isso nos ajuda a manter e evoluir a ferramenta.
      </p>

      <div className="grid sm:grid-cols-3 gap-3">
        <a
          className="block p-4 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          href="https://referme.to/caiosouzadantasg-13"
          target="_blank" rel="noreferrer noopener" aria-label="Visitar Betano"
        >
          <img src="/logos/betano.svg" alt="Betano" className="h-8 sm:h-10 mb-2 object-contain" loading="lazy" />
          <div className="font-medium">Betano</div>
        </a>

        <a
          className="block p-4 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          href="https://betboom.bet.br/registration/base/?referral_code=fcd24737-dd1d-44c0-b1a5-0b789a48fa99"
          target="_blank" rel="noreferrer noopener" aria-label="Visitar Betboom"
        >
          <img src="/logos/betboom.svg" alt="Betboom" className="h-8 sm:h-10 mb-2 object-contain" loading="lazy" />
          <div className="font-medium">Betboom</div>
        </a>

        <a
          className="block p-4 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          href="https://pix.bet.br/?ref_code=0slc6uynw2o7"
          target="_blank" rel="noreferrer noopener" aria-label="Visitar Pixbet"
        >
          <img src="/logos/pixbet.svg" alt="Pixbet" className="h-8 sm:h-10 mb-2 object-contain" loading="lazy" />
          <div className="font-medium">Pixbet</div>
        </a>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Obrigado pelo apoio! Sugestões e feedbacks são bem-vindos.
      </div>
    </div>
  )
}
