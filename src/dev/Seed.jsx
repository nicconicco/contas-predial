import { useState } from 'react'
import { seedFirestore } from './seedFirestore'
import { seedHistorico } from './seedHistorico'

export default function Seed() {
  const [status, setStatus] = useState('')
  const [running, setRunning] = useState(false)

  async function handleSeed() {
    setRunning(true)
    setStatus('Populando Firestore...')
    try {
      await seedFirestore()
      setStatus('Seed completo! Dados criados com sucesso.')
    } catch (err) {
      setStatus(`Erro: ${err.message}`)
    } finally {
      setRunning(false)
    }
  }

  async function handleSeedHistorico() {
    setRunning(true)
    setStatus('Populando dados históricos 2024-2025...')
    try {
      await seedHistorico()
      setStatus('Seed histórico completo! Dados de 2024 e 2025 criados.')
    } catch (err) {
      setStatus(`Erro: ${err.message}`)
    } finally {
      setRunning(false)
    }
  }

  const btnStyle = { padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Seed do Firestore</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Seed Geral (2026)</h3>
        <p>Popula senhas, pagamentos e fundos de 2025-2026 com dados padrão.</p>
        <button onClick={handleSeed} disabled={running} style={btnStyle}>
          {running ? 'Executando...' : 'Executar Seed Geral'}
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Seed Histórico (2024-2025)</h3>
        <p>Popula pagamentos de Out/2024 a Dez/2025 com dados da planilha.</p>
        <button onClick={handleSeedHistorico} disabled={running} style={btnStyle}>
          {running ? 'Executando...' : 'Executar Seed Histórico'}
        </button>
      </div>

      {status && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{status}</p>}
    </div>
  )
}
