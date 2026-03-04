import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Portal de Gestão de Pagamentos</h1>
        <div className="dashboard-header-right">
          <span className="user-role">
            {user.role === 'admin' ? 'Administrador' : 'Visualização'}
          </span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>
      <main className="dashboard-content">
        <p>Dashboard em construção — Fase 3</p>
      </main>
    </div>
  )
}
