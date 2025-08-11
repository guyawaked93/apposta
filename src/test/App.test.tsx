import { render, screen } from '@testing-library/react'
import React from 'react'
import App from '@/App'

it('renders app header', () => {
  render(<App />)
  expect(screen.getByText(/Gerenciador de Apostas/i)).toBeInTheDocument()
})
