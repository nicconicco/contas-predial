import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Home.css'

const sections = [
  {
    title: 'Financeiro',
    icon: '💰',
    items: [
      { emoji: '💳', label: 'Pagamento água e luz', route: '/dashboard' },
      { emoji: '🏦', label: 'Fundo de Manutenção', route: '/fundos' },
      { emoji: '💧', label: 'Água Claudia', route: '/agua-extra' },
    ],
  },
  {
    title: 'Documentos',
    icon: '📄',
    items: [
      { emoji: '📊', label: 'Relatórios', route: '/relatorios' },
      { emoji: '📋', label: 'Atas', route: '/atas' },
      { emoji: '📐', label: 'Regras', route: '/regras' },
    ],
  },
  {
    title: 'Gestão',
    icon: '🛠️',
    items: [
      { emoji: '🔧', label: 'Consertos', route: '/consertos' },
      { emoji: '📁', label: 'Seções extras', route: '/secoes' },
    ],
  },
]

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
        <div className="home-sections">
          {sections.map((section) => (
            <section key={section.title} className="home-section">
              <h2 className="home-section-title">
                <span>{section.icon}</span> {section.title}
              </h2>
              <div className="home-section-grid">
                {section.items.map((item) => (
                  <button
                    key={item.route}
                    className="home-card"
                    onClick={() => navigate(item.route)}
                  >
                    <span className="home-card-emoji">{item.emoji}</span>
                    <span className="home-card-label">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
