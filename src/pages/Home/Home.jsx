import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Home.css'

export default function Home() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>Portal de Gestão de Pagamentos</h1>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </header>

      <main className="home-content">
        <div className="home-cards">
          <button className="home-card" onClick={() => navigate('/dashboard')}>
            <h2>Gestão de Pagamentos</h2>
            <p>Controle de pagamentos de água e luz dos apartamentos</p>
          </button>

          <button className="home-card" onClick={() => navigate('/consertos')}>
            <h2>Consertos Realizados</h2>
            <p>Registro de consertos e observações por apartamento</p>
          </button>

          <button className="home-card" onClick={() => navigate('/fundos')}>
            <h2>Fundo de Manutenção</h2>
            <p>Controle de fundo interno e externo por apartamento</p>
          </button>

          <button className="home-card" onClick={() => navigate('/relatorios')}>
            <h2>Relatórios Antigos</h2>
            <p>Visualizar e baixar relatórios antigos</p>
          </button>

          <button className="home-card" onClick={() => navigate('/atas')}>
            <h2>Atas</h2>
            <p>Visualizar atas e documentos</p>
          </button>

          <button className="home-card" onClick={() => navigate('/agua-extra')}>
            <h2>Sessão Especial sobre Água Extra</h2>
            <p>Documentos e informações sobre água extra</p>
          </button>

          <button className="home-card" onClick={() => navigate('/regras')}>
            <h2>Regras</h2>
            <p>Regras e normas do condomínio</p>
          </button>
        </div>
      </main>
    </div>
  )
}
