import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSecoes } from '../../hooks/useSecoes'
import './Secoes.css'

/* ── Formulário: Nova Seção ── */

function NovaSecaoForm({ saving, onSubmit }) {
  const [titulo, setTitulo] = useState('')
  const [subtitulo, setSubtitulo] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    onSubmit({ titulo: titulo.trim(), subtitulo: subtitulo.trim() })
    setTitulo('')
    setSubtitulo('')
  }

  return (
    <form className="secao-form" onSubmit={handleSubmit}>
      <h3>Criar Nova Seção</h3>
      <input
        type="text"
        placeholder="Título da seção"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="secao-input"
        required
      />
      <input
        type="text"
        placeholder="Subtítulo (opcional)"
        value={subtitulo}
        onChange={(e) => setSubtitulo(e.target.value)}
        className="secao-input"
      />
      <button type="submit" className="btn-submeter" disabled={saving || !titulo.trim()}>
        {saving ? 'Criando...' : 'Criar Seção'}
      </button>
    </form>
  )
}

/* ── Card de Seção (na grid) ── */

function SecaoCard({ secao, isAdmin, saving, onClick, onEdit, onDelete }) {
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(secao.titulo)
  const [subtitulo, setSubtitulo] = useState(secao.subtitulo || '')

  function handleCancelar() {
    setTitulo(secao.titulo)
    setSubtitulo(secao.subtitulo || '')
    setEditando(false)
  }

  function handleSalvar(e) {
    e.stopPropagation()
    if (!titulo.trim()) return
    onEdit(secao.id, { titulo: titulo.trim(), subtitulo: subtitulo.trim() })
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="secao-card secao-card-editando" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="secao-input"
          placeholder="Título"
        />
        <input
          type="text"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
          className="secao-input"
          placeholder="Subtítulo"
        />
        <div className="secao-edit-actions">
          <button className="btn-salvar-edit" onClick={handleSalvar} disabled={saving || !titulo.trim()}>
            Salvar
          </button>
          <button className="btn-cancelar-edit" onClick={handleCancelar} disabled={saving}>
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="secao-card" onClick={onClick}>
      <h2>{secao.titulo}</h2>
      {secao.subtitulo && <p className="secao-subtitulo">{secao.subtitulo}</p>}
      {isAdmin && (
        <div className="secao-admin-actions">
          <button
            className="btn-edit-secao"
            onClick={(e) => { e.stopPropagation(); setEditando(true) }}
            disabled={saving}
          >
            Editar
          </button>
          <button
            className="btn-delete-secao"
            onClick={(e) => { e.stopPropagation(); onDelete(secao.id) }}
            disabled={saving}
          >
            Deletar
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Formulário: Nova Anotação ── */

function NovaAnotacaoForm({ saving, onSubmit }) {
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
      anexos,
    })
    setTitulo('')
    setDescricao('')
    setCusto('')
    setAnexos([])
  }

  return (
    <form className="secao-form" onSubmit={handleSubmit}>
      <h3>Nova Anotação</h3>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="secao-input"
        required
      />
      <textarea
        placeholder="Descrição (máx. 2048 caracteres)"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value.slice(0, 2048))}
        className="secao-textarea"
        maxLength={2048}
      />
      <div className="secao-char-count">{descricao.length}/2048</div>
      <input
        type="number"
        placeholder="Custo (R$)"
        value={custo}
        onChange={(e) => setCusto(e.target.value)}
        className="secao-input"
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

/* ── Card de Anotação ── */

function AnotacaoCard({ anotacao, isAdmin, saving, onEdit, onDelete }) {
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(anotacao.titulo)
  const [descricao, setDescricao] = useState(anotacao.descricao || '')
  const [custo, setCusto] = useState(String(anotacao.custo || 0))
  const [anexos, setAnexos] = useState(anotacao.anexos || [])

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
    setTitulo(anotacao.titulo)
    setDescricao(anotacao.descricao || '')
    setCusto(String(anotacao.custo || 0))
    setAnexos(anotacao.anexos || [])
    setEditando(false)
  }

  function handleSalvar() {
    if (!titulo.trim()) return
    onEdit(anotacao.id, {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      custo: parseFloat(custo) || 0,
      anexos,
    })
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="anotacao-card anotacao-card-editando">
        <h3 className="anotacao-edit-title">Editando Anotação</h3>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="secao-input"
          placeholder="Título"
        />
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value.slice(0, 2048))}
          className="secao-textarea"
          placeholder="Descrição (máx. 2048 caracteres)"
          maxLength={2048}
        />
        <div className="secao-char-count">{descricao.length}/2048</div>
        <input
          type="number"
          value={custo}
          onChange={(e) => setCusto(e.target.value)}
          className="secao-input"
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

        <div className="anotacao-edit-actions">
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
    <div className="anotacao-card">
      <div className="anotacao-card-header">
        <h3>{anotacao.titulo}</h3>
        <span className="anotacao-data">{anotacao.criadoEm}</span>
      </div>
      {anotacao.descricao && <p className="anotacao-descricao">{anotacao.descricao}</p>}
      {anotacao.custo > 0 && (
        <p className="anotacao-custo">Custo: R$ {Number(anotacao.custo).toFixed(2)}</p>
      )}

      {anotacao.anexos && anotacao.anexos.length > 0 && (
        <div className="anotacao-anexos">
          {anotacao.anexos.map((a, i) => (
            <button key={i} className="btn-download-anexo" onClick={() => handleDownload(a)}>
              {a.nomeArquivo}
            </button>
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="anotacao-admin-actions">
          <button className="btn-edit-anotacao" onClick={() => setEditando(true)} disabled={saving}>
            Editar
          </button>
          <button className="btn-delete-anotacao" onClick={() => onDelete(anotacao.id)} disabled={saving}>
            Deletar
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Página Principal ── */

export default function Secoes() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const hook = useSecoes()
  const isAdmin = user.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/')
  }

  // Vista 2: Anotações da seção selecionada
  if (hook.secaoSelecionada) {
    return (
      <div className="secoes">
        <header className="secoes-header">
          <div className="secoes-header-left">
            <button onClick={hook.voltarParaLista} className="btn-voltar">Voltar</button>
            <div>
              <h1>{hook.secaoSelecionada.titulo}</h1>
              {hook.secaoSelecionada.subtitulo && (
                <p className="secoes-header-subtitulo">{hook.secaoSelecionada.subtitulo}</p>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </header>

        <main className="secoes-content">
          {hook.saveMsg && (
            <div className={`save-msg ${hook.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
              {hook.saveMsg}
            </div>
          )}

          {hook.loading && <div className="secoes-loading">Carregando...</div>}

          {!hook.loading && hook.anotacoes.length === 0 && (
            <p className="sem-anotacoes">Nenhuma anotação registrada nesta seção.</p>
          )}

          {!hook.loading && hook.anotacoes.map((anotacao) => (
            <AnotacaoCard
              key={anotacao.id}
              anotacao={anotacao}
              isAdmin={isAdmin}
              saving={hook.saving}
              onEdit={hook.handleEditAnotacao}
              onDelete={hook.handleDeleteAnotacao}
            />
          ))}

          {isAdmin && (
            <NovaAnotacaoForm
              saving={hook.saving}
              onSubmit={hook.handleAddAnotacao}
            />
          )}
        </main>
      </div>
    )
  }

  // Vista 1: Lista de seções
  return (
    <div className="secoes">
      <header className="secoes-header">
        <div className="secoes-header-left">
          <button onClick={() => navigate('/home')} className="btn-voltar">Voltar</button>
          <h1>Seções</h1>
        </div>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </header>

      <main className="secoes-content">
        {hook.saveMsg && (
          <div className={`save-msg ${hook.saveMsg.startsWith('Erro') ? 'save-msg-error' : 'save-msg-success'}`}>
            {hook.saveMsg}
          </div>
        )}

        {hook.loading && <div className="secoes-loading">Carregando...</div>}

        {!hook.loading && hook.secoes.length === 0 && !isAdmin && (
          <p className="sem-anotacoes">Nenhuma seção disponível.</p>
        )}

        {!hook.loading && (
          <div className="secoes-grid">
            {hook.secoes.map((secao) => (
              <SecaoCard
                key={secao.id}
                secao={secao}
                isAdmin={isAdmin}
                saving={hook.saving}
                onClick={() => hook.selectSecao(secao)}
                onEdit={hook.handleEditSecao}
                onDelete={hook.handleDeleteSecao}
              />
            ))}
          </div>
        )}

        {isAdmin && (
          <NovaSecaoForm saving={hook.saving} onSubmit={hook.handleAddSecao} />
        )}
      </main>
    </div>
  )
}
