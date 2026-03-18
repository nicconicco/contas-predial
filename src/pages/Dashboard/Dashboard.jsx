import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePagamento } from '../../hooks/usePagamento'
import YearTabs from '../../components/YearTabs'
import MonthTabs from '../../components/MonthTabs'
import PaymentTable from '../../components/PaymentTable'
import ComprovantesSection from '../../components/ComprovantesSection'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const pagamento = usePagamento()

  const isAdmin = user.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (pagamento.loading) return <div className="dashboard-loading">Carregando...</div>
  if (pagamento.error) return <div className="dashboard-error">{pagamento.error}</div>

  const apartamentos = pagamento.dadosMes?.apartamentos || []
  const comprovanteAgua = pagamento.dadosMes?.comprovanteAgua || ''
  const comprovanteLuz = pagamento.dadosMes?.comprovanteLuz || ''
  const comprovanteDivisaoAguaLuz = pagamento.dadosMes?.comprovanteDivisaoAguaLuz || ''

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
        {isAdmin && pagamento.edited && (
          <div className="save-bar">
            <span>Alterações não salvas</span>
            <button onClick={pagamento.handleSave} className="btn-save" disabled={pagamento.saving}>
              {pagamento.saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        )}

        {pagamento.saveMsg && (
          <div className={`save-msg ${pagamento.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
            {pagamento.saveMsg}
          </div>
        )}

        <YearTabs
          anoSelecionado={pagamento.anoSelecionado}
          onSelect={pagamento.setAnoSelecionado}
        />

        <MonthTabs
          mesSelecionado={pagamento.mesSelecionado}
          onSelect={pagamento.setMesSelecionado}
        />

        <h2 className="section-title">{pagamento.mesSelecionado} {pagamento.anoSelecionado}</h2>

        <PaymentTable
          apartamentos={apartamentos}
          isAdmin={isAdmin}
          saving={pagamento.saving}
          onTogglePayment={pagamento.togglePayment}
          onChangePessoas={pagamento.handlePessoas}
          onChangeValorTotal={pagamento.handleValorTotal}
          onSave={pagamento.handleSave}
        />

        <ComprovantesSection
          comprovanteAgua={comprovanteAgua}
          comprovanteLuz={comprovanteLuz}
          comprovanteDivisaoAguaLuz={comprovanteDivisaoAguaLuz}
          isAdmin={isAdmin}
          saving={pagamento.saving}
          pendingFiles={pagamento.pendingFiles}
          onUpload={pagamento.handleComprovante}
          onConfirmUpload={pagamento.handleConfirmUpload}
          onDownload={pagamento.handleDownloadComprovante}
          onDelete={pagamento.handleDeleteComprovante}
        />
      </main>
    </div>
  )
}
