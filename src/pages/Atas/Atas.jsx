import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAtas } from '../../hooks/useAtas'
import './Atas.css'

function NovaAtaForm({ saving, onSubmit }) {
  const [titulo, setTitulo] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [anexos, setAnexos] = useState([])

  function handleAddAnexo(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAnexos((prev) => [...prev, { nomeArquivo: file.name, base64: reader.result }])
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleRemoveAnexo(index) {
    setAnexos((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    onSubmit({
      titulo: titulo.trim(),
      observacoes: observacoes.trim(),
      anexos,
    })
    setTitulo('')
    setObservacoes('')
    setAnexos([])
  }

  return (
    <form className="ata-form" onSubmit={handleSubmit}>
      <h3>Nova Ata</h3>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="ata-input"
        required
      />
      <textarea
        placeholder="Observações (máx. 2048 caracteres)"
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value.slice(0, 2048))}
        className="ata-textarea"
        maxLength={2048}
      />
      <div className="ata-char-count">{observacoes.length}/2048</div>

      <label className="btn-add-anexo">
        Adicionar Imagem/PDF
        <input type="file" accept="image/*,.pdf" onChange={handleAddAnexo} hidden />
      </label>

      {anexos.length > 0 && (
        <ul className="anexos-pendentes">
          {anexos.map((a, i) => (
            <li key={i}>
              <span>{a.nomeArquivo}</span>
              <button type="button" className="btn-remove-anexo" onClick={() => handleRemoveAnexo(i)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="submit" className="btn-submeter" disabled={saving || !titulo.trim()}>
        {saving ? 'Enviando...' : 'Submeter'}
      </button>
    </form>
  )
}

function EditAtaForm({ ata, saving, onSave, onCancel, onUpdateField, onAddAnexo, onRemoveAnexo }) {
  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    onAddAnexo(file)
    e.target.value = ''
  }

  return (
    <div className="ata-edit-form">
      <h3>Editar Ata</h3>
      <input
        type="text"
        value={ata.titulo}
        onChange={(e) => onUpdateField('titulo', e.target.value)}
        className="ata-input"
      />
      <textarea
        value={ata.observacoes || ''}
        onChange={(e) => onUpdateField('observacoes', e.target.value.slice(0, 2048))}
        className="ata-textarea"
        maxLength={2048}
      />
      <div className="ata-char-count">{(ata.observacoes || '').length}/2048</div>

      <label className="btn-add-anexo">
        Adicionar Imagem/PDF
        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} hidden />
      </label>

      {ata.anexos && ata.anexos.length > 0 && (
        <ul className="anexos-pendentes">
          {ata.anexos.map((a, i) => (
            <li key={i}>
              <span>{a.nomeArquivo}</span>
              <button type="button" className="btn-remove-anexo" onClick={() => onRemoveAnexo(i)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="ata-edit-actions">
        <button className="btn-confirm" onClick={onSave} disabled={saving || !ata.titulo.trim()}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        <button className="btn-cancel" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

function AtaCard({ ata, isAdmin, saving, onEdit, onDelete, onDownload }) {
  return (
    <div className="ata-card">
      <div className="ata-card-header">
        <h3>{ata.titulo}</h3>
        <span className="ata-data">{ata.criadoEm}</span>
      </div>
      {ata.observacoes && <p className="ata-observacoes">{ata.observacoes}</p>}

      {ata.anexos && ata.anexos.length > 0 && (
        <div className="ata-anexos">
          {ata.anexos.map((a, i) => (
            <button key={i} className="btn-download-anexo" onClick={() => onDownload(a)}>
              {a.nomeArquivo}
            </button>
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="ata-admin-actions">
          <button className="btn-edit" onClick={() => onEdit(ata)} disabled={saving}>
            Editar
          </button>
          <button className="btn-delete" onClick={() => onDelete(ata.id)} disabled={saving}>
            Deletar
          </button>
        </div>
      )}
    </div>
  )
}

export default function Atas() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const atasHook = useAtas()
  const isAdmin = user.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="atas">
      <header className="atas-header">
        <div className="atas-header-left">
          <button onClick={() => navigate('/home')} className="btn-voltar">Voltar</button>
          <h1>Atas</h1>
        </div>
        <div className="dashboard-header-right">
          <span className="user-role">
            {isAdmin ? 'Administrador' : 'Visualização'}
          </span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="atas-content">
        {atasHook.saveMsg && (
          <div className={`save-msg ${atasHook.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
            {atasHook.saveMsg}
          </div>
        )}

        {isAdmin && !atasHook.editingAta && (
          <NovaAtaForm saving={atasHook.saving} onSubmit={atasHook.handleAddAta} />
        )}

        {atasHook.editingAta && (
          <EditAtaForm
            ata={atasHook.editingAta}
            saving={atasHook.saving}
            onSave={atasHook.handleSaveEdit}
            onCancel={atasHook.handleCancelEdit}
            onUpdateField={atasHook.updateEditingField}
            onAddAnexo={atasHook.addAnexoToEditing}
            onRemoveAnexo={atasHook.removeAnexoFromEditing}
          />
        )}

        {atasHook.loading && <div className="atas-loading">Carregando...</div>}

        {!atasHook.loading && atasHook.atas.length === 0 && (
          <p className="sem-atas">Ainda não foi registrada nenhuma ata.</p>
        )}

        {!atasHook.loading && atasHook.atas.length > 0 && (
          <div className="atas-lista">
            {atasHook.atas.map((ata) => (
              <AtaCard
                key={ata.id}
                ata={ata}
                isAdmin={isAdmin && !atasHook.editingAta}
                saving={atasHook.saving}
                onEdit={atasHook.handleEditAta}
                onDelete={atasHook.handleDeleteAta}
                onDownload={atasHook.handleDownload}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
