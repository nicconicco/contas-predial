import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPagamento, savePagamento, MESES, ANOS } from '../utils/firebaseData'
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
  const [dadosMes, setDadosMes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [edited, setEdited] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const isAdmin = user.role === 'admin'
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    setLoading(true)
    setEdited(false)
    setSaveMsg('')
    getPagamento(anoSelecionado, mesSelecionado)
      .then((data) => {
        setDadosMes(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar dados')
        setLoading(false)
      })
  }, [anoSelecionado, mesSelecionado])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handlePessoas(index, value) {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 0) return
    setDadosMes((prev) => ({
      ...prev,
      apartamentos: prev.apartamentos.map((row, i) =>
        i === index ? { ...row, quantidadePessoas: num } : row
      ),
    }))
    setEdited(true)
    setSaveMsg('')
  }

  function togglePayment(index, field) {
    setDadosMes((prev) => ({
      ...prev,
      apartamentos: prev.apartamentos.map((row, i) =>
        i === index ? { ...row, [field]: row[field] === 'Sim' ? 'Não' : 'Sim' } : row
      ),
    }))
    setEdited(true)
    setSaveMsg('')
  }

  function handleComprovante(tipo, e) {
    const file = e.target.files[0]
    if (!file) return
    setDadosMes((prev) => ({
      ...prev,
      [tipo]: file.name,
    }))
    setEdited(true)
    setSaveMsg('')
  }

  async function handleSave() {
    setSaving(true)
    setSaveMsg('')
    try {
      await savePagamento(anoSelecionado, mesSelecionado, dadosMes)
      setEdited(false)
      setSaveMsg('Salvo com sucesso! As alterações já estão disponíveis para todos.')
    } catch (err) {
      setSaveMsg(`Erro ao salvar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="dashboard-loading">Carregando...</div>
  if (error) return <div className="dashboard-error">{error}</div>

  const apartamentos = dadosMes?.apartamentos || []
  const comprovanteAgua = dadosMes?.comprovanteAgua || ''
  const comprovanteLuz = dadosMes?.comprovanteLuz || ''

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
            <button onClick={handleSave} className="btn-save" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        )}

        {saveMsg && (
          <div className={`save-msg ${saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
            {saveMsg}
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
                <th>Qtd. Pessoas</th>
                <th>Pagamento Água</th>
                <th>Pagamento Luz</th>
                {isAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {apartamentos.map((row, index) => (
                <tr key={index}>
                  <td className="cell-nome">{row.nome}</td>
                  <td className="cell-pessoas">
                    {isAdmin ? (
                      <input
                        type="number"
                        min="0"
                        className="input-pessoas"
                        value={row.quantidadePessoas}
                        onChange={(e) => handlePessoas(index, e.target.value)}
                      />
                    ) : (
                      row.quantidadePessoas
                    )}
                  </td>
                  <td>
                    {isAdmin ? (
                      <button
                        className={`btn-toggle ${row.pagamentoAgua === 'Sim' ? 'toggle-sim' : 'toggle-nao'}`}
                        onClick={() => togglePayment(index, 'pagamentoAgua')}
                      >
                        {row.pagamentoAgua}
                      </button>
                    ) : (
                      <span className={`status ${row.pagamentoAgua === 'Sim' ? 'status-sim' : 'status-nao'}`}>
                        {row.pagamentoAgua}
                      </span>
                    )}
                  </td>
                  <td>
                    {isAdmin ? (
                      <button
                        className={`btn-toggle ${row.pagamentoLuz === 'Sim' ? 'toggle-sim' : 'toggle-nao'}`}
                        onClick={() => togglePayment(index, 'pagamentoLuz')}
                      >
                        {row.pagamentoLuz}
                      </button>
                    ) : (
                      <span className={`status ${row.pagamentoLuz === 'Sim' ? 'status-sim' : 'status-nao'}`}>
                        {row.pagamentoLuz}
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="btn-atualizar" onClick={handleSave} disabled={saving}>
                        {saving ? '...' : 'Atualizar'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comprovantes gerais do mês */}
        <div className="comprovantes-section">
          <div className="comprovante-card">
            <h3>Comprovante Geral de Água</h3>
            {comprovanteAgua ? (
              <a
                href={`${baseUrl}comprovantes/agua/${comprovanteAgua}`}
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
                  onChange={(e) => handleComprovante('comprovanteAgua', e)}
                  hidden
                />
              </label>
            )}
          </div>

          <div className="comprovante-card">
            <h3>Comprovante Geral de Luz</h3>
            {comprovanteLuz ? (
              <a
                href={`${baseUrl}comprovantes/luz/${comprovanteLuz}`}
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
                  onChange={(e) => handleComprovante('comprovanteLuz', e)}
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
