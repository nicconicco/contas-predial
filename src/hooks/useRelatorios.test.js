import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRelatorios } from './useRelatorios'

// =============================================================================
// Teste de hook: usa renderHook do @testing-library/react para executar
// o hook fora de um componente. Mockamos o servico para isolar a logica.
//
// Conceitos importantes:
// - renderHook: executa um hook e retorna o .result.current com os valores
// - act: envolve acoes que causam mudancas de estado (setState, clicks, etc.)
// - waitFor: espera uma condicao ser verdadeira (util para operacoes async)
// =============================================================================

// Mockar o servico inteiro
vi.mock('../services/relatorio.service', () => ({
  getRelatorios: vi.fn(),
  addRelatorio: vi.fn(),
  deleteRelatorio: vi.fn(),
}))

// Importar as funcoes mockadas para configurar retornos
import {
  getRelatorios,
  addRelatorio,
  deleteRelatorio,
} from '../services/relatorio.service'

beforeEach(() => {
  vi.clearAllMocks()
  // Por padrao, getRelatorios retorna uma lista vazia
  getRelatorios.mockResolvedValue([])
})

describe('useRelatorios', () => {
  it('deve comecar carregando e depois parar', async () => {
    const { result } = renderHook(() => useRelatorios())

    // Inicialmente esta carregando
    expect(result.current.loading).toBe(true)

    // Depois de carregar, loading vira false
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('deve carregar relatorios na montagem', async () => {
    const dados = [
      { id: '1', nomeArquivo: 'rel1.pdf', criadoEm: '15/03/2025' },
      { id: '2', nomeArquivo: 'rel2.pdf', criadoEm: '01/01/2025' },
    ]
    getRelatorios.mockResolvedValue(dados)

    const { result } = renderHook(() => useRelatorios())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verifica que os relatorios foram carregados (e ordenados por data decrescente)
    expect(result.current.relatorios).toHaveLength(2)
    expect(result.current.relatorios[0].nomeArquivo).toBe('rel1.pdf')
  })

  it('deve mostrar erro quando getRelatorios falha', async () => {
    getRelatorios.mockRejectedValue(new Error('falha de rede'))

    const { result } = renderHook(() => useRelatorios())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.saveMsg).toBe('Erro ao carregar relatórios')
  })

  it('deve deletar relatorio e recarregar a lista', async () => {
    getRelatorios.mockResolvedValue([
      { id: '1', nomeArquivo: 'rel.pdf', criadoEm: '01/01/2025' },
    ])
    deleteRelatorio.mockResolvedValue(undefined)

    const { result } = renderHook(() => useRelatorios())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Executar a delecao
    await act(async () => {
      await result.current.handleDelete('1')
    })

    // Verifica que deleteRelatorio foi chamado com o id correto
    expect(deleteRelatorio).toHaveBeenCalledWith('1')
    // Verifica que recarregou a lista (getRelatorios chamado novamente)
    expect(getRelatorios).toHaveBeenCalledTimes(2)
    expect(result.current.saveMsg).toBe('Relatório deletado.')
  })

  it('deve mostrar erro quando deletar falha', async () => {
    getRelatorios.mockResolvedValue([])
    deleteRelatorio.mockRejectedValue(new Error('sem permissao'))

    const { result } = renderHook(() => useRelatorios())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.handleDelete('1')
    })

    expect(result.current.saveMsg).toBe('Erro ao deletar: sem permissao')
    expect(result.current.saving).toBe(false)
  })

  it('handleUpload nao faz nada se nao ha pendingFile', async () => {
    const { result } = renderHook(() => useRelatorios())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.handleUpload()
    })

    // addRelatorio NAO deve ter sido chamado
    expect(addRelatorio).not.toHaveBeenCalled()
  })
})
