function ComprovanteCard({
  titulo,
  tipo,
  nomeArquivo,
  pendingFile,
  isAdmin,
  saving,
  onUpload,
  onConfirmUpload,
  onDownload,
  onDelete,
}) {
  return (
    <div className="comprovante-card">
      <h3>{titulo}</h3>

      {/* Arquivo ja salvo no Firestore */}
      {nomeArquivo && !pendingFile && (
        <>
          <p className="comprovante-nome">{nomeArquivo}</p>
          <div className="comprovante-actions">
            <button className="btn-download" onClick={() => onDownload(tipo)} disabled={saving}>
              Baixar PDF
            </button>
            {isAdmin && (
              <button className="btn-delete" onClick={() => onDelete(tipo)} disabled={saving}>
                Deletar
              </button>
            )}
          </div>
        </>
      )}

      {/* Nenhum arquivo salvo e nenhum pendente */}
      {!nomeArquivo && !pendingFile && (
        <p className="sem-comprovante">Ainda não foi subido nenhum documento nesse mês</p>
      )}

      {/* Arquivo pendente selecionado mas nao confirmado */}
      {pendingFile && (
        <div className="pending-file">
          <p className="comprovante-nome">{pendingFile.nomeArquivo}</p>
          <button
            className="btn-confirm"
            onClick={() => onConfirmUpload(tipo)}
            disabled={saving}
          >
            {saving ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      )}

      {/* Botao de enviar PDF (admin) */}
      {isAdmin && (
        <label className="btn-upload">
          {nomeArquivo || pendingFile ? 'Trocar PDF' : 'Enviar PDF'}
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => onUpload(tipo, e)}
            hidden
          />
        </label>
      )}
    </div>
  )
}

export default function ComprovantesSection({
  comprovanteAgua,
  comprovanteLuz,
  comprovanteDivisaoAguaLuz,
  isAdmin,
  saving,
  pendingFiles,
  onUpload,
  onConfirmUpload,
  onDownload,
  onDelete,
}) {
  return (
    <div className="comprovantes-section">
      <ComprovanteCard
        titulo="Comprovante Geral de Água"
        tipo="agua"
        nomeArquivo={comprovanteAgua}
        pendingFile={pendingFiles.agua}
        isAdmin={isAdmin}
        saving={saving}
        onUpload={onUpload}
        onConfirmUpload={onConfirmUpload}
        onDownload={onDownload}
        onDelete={onDelete}
      />
      <ComprovanteCard
        titulo="Comprovante Geral de Luz"
        tipo="luz"
        nomeArquivo={comprovanteLuz}
        pendingFile={pendingFiles.luz}
        isAdmin={isAdmin}
        saving={saving}
        onUpload={onUpload}
        onConfirmUpload={onConfirmUpload}
        onDownload={onDownload}
        onDelete={onDelete}
      />
      <ComprovanteCard
        titulo="Divisão de Água e Luz"
        tipo="divisaoAguaLuz"
        nomeArquivo={comprovanteDivisaoAguaLuz}
        pendingFile={pendingFiles.divisaoAguaLuz}
        isAdmin={isAdmin}
        saving={saving}
        onUpload={onUpload}
        onConfirmUpload={onConfirmUpload}
        onDownload={onDownload}
        onDelete={onDelete}
      />
    </div>
  )
}
