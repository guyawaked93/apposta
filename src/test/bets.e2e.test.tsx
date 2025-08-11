import { render, screen, fireEvent, within } from '@testing-library/react'
import React from 'react'
import { describe, test, expect } from 'vitest'
import App from '@/App'

function type(el: HTMLElement, value: string) {
  fireEvent.change(el, { target: { value } })
}

function fmtBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

describe('Fluxos: criar aposta, marcar resultado e paginação', () => {
  test('criar aposta e ver lucro esperado', () => {
    render(<App />)

    const jogo = screen.getByLabelText(/Jogo/i)
    const mercado = screen.getByLabelText(/Mercado/i)
    const odds = screen.getByLabelText(/Odds/i)
    const stake = screen.getByLabelText(/Stake/i)
    type(jogo, 'Time A x Time B')
    type(mercado, 'Over 2.5')
    type(odds, '1.66')
    type(stake, '3.5')

    const lucroEsperado = screen.getByLabelText(/Lucro esperado/i)
    expect((lucroEsperado as HTMLInputElement).value).toBe('2.31')

    fireEvent.click(screen.getByRole('button', { name: /adicionar aposta/i }))

    expect(screen.getByText('Time A x Time B')).toBeInTheDocument()
  })

  test('marcar pendente como Ganhou e Perdeu', () => {
    render(<App />)

    type(screen.getByLabelText(/Jogo/i), 'J1 x J2')
    type(screen.getByLabelText(/Mercado/i), 'ML')
    type(screen.getByLabelText(/Odds/i), '2.00')
    type(screen.getByLabelText(/Stake/i), '10')
    fireEvent.click(screen.getByRole('button', { name: /adicionar aposta/i }))

    const row = screen.getByText('J1 x J2').closest('tr')!
    const ganhou = within(row).getByRole('button', { name: /Ganhou/i })
    fireEvent.click(ganhou)
    expect(within(row).getAllByTestId('status-badge')[0]).toHaveTextContent(/Ganha/i)
    // célula de lucro é a 6ª (0-based 5)
    const cells = within(row).getAllByRole('cell')
    expect(cells[5]).toHaveTextContent(/R\$\s*10,00/)

    const select = within(row).getByDisplayValue('Ganha')
    fireEvent.change(select, { target: { value: 'lost' } })
    expect(within(row).getAllByTestId('status-badge')[0]).toHaveTextContent(/Perdida/i)
    expect(cells[5]).toHaveTextContent(/-\s*R\$\s*10,00|R\$\s*\-\s*10,00/)
  })

  test('paginação mostra 10 por página e navega', () => {
    render(<App />)

    for (let i = 1; i <= 21; i++) {
      type(screen.getByLabelText(/Jogo/i), `Jogo ${i}`)
      type(screen.getByLabelText(/Mercado/i), 'M')
      type(screen.getByLabelText(/Odds/i), '1.50')
      type(screen.getByLabelText(/Stake/i), '1')
      fireEvent.click(screen.getByRole('button', { name: /adicionar aposta/i }))
    }

    expect(screen.getByText(/Página\s*1\s*de\s*3/)).toBeInTheDocument()

    // Próxima para página 2
    fireEvent.click(screen.getByRole('button', { name: /Próxima/i }))
    expect(screen.getByText(/Página\s*2\s*de\s*3/)).toBeInTheDocument()

    // Ir para última
    fireEvent.click(screen.getByRole('button', { name: '»' }))
    expect(screen.getByText(/Página\s*3\s*de\s*3/)).toBeInTheDocument()

    // Verificar que há apenas 1 linha de dados no tbody
    const table = screen.getByRole('table')
    const groups = within(table).getAllByRole('rowgroup')
    const tbody = groups[1]
    const rows = within(tbody).getAllByRole('row')
    expect(rows.length).toBe(1)
  })
})
