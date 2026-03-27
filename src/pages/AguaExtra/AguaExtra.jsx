import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAguaExtra } from '../../hooks/useAguaExtra'
import './AguaExtra.css'

function NovoRegistroForm({ saving, onSubmit }) {
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
    <form className="agua-form" onSubmit={handleSubmit}>
      <h3>Novo Registro</h3>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="agua-input"
        required
      />
      <textarea
        placeholder="Observações (máx. 2048 caracteres)"
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value.slice(0, 2048))}
        className="agua-textarea"
        maxLength={2048}
      />
      <div className="agua-char-count">{observacoes.length}/2048</div>

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

function EditRegistroForm({ registro, saving, onSave, onCancel, onUpdateField, onAddAnexo, onRemoveAnexo }) {
  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    onAddAnexo(file)
    e.target.value = ''
  }

  return (
    <div className="agua-edit-form">
      <h3>Editar Registro</h3>
      <input
        type="text"
        value={registro.titulo}
        onChange={(e) => onUpdateField('titulo', e.target.value)}
        className="agua-input"
      />
      <textarea
        value={registro.observacoes || ''}
        onChange={(e) => onUpdateField('observacoes', e.target.value.slice(0, 2048))}
        className="agua-textarea"
        maxLength={2048}
      />
      <div className="agua-char-count">{(registro.observacoes || '').length}/2048</div>

      <label className="btn-add-anexo">
        Adicionar Imagem/PDF
        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} hidden />
      </label>

      {registro.anexos && registro.anexos.length > 0 && (
        <ul className="anexos-pendentes">
          {registro.anexos.map((a, i) => (
            <li key={i}>
              <span>{a.nomeArquivo}</span>
              <button type="button" className="btn-remove-anexo" onClick={() => onRemoveAnexo(i)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="agua-edit-actions">
        <button className="btn-confirm" onClick={onSave} disabled={saving || !registro.titulo.trim()}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        <button className="btn-cancel" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

/* ── Carrossel de Anexos ── */

function AnexoCarrossel({ anexos }) {
  const [indice, setIndice] = useState(0)
  const anexo = anexos[indice]
  const isImagem = anexo.base64.startsWith('data:image/')

  function anterior() {
    setIndice((prev) => (prev === 0 ? anexos.length - 1 : prev - 1))
  }

  function proximo() {
    setIndice((prev) => (prev === anexos.length - 1 ? 0 : prev + 1))
  }

  function handleDownload() {
    const link = document.createElement('a')
    link.href = anexo.base64
    link.download = anexo.nomeArquivo
    link.click()
  }

  return (
    <div className="anexo-carrossel">
      <div className="carrossel-viewer">
        {anexos.length > 1 && (
          <button className="carrossel-seta carrossel-seta-esq" onClick={anterior}>
            &#8249;
          </button>
        )}

        <div className="carrossel-preview">
          {isImagem ? (
            <img src={anexo.base64} alt={anexo.nomeArquivo} />
          ) : (
            <iframe src={anexo.base64} title={anexo.nomeArquivo} />
          )}
        </div>

        {anexos.length > 1 && (
          <button className="carrossel-seta carrossel-seta-dir" onClick={proximo}>
            &#8250;
          </button>
        )}
      </div>

      <div className="carrossel-info">
        {anexos.length > 1 && (
          <span className="carrossel-contador">{indice + 1} / {anexos.length}</span>
        )}
        <span className="carrossel-nome">{anexo.nomeArquivo}</span>
        <button className="btn-download-anexo" onClick={handleDownload}>
          Baixar
        </button>
      </div>
    </div>
  )
}

/* ── Card de Registro ── */

function RegistroCard({ registro, isAdmin, saving, onEdit, onDelete }) {
  return (
    <div className="agua-card">
      <div className="agua-card-header">
        <h3>{registro.titulo}</h3>
        <span className="agua-data">{registro.criadoEm}</span>
      </div>
      {registro.observacoes && <p className="agua-observacoes">{registro.observacoes}</p>}

      {registro.anexos && registro.anexos.length > 0 && (
        <AnexoCarrossel anexos={registro.anexos} />
      )}

      {isAdmin && (
        <div className="agua-admin-actions">
          <button className="btn-edit" onClick={() => onEdit(registro)} disabled={saving}>
            Editar
          </button>
          <button className="btn-delete" onClick={() => onDelete(registro.id)} disabled={saving}>
            Deletar
          </button>
        </div>
      )}
    </div>
  )
}

export default function AguaExtra() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const hook = useAguaExtra()
  const isAdmin = user.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="agua-extra">
      <header className="agua-header">
        <div className="agua-header-left">
          <button onClick={() => navigate('/home')} className="btn-voltar">Voltar</button>
          <h1>Sessão Especial sobre Água Extra</h1>
        </div>
        <div className="dashboard-header-right">
          <span className="user-role">
            {isAdmin ? 'Administrador' : 'Visualização'}
          </span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="agua-content">
        {hook.saveMsg && (
          <div className={`save-msg ${hook.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
            {hook.saveMsg}
          </div>
        )}

        {isAdmin && !hook.editingRegistro && (
          <NovoRegistroForm saving={hook.saving} onSubmit={hook.handleAdd} />
        )}

        {hook.editingRegistro && (
          <EditRegistroForm
            registro={hook.editingRegistro}
            saving={hook.saving}
            onSave={hook.handleSaveEdit}
            onCancel={hook.handleCancelEdit}
            onUpdateField={hook.updateEditingField}
            onAddAnexo={hook.addAnexoToEditing}
            onRemoveAnexo={hook.removeAnexoFromEditing}
          />
        )}

        {hook.loading && <div className="agua-loading">Carregando...</div>}

        {!hook.loading && hook.registros.length === 0 && (
          <p className="sem-registros">Ainda não foi registrado nenhum documento.</p>
        )}

        {!hook.loading && hook.registros.length > 0 && (
          <div className="agua-lista">
            {hook.registros.map((reg) => (
              <RegistroCard
                key={reg.id}
                registro={reg}
                isAdmin={isAdmin && !hook.editingRegistro}
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
