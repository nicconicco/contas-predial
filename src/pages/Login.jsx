import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const result = login(password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError('Não foi possível acessar, verifique com o administrador')
      setPassword('')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Portal de Gestão de Pagamentos</h1>
        <p className="login-subtitle">Digite a senha para acessar</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  )
}
