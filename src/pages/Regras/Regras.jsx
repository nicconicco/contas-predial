import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useRegras } from '../../hooks/useRegras'
import './Regras.css'

function NovaRegraForm({ saving, onSubmit }) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
    })
    setTitulo('')
    setDescricao('')
  }

  return (
    <form className="regra-form" onSubmit={handleSubmit}>
      <h3>Nova Regra</h3>
      <input
        type="text"
        placeholder="Título da regra"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="regra-input"
        required
      />
      <textarea
        placeholder="Descrição da regra (máx. 2048 caracteres)"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value.slice(0, 2048))}
        className="regra-textarea"
        maxLength={2048}
      />
      <div className="regra-char-count">{descricao.length}/2048</div>

      <button type="submit" className="btn-submeter" disabled={saving || !titulo.trim()}>
        {saving ? 'Enviando...' : 'Submeter'}
      </button>
    </form>
  )
}

function EditRegraForm({ regra, saving, onSave, onCancel, onUpdateField }) {
  return (
    <div className="regra-edit-form">
      <h3>Editar Regra</h3>
      <input
        type="text"
        value={regra.titulo}
        onChange={(e) => onUpdateField('titulo', e.target.value)}
        className="regra-input"
      />
      <textarea
        value={regra.descricao || ''}
        onChange={(e) => onUpdateField('descricao', e.target.value.slice(0, 2048))}
        className="regra-textarea"
        maxLength={2048}
      />
      <div className="regra-char-count">{(regra.descricao || '').length}/2048</div>

      <div className="regra-edit-actions">
        <button className="btn-confirm" onClick={onSave} disabled={saving || !regra.titulo.trim()}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        <button className="btn-cancel" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

function RegraCard({ regra, isAdmin, saving, onEdit, onDelete }) {
  return (
    <div className="regra-card">
      <div className="regra-card-header">
        <h3>{regra.titulo}</h3>
        <span className="regra-data">{regra.criadoEm}</span>
      </div>
      {regra.descricao && <p className="regra-descricao">{regra.descricao}</p>}

      {isAdmin && (
        <div className="regra-admin-actions">
          <button className="btn-edit" onClick={() => onEdit(regra)} disabled={saving}>
            Editar
          </button>
          <button className="btn-delete" onClick={() => onDelete(regra.id)} disabled={saving}>
            Deletar
          </button>
        </div>
      )}
    </div>
  )
}

export default function Regras() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const hook = useRegras()
  const isAdmin = user.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="regras">
      <header className="regras-header">
        <div className="regras-header-left">
          <button onClick={() => navigate('/home')} className="btn-voltar">Voltar</button>
          <h1>Regras</h1>
        </div>
        <div className="dashboard-header-right">
          <span className="user-role">
            {isAdmin ? 'Administrador' : 'Visualização'}
          </span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="regras-content">
        {hook.saveMsg && (
          <div className={`save-msg ${hook.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
            {hook.saveMsg}
          </div>
        )}

        {isAdmin && !hook.editingRegra && (
          <NovaRegraForm saving={hook.saving} onSubmit={hook.handleAdd} />
        )}

        {hook.editingRegra && (
          <EditRegraForm
            regra={hook.editingRegra}
            saving={hook.saving}
            onSave={hook.handleSaveEdit}
            onCancel={hook.handleCancelEdit}
            onUpdateField={hook.updateEditingField}
          />
        )}

        {hook.loading && <div className="regras-loading">Carregando...</div>}

        {!hook.loading && hook.regras.length === 0 && (
          <p className="sem-regras">Ainda não foi registrada nenhuma regra.</p>
        )}

        {!hook.loading && hook.regras.length > 0 && (
          <div className="regras-lista">
            {hook.regras.map((regra) => (
              <RegraCard
                key={regra.id}
                regra={regra}
                isAdmin={isAdmin && !hook.editingRegra}
                saving={hook.saving}
                onEdit={hook.handleEdit}
                onDelete={hook.handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
