import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useConsertos } from '../../hooks/useConsertos'
import { APARTAMENTOS } from '../../constants/app'
import './Consertos.css'

function NovaObservacaoForm({ saving, onSubmit }) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [custo, setCusto] = useState('')
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
      descricao: descricao.trim(),
      custo: parseFloat(custo) || 0,
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      anexos,
    })
    setTitulo('')
    setDescricao('')
    setCusto('')
    setAnexos([])
  }

  return (
    <form className="obs-form" onSubmit={handleSubmit}>
      <h3>Nova Observação</h3>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="obs-input"
        required
      />
      <textarea
        placeholder="Descrição (máx. 1024 caracteres)"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value.slice(0, 1024))}
        className="obs-textarea"
        maxLength={1024}
      />
      <div className="obs-char-count">{descricao.length}/1024</div>
      <input
        type="number"
        placeholder="Custo (R$)"
        value={custo}
        onChange={(e) => setCusto(e.target.value)}
        className="obs-input"
        min="0"
        step="0.01"
      />

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

function ObservacaoCard({ obs, isAdmin, saving, onDelete, onEdit }) {
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(obs.titulo)
  const [descricao, setDescricao] = useState(obs.descricao || '')
  const [custo, setCusto] = useState(String(obs.custo || 0))
  const [anexos, setAnexos] = useState(obs.anexos || [])

  function handleDownload(anexo) {
    const link = document.createElement('a')
    link.href = anexo.base64
    link.download = anexo.nomeArquivo
    link.click()
  }

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

  function handleCancelar() {
    setTitulo(obs.titulo)
    setDescricao(obs.descricao || '')
    setCusto(String(obs.custo || 0))
    setAnexos(obs.anexos || [])
    setEditando(false)
  }

  function handleSalvar() {
    if (!titulo.trim()) return
    onEdit(obs.id, {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      custo: parseFloat(custo) || 0,
      anexos,
    })
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="obs-card obs-card-editando">
        <h3 className="obs-edit-title">Editando Observação</h3>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="obs-input"
          placeholder="Título"
          required
        />
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value.slice(0, 1024))}
          className="obs-textarea"
          placeholder="Descrição (máx. 1024 caracteres)"
          maxLength={1024}
        />
        <div className="obs-char-count">{descricao.length}/1024</div>
        <input
          type="number"
          value={custo}
          onChange={(e) => setCusto(e.target.value)}
          className="obs-input"
          placeholder="Custo (R$)"
          min="0"
          step="0.01"
        />

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

        <label className="btn-add-anexo">
          Adicionar Imagem/PDF
          <input type="file" accept="image/*,.pdf" onChange={handleAddAnexo} hidden />
        </label>

        <div className="obs-edit-actions">
          <button className="btn-salvar-edit" onClick={handleSalvar} disabled={saving || !titulo.trim()}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button className="btn-cancelar-edit" onClick={handleCancelar} disabled={saving}>
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="obs-card">
      <div className="obs-card-header">
        <h3>{obs.titulo}</h3>
        <span className="obs-data">{obs.criadoEm}</span>
      </div>
      {obs.descricao && <p className="obs-descricao">{obs.descricao}</p>}
      <p className="obs-custo">Custo: R$ {Number(obs.custo).toFixed(2)}</p>

      {obs.anexos && obs.anexos.length > 0 && (
        <div className="obs-anexos">
          {obs.anexos.map((a, i) => (
            <button key={i} className="btn-download-anexo" onClick={() => handleDownload(a)}>
              {a.nomeArquivo}
            </button>
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="obs-admin-actions">
          <button className="btn-edit-obs" onClick={() => setEditando(true)} disabled={saving}>
            Editar
          </button>
          <button className="btn-delete-obs" onClick={() => onDelete(obs.id)} disabled={saving}>
            Deletar
          </button>
        </div>
      )}
    </div>
  )
}

export default function Consertos() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const consertos = useConsertos()
  const isAdmin = user.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/')
  }

  // Vista 2: Observacoes do apartamento
  if (consertos.apartamentoSelecionado) {
    return (
      <div className="consertos">
        <header className="consertos-header">
          <div className="consertos-header-left">
            <button onClick={consertos.voltarParaLista} className="btn-voltar">Voltar</button>
            <h1>{consertos.apartamentoSelecionado}</h1>
          </div>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </header>

        <main className="consertos-content">
          {consertos.saveMsg && (
            <div className={`save-msg ${consertos.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
              {consertos.saveMsg}
            </div>
          )}

          {consertos.loading && <div className="consertos-loading">Carregando...</div>}

          {!consertos.loading && consertos.observacoes.length === 0 && (
            <p className="sem-observacoes">Nenhuma observação registrada para este apartamento.</p>
          )}

          {!consertos.loading && consertos.observacoes.map((obs) => (
            <ObservacaoCard
              key={obs.id}
              obs={obs}
              isAdmin={isAdmin}
              saving={consertos.saving}
              onDelete={consertos.handleDeleteObservacao}
              onEdit={consertos.handleEditObservacao}
            />
          ))}

          {isAdmin && (
            <NovaObservacaoForm
              saving={consertos.saving}
              onSubmit={consertos.handleAddObservacao}
            />
          )}
        </main>
      </div>
    )
  }

  // Vista 1: Lista de apartamentos
  return (
    <div className="consertos">
      <header className="consertos-header">
        <div className="consertos-header-left">
          <button onClick={() => navigate('/home')} className="btn-voltar">Voltar</button>
          <h1>Consertos Realizados</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </header>

      <main className="consertos-content">
        <div className="apartamentos-grid">
          {APARTAMENTOS.map((nome) => (
            <button
              key={nome}
              className="apartamento-card"
              onClick={() => consertos.selectApartamento(nome)}
            >
              {nome}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
