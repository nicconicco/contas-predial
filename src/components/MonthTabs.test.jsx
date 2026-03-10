import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MonthTabs from './MonthTabs'

// =============================================================================
// Teste de componente: usa render do @testing-library/react para montar
// o componente no DOM virtual e testar o que o usuario ve e faz.
//
// Conceitos importantes:
// - render: monta o componente
// - screen: acessa elementos renderizados (getByText, getAllByRole, etc.)
// - fireEvent: simula interacoes do usuario (click, change, etc.)
// - vi.fn(): cria uma funcao espia que registra se foi chamada e com quais args
// =============================================================================

describe('MonthTabs', () => {
  it('deve renderizar todos os 12 meses abreviados', () => {
    const onSelect = vi.fn()
    render(<MonthTabs mesSelecionado="Janeiro" onSelect={onSelect} />)

    // Deve ter 12 botoes (um pra cada mes)
    const botoes = screen.getAllByRole('button')
    expect(botoes).toHaveLength(12)

    // Verifica que as abreviacoes estao la
    expect(screen.getByText('Jan')).toBeInTheDocument()
    expect(screen.getByText('Fev')).toBeInTheDocument()
    expect(screen.getByText('Dez')).toBeInTheDocument()
  })

  it('deve marcar o mes selecionado com classe tab-active', () => {
    const onSelect = vi.fn()
    render(<MonthTabs mesSelecionado="Março" onSelect={onSelect} />)

    const botaoMarco = screen.getByText('Mar')
    expect(botaoMarco).toHaveClass('tab-active')

    // Os outros NAO devem ter a classe
    const botaoJan = screen.getByText('Jan')
    expect(botaoJan).not.toHaveClass('tab-active')
  })

  it('deve chamar onSelect com o mes correto ao clicar', () => {
    const onSelect = vi.fn()
    render(<MonthTabs mesSelecionado="Janeiro" onSelect={onSelect} />)

    // Clicar em "Jun" deve chamar onSelect com "Junho"
    fireEvent.click(screen.getByText('Jun'))

    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith('Junho')
  })

  it('deve chamar onSelect mesmo clicando no mes ja selecionado', () => {
    const onSelect = vi.fn()
    render(<MonthTabs mesSelecionado="Janeiro" onSelect={onSelect} />)

    fireEvent.click(screen.getByText('Jan'))

    expect(onSelect).toHaveBeenCalledWith('Janeiro')
  })
})
