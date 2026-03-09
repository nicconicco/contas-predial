import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useRelatorios } from '../../hooks/useRelatorios'
import './Relatorios.css'

export default function Relatorios() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const rel = useRelatorios()
  const isAdmin = user.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="relatorios">
      <header className="relatorios-header">
        <div className="relatorios-header-left">
          <button onClick={() => navigate('/home')} className="btn-voltar">Voltar</button>
          <h1>Relatórios Antigos</h1>
        </div>
        <div className="dashboard-header-right">
          <span className="user-role">
            {isAdmin ? 'Administrador' : 'Visualização'}
          </span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="relatorios-content">
        {rel.saveMsg && (
          <div className={`save-msg ${rel.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
            {rel.saveMsg}
          </div>
        )}

        {isAdmin && (
          <div className="relatorios-upload">
            <h3>Enviar novo relatório</h3>
            <div className="relatorios-upload-row">
              <label className="btn-upload">
                Selecionar PDF
                <input type="file" accept=".pdf" onChange={rel.handleSelectFile} hidden />
              </label>
              {rel.pendingFile && (
                <span className="relatorios-pending-name">{rel.pendingFile.nomeArquivo}</span>
              )}
              <button
                className="btn-confirm"
                onClick={rel.handleUpload}
                disabled={rel.saving || !rel.pendingFile}
              >
                {rel.saving ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        )}

        {rel.loading && <div className="relatorios-loading">Carregando...</div>}

        {!rel.loading && rel.relatorios.length === 0 && (
          <p className="sem-relatorios">Ainda não foi subido nenhum documento</p>
        )}

        {!rel.loading && rel.relatorios.length > 0 && (
          <div className="relatorios-lista">
            {rel.relatorios.map((r) => (
              <div key={r.id} className="relatorio-item">
                <div className="relatorio-info">
                  <span className="relatorio-nome">{r.nomeArquivo}</span>
                  <span className="relatorio-data">{r.criadoEm}</span>
                </div>
                <div className="relatorio-actions">
                  <button className="btn-download" onClick={() => rel.handleDownload(r)}>
                    Baixar PDF
                  </button>
                  {isAdmin && (
                    <button
                      className="btn-delete"
                      onClick={() => rel.handleDelete(r.id)}
                      disabled={rel.saving}
                    >
                      Deletar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
