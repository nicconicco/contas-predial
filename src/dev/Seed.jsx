import { useState } from 'react'
import { seedFirestore } from './seedFirestore'

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

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Seed do Firestore</h1>
      <p>Clique para popular o banco com dados iniciais.</p>
      <button
        onClick={handleSeed}
        disabled={running}
        style={{ padding: '1rem 2rem', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}
      >
        {running ? 'Executando...' : 'Executar Seed'}
      </button>
      {status && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{status}</p>}
    </div>
  )
}
