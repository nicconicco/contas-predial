import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFundos } from '../../hooks/useFundos'
import YearTabs from '../../components/YearTabs'
import MonthTabs from '../../components/MonthTabs'
import FundoTable from '../../components/FundoTable'
import TotaisPanel from '../../components/TotaisPanel'
import './Fundos.css'

export default function Fundos() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const fundos = useFundos()

  const isAdmin = user.role === 'admin'

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
          onSave={fundos.handleSave}
        />

        <div className="fundos-totais-bar">
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
      </main>
    </div>
  )
}
