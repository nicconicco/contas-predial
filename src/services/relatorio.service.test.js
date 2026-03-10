import { describe, it, expect, vi, beforeEach } from 'vitest'

// =============================================================================
// Teste de servico: aqui mockamos o Firebase para testar a logica isolada.
//
// vi.mock() substitui um modulo inteiro por uma versao falsa.
// Isso permite testar o servico SEM precisar de um banco de dados real.
// =============================================================================

// 1) Mockar o Firebase — isso intercepta o import do firebase antes de ele carregar
vi.mock('../config/firebase', () => ({
  db: 'fake-db',
}))

// 2) Mockar as funcoes do Firestore que o servico usa
//    vi.hoisted() garante que as variaveis existem ANTES do vi.mock ser executado,
//    porque vi.mock eh automaticamente movido ("hoisted") para o topo do arquivo.
const { mockGetDocs, mockAddDoc, mockDeleteDoc, mockCollection, mockDoc } = vi.hoisted(() => ({
  mockGetDocs: vi.fn(),
  mockAddDoc: vi.fn(),
  mockDeleteDoc: vi.fn(),
  mockCollection: vi.fn(() => 'fake-collection-ref'),
  mockDoc: vi.fn(() => 'fake-doc-ref'),
}))

vi.mock('firebase/firestore', () => ({
  collection: (...args) => mockCollection(...args),
  getDocs: (...args) => mockGetDocs(...args),
  addDoc: (...args) => mockAddDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  doc: (...args) => mockDoc(...args),
}))

// 3) Agora importar o servico — ele vai usar os mocks acima
import { getRelatorios, addRelatorio, deleteRelatorio } from './relatorio.service'

beforeEach(() => {
  // Limpa o historico de chamadas entre cada teste
  vi.clearAllMocks()
})

describe('getRelatorios', () => {
  it('deve retornar a lista de relatorios com id', async () => {
    // Simular o retorno do Firestore (getDocs retorna um snapshot com .docs)
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'abc', data: () => ({ nomeArquivo: 'rel1.pdf', criadoEm: '01/01/2025' }) },
        { id: 'def', data: () => ({ nomeArquivo: 'rel2.pdf', criadoEm: '15/02/2025' }) },
      ],
    })

    const result = await getRelatorios()

    // Verifica que getDocs foi chamado
    expect(mockGetDocs).toHaveBeenCalledOnce()

    // Verifica o formato do retorno
    expect(result).toEqual([
      { id: 'abc', nomeArquivo: 'rel1.pdf', criadoEm: '01/01/2025' },
      { id: 'def', nomeArquivo: 'rel2.pdf', criadoEm: '15/02/2025' },
    ])
  })

  it('deve retornar array vazio quando nao ha relatorios', async () => {
    mockGetDocs.mockResolvedValue({ docs: [] })

    const result = await getRelatorios()

    expect(result).toEqual([])
  })
})

describe('addRelatorio', () => {
  it('deve chamar addDoc com os dados corretos', async () => {
    mockAddDoc.mockResolvedValue({ id: 'novo-id' })

    await addRelatorio('arquivo.pdf', 'base64-data')

    // Verifica que addDoc foi chamado com a referencia da collection e os dados
    expect(mockAddDoc).toHaveBeenCalledOnce()
    const chamada = mockAddDoc.mock.calls[0]
    expect(chamada[1]).toMatchObject({
      nomeArquivo: 'arquivo.pdf',
      base64: 'base64-data',
    })
    // Verifica que criadoEm foi incluido (data atual)
    expect(chamada[1].criadoEm).toBeDefined()
  })
})

describe('deleteRelatorio', () => {
  it('deve chamar deleteDoc com o doc correto', async () => {
    mockDeleteDoc.mockResolvedValue(undefined)

    await deleteRelatorio('abc123')

    expect(mockDoc).toHaveBeenCalledWith('fake-db', 'relatorios', 'abc123')
    expect(mockDeleteDoc).toHaveBeenCalledWith('fake-doc-ref')
  })
})
