import { describe, it, expect } from 'vitest'
import { MESES, MESES_CURTOS, ANOS, APARTAMENTOS } from './app'

// =============================================================================
// Teste mais simples: validar dados exportados de um modulo
// Nao precisa de mocks, nao precisa de React — so importa e verifica.
// =============================================================================

describe('MESES', () => {
  it('deve ter 12 meses', () => {
    expect(MESES).toHaveLength(12)
  })

  it('deve comecar com Janeiro e terminar com Dezembro', () => {
    expect(MESES[0]).toBe('Janeiro')
    expect(MESES[11]).toBe('Dezembro')
  })
})

describe('MESES_CURTOS', () => {
  it('deve ter 12 abreviacoes', () => {
    expect(MESES_CURTOS).toHaveLength(12)
  })

  it('deve corresponder aos meses completos', () => {
    // Cada abreviacao deve ser o inicio do mes completo
    MESES_CURTOS.forEach((curto, i) => {
      expect(MESES[i].startsWith(curto)).toBe(true)
    })
  })
})

describe('ANOS', () => {
  it('deve conter 2025 e 2026', () => {
    expect(ANOS).toContain('2025')
    expect(ANOS).toContain('2026')
  })
})

describe('APARTAMENTOS', () => {
  it('deve ter 10 unidades', () => {
    expect(APARTAMENTOS).toHaveLength(10)
  })

  it('deve incluir tipos diferentes de unidade', () => {
    const texto = APARTAMENTOS.join(' ')
    expect(texto).toContain('Apartamento')
    expect(texto).toContain('Casa')
    expect(texto).toContain('Loja')
  })
})
