export default function ComprovantesSection({
  comprovanteAgua,
  comprovanteLuz,
  isAdmin,
  baseUrl,
  onUpload,
}) {
  return (
    <div className="comprovantes-section">
      <div className="comprovante-card">
        <h3>Comprovante Geral de Água</h3>
        {comprovanteAgua ? (
          <a
            href={`${baseUrl}comprovantes/agua/${comprovanteAgua}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download"
          >
            Baixar PDF
          </a>
        ) : (
          <p className="sem-comprovante">Ainda não foi subido nenhum documento nesse mês</p>
        )}
        {isAdmin && (
          <label className="btn-upload">
            Enviar PDF
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => onUpload('comprovanteAgua', e)}
              hidden
            />
          </label>
        )}
      </div>

      <div className="comprovante-card">
        <h3>Comprovante Geral de Luz</h3>
        {comprovanteLuz ? (
          <a
            href={`${baseUrl}comprovantes/luz/${comprovanteLuz}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download"
          >
            Baixar PDF
          </a>
        ) : (
          <p className="sem-comprovante">Ainda não foi subido nenhum documento nesse mês</p>
        )}
        {isAdmin && (
          <label className="btn-upload">
            Enviar PDF
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => onUpload('comprovanteLuz', e)}
              hidden
            />
          </label>
        )}
      </div>
    </div>
  )
}
