import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFundos } from '../../hooks/useFundos'
import YearTabs from '../../components/YearTabs'
import MonthTabs from '../../components/MonthTabs'
import FundoTable from '../../components/FundoTable'
import TotaisPanel from '../../components/TotaisPanel'
import { useState } from 'react'
import './Fundos.css'

export default function Fundos() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const fundos = useFundos()
  const [showRateioVazio, setShowRateioVazio] = useState(false)

  const isAdmin = user.role === 'admin'

  function handleClickRateio() {
    const rateios = fundos.dadosMes?.rateios || []
    if (rateios.length === 0 && !isAdmin) {
      setShowRateioVazio(true)
    } else {
      fundos.handleVisualizarRateio()
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (fundos.loading) return <div className="dashboard-loading">Carregando...</div>
  if (fundos.error) return <div className="dashboard-error">{fundos.error}</div>

  const apartamentos = fundos.dadosMes?.apartamentos || []

  return (
    <div className="fundos">
      <header className="fundos-header">
        <div className="fundos-header-left">
          <button onClick={() => navigate('/home')} className="btn-voltar">Voltar</button>
          <h1>Fundo de Manutenção</h1>
        </div>
        <div className="dashboard-header-right">
          <span className="user-role">
            {isAdmin ? 'Administrador' : 'Visualização'}
          </span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="fundos-content">
        {isAdmin && fundos.edited && (
          <div className="save-bar">
            <span>Alterações não salvas</span>
            <button onClick={fundos.handleSave} className="btn-save" disabled={fundos.saving}>
              {fundos.saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        )}

        {fundos.saveMsg && (
          <div className={`save-msg ${fundos.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
            {fundos.saveMsg}
          </div>
        )}

        <YearTabs
          anoSelecionado={fundos.anoSelecionado}
          onSelect={fundos.setAnoSelecionado}
        />

        <MonthTabs
          mesSelecionado={fundos.mesSelecionado}
          onSelect={fundos.setMesSelecionado}
        />

        <h2 className="section-title">{fundos.mesSelecionado} {fundos.anoSelecionado}</h2>

        <FundoTable
          apartamentos={apartamentos}
          isAdmin={isAdmin}
          saving={fundos.saving}
          onToggleFundo={fundos.toggleFundo}
          onChangeValorManual={fundos.handleValorManual}
          onSave={fundos.handleSave}
          onUploadComprovanteApt={fundos.handleComprovanteApt}
          onDownloadComprovanteApt={fundos.handleDownloadComprovanteApt}
          onDeleteComprovanteApt={fundos.handleDeleteComprovanteApt}
        />

        <div className="fundos-totais-bar">
          <button
            className="btn-rateio"
            onClick={handleClickRateio}
            disabled={fundos.loadingRateio}
          >
            {fundos.loadingRateio ? 'Carregando...' : 'Visualize como foi feito o rateio desse mês'}
          </button>
          <button
            className="btn-totais"
            onClick={fundos.calcularTotais}
            disabled={fundos.loadingTotais}
          >
            {fundos.loadingTotais ? 'Calculando...' : 'Valores totais por apartamento'}
          </button>
        </div>

        {fundos.showTotais && (
          <TotaisPanel
            totais={fundos.totais}
            ano={fundos.anoSelecionado}
            onClose={fundos.fecharTotais}
          />
        )}

        {showRateioVazio && (
          <div className="totais-overlay">
            <div className="rateio-vazio-popup">
              <p>Ainda não foi subido nenhum comprovante a este mês.</p>
              <button className="btn-ok-popup" onClick={() => setShowRateioVazio(false)}>OK</button>
            </div>
          </div>
        )}

        {fundos.showRateio && (
          <div className="totais-overlay">
            <div className="rateio-panel">
              <div className="totais-header">
                <h2>Rateio — {fundos.mesSelecionado} {fundos.anoSelecionado}</h2>
                <button className="btn-fechar-totais" onClick={fundos.fecharRateio}>Fechar</button>
              </div>

              {isAdmin && (
                <div className="rateio-admin-actions">
                  <label className="btn-upload-rateio">
                    Enviar PDF
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={fundos.handleUploadRateio}
                      hidden
                    />
                  </label>
                </div>
              )}

              {(fundos.dadosMes?.rateios || []).length > 0 ? (
                <>
                  <ul className="rateio-lista">
                    {(fundos.dadosMes.rateios).map((item) => (
                      <li key={item.id} className={`rateio-item ${fundos.rateioPreview?.id === item.id ? 'rateio-item-ativo' : ''}`}>
                        <span className="rateio-item-nome">{item.nomeArquivo}</span>
                        <div className="rateio-item-actions">
                          <button
                            className="btn-preview-rateio"
                            onClick={() => fundos.handlePreviewRateio(item.id)}
                            disabled={fundos.loadingRateio}
                          >
                            {fundos.loadingRateio && fundos.rateioPreview?.id === item.id ? '...' : 'Visualizar'}
                          </button>
                          {isAdmin && (
                            <button
                              className="btn-delete-rateio"
                              onClick={() => fundos.handleDeleteRateioItem(item.id)}
                              disabled={fundos.saving}
                            >
                              Deletar
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {fundos.rateioPreview && (
                    <div className="rateio-preview-container">
                      <p className="rateio-filename">{fundos.rateioPreview.nomeArquivo}</p>
                      <iframe
                        src={fundos.rateioPreview.base64}
                        title="Rateio do mês"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="rateio-vazio">Nenhum rateio foi enviado para este mês.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
