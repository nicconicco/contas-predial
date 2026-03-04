import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { readXlsx, generateXlsx, MESES, ANOS } from '../utils/readXlsx'
import './Dashboard.css'

const MESES_CURTOS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anoSelecionado, setAnoSelecionado] = useState(ANOS[ANOS.length - 1])
  const [mesSelecionado, setMesSelecionado] = useState(MESES[0])
  const [mesesData, setMesesData] = useState({})
  const [comprovantes, setComprovantes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [edited, setEdited] = useState(false)

  const isAdmin = user.role === 'admin'
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    setLoading(true)
    setEdited(false)
    readXlsx(anoSelecionado)
      .then(({ mesesData, comprovantes }) => {
        setMesesData(mesesData)
        setComprovantes(comprovantes)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar planilha')
        setLoading(false)
      })
  }, [anoSelecionado])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function togglePayment(index, field) {
    setMesesData((prev) => ({
      ...prev,
      [mesSelecionado]: prev[mesSelecionado].map((row, i) =>
        i === index ? { ...row, [field]: row[field] === 'Sim' ? 'Não' : 'Sim' } : row
      ),
    }))
    setEdited(true)
  }

  function handleComprovante(tipo, e) {
    const file = e.target.files[0]
    if (!file) return
    setComprovantes((prev) => ({
      ...prev,
      [mesSelecionado]: {
        ...prev[mesSelecionado],
        [tipo]: file.name,
      },
    }))
    setEdited(true)
  }

  function handleSave() {
    generateXlsx(mesesData, comprovantes, anoSelecionado)
    setEdited(false)
  }

  if (loading) return <div className="dashboard-loading">Carregando...</div>
  if (error) return <div className="dashboard-error">{error}</div>

  const dadosMes = mesesData[mesSelecionado] || []
  const compMes = comprovantes[mesSelecionado] || { agua: '', luz: '' }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Portal de Gestão de Pagamentos</h1>
        <div className="dashboard-header-right">
          <span className="user-role">
            {isAdmin ? 'Administrador' : 'Visualização'}
          </span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-content">
        {isAdmin && edited && (
          <div className="save-bar">
            <span>Alterações não salvas</span>
            <button onClick={handleSave} className="btn-save">Salvar alterações (baixar .xlsx)</button>
          </div>
        )}

        {/* Tabs de ano */}
        <div className="tabs-ano">
          {ANOS.map((ano) => (
            <button
              key={ano}
              className={`tab-ano ${anoSelecionado === ano ? 'tab-ano-active' : ''}`}
              onClick={() => setAnoSelecionado(ano)}
            >
              Ano {ano}
            </button>
          ))}
        </div>

        {/* Tabs dos meses */}
        <div className="tabs">
          {MESES.map((mes, i) => (
            <button
              key={mes}
              className={`tab ${mesSelecionado === mes ? 'tab-active' : ''}`}
              onClick={() => setMesSelecionado(mes)}
            >
              {MESES_CURTOS[i]}
            </button>
          ))}
        </div>

        <h2 className="section-title">{mesSelecionado} {anoSelecionado}</h2>

        {/* Tabela de inquilinos */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Pagamento Água</th>
                <th>Pagamento Luz</th>
              </tr>
            </thead>
            <tbody>
              {dadosMes.map((row, index) => (
                <tr key={index}>
                  <td className="cell-nome">{row['Nome']}</td>
                  <td>
                    {isAdmin ? (
                      <button
                        className={`btn-toggle ${row['Pagamento Água'] === 'Sim' ? 'toggle-sim' : 'toggle-nao'}`}
                        onClick={() => togglePayment(index, 'Pagamento Água')}
                      >
                        {row['Pagamento Água']}
                      </button>
                    ) : (
                      <span className={`status ${row['Pagamento Água'] === 'Sim' ? 'status-sim' : 'status-nao'}`}>
                        {row['Pagamento Água']}
                      </span>
                    )}
                  </td>
                  <td>
                    {isAdmin ? (
                      <button
                        className={`btn-toggle ${row['Pagamento Luz'] === 'Sim' ? 'toggle-sim' : 'toggle-nao'}`}
                        onClick={() => togglePayment(index, 'Pagamento Luz')}
                      >
                        {row['Pagamento Luz']}
                      </button>
                    ) : (
                      <span className={`status ${row['Pagamento Luz'] === 'Sim' ? 'status-sim' : 'status-nao'}`}>
                        {row['Pagamento Luz']}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comprovantes gerais do mês */}
        <div className="comprovantes-section">
          <div className="comprovante-card">
            <h3>Comprovante Geral de Água</h3>
            {compMes.agua ? (
              <a
                href={`${baseUrl}comprovantes/agua/${compMes.agua}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                Baixar PDF
              </a>
            ) : (
              <p className="sem-comprovante">Ainda não foi subido nenhum documento nesse mês</p>
            )}
            {isAdmin && (
              <label className="btn-upload">
                Enviar PDF
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleComprovante('agua', e)}
                  hidden
                />
              </label>
            )}
          </div>

          <div className="comprovante-card">
            <h3>Comprovante Geral de Luz</h3>
            {compMes.luz ? (
              <a
                href={`${baseUrl}comprovantes/luz/${compMes.luz}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                Baixar PDF
              </a>
            ) : (
              <p className="sem-comprovante">Ainda não foi subido nenhum documento nesse mês</p>
            )}
            {isAdmin && (
              <label className="btn-upload">
                Enviar PDF
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleComprovante('luz', e)}
                  hidden
                />
              </label>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
