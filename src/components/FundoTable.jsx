const VALOR_INTERNO = 50
const VALOR_EXTERNO = 30

export default function FundoTable({
  apartamentos,
  isAdmin,
  saving,
  onToggleFundo,
  onChangeValorManual,
  onSave,
  onUploadComprovanteApt,
  onDownloadComprovanteApt,
  onDeleteComprovanteApt,
}) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Fundo Interno (R$50)</th>
            <th>Fundo Externo (R$30)</th>
            <th>Total do Mês</th>
            {isAdmin && <th>Comprovante PDF</th>}
            {isAdmin && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {apartamentos.map((row, index) => {
            const totalMes =
              (row.fundoInterno === 'Sim' ? VALOR_INTERNO : 0) +
              (row.fundoExterno === 'Sim' ? VALOR_EXTERNO : 0)

            return (
              <tr key={index}>
                <td className="cell-nome">{row.nome}</td>
                <td>
                  {isAdmin ? (
                    <button
                      className={`btn-toggle ${row.fundoInterno === 'Sim' ? 'toggle-sim' : 'toggle-nao'}`}
                      onClick={() => onToggleFundo(index, 'fundoInterno')}
                    >
                      {row.fundoInterno}
                    </button>
                  ) : (
                    <span className={`status ${row.fundoInterno === 'Sim' ? 'status-sim' : 'status-nao'}`}>
                      {row.fundoInterno}
                    </span>
                  )}
                </td>
                <td>
                  {isAdmin ? (
                    <button
                      className={`btn-toggle ${row.fundoExterno === 'Sim' ? 'toggle-sim' : 'toggle-nao'}`}
                      onClick={() => onToggleFundo(index, 'fundoExterno')}
                    >
                      {row.fundoExterno}
                    </button>
                  ) : (
                    <span className={`status ${row.fundoExterno === 'Sim' ? 'status-sim' : 'status-nao'}`}>
                      {row.fundoExterno}
                    </span>
                  )}
                </td>
                <td className="cell-total">
                  {isAdmin ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-valor-total"
                      value={row.valorManual !== '' && row.valorManual != null ? row.valorManual : ''}
                      placeholder={totalMes.toFixed(2)}
                      onChange={(e) => onChangeValorManual(index, e.target.value)}
                    />
                  ) : (
                    <>R$ {(row.valorManual !== '' && row.valorManual != null ? Number(row.valorManual) : totalMes).toFixed(2)}</>
                  )}
                </td>
                {isAdmin && (
                  <td className="cell-comprovante">
                    {row.comprovantePdf ? (
                      <>
                        <span className="comprovante-apt-nome">{row.comprovantePdf}</span>
                        <div className="comprovante-apt-actions">
                          <button
                            className="btn-download-sm"
                            onClick={() => onDownloadComprovanteApt(index)}
                            disabled={saving}
                          >
                            Baixar
                          </button>
                          <button
                            className="btn-delete-sm"
                            onClick={() => onDeleteComprovanteApt(index)}
                            disabled={saving}
                          >
                            Deletar
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="sem-comprovante-apt">Nenhum</span>
                    )}
                    <label className="btn-upload-sm">
                      {row.comprovantePdf ? 'Trocar' : 'Enviar'}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onUploadComprovanteApt(index, e)}
                        hidden
                      />
                    </label>
                  </td>
                )}
                {isAdmin && (
                  <td>
                    <button className="btn-atualizar" onClick={onSave} disabled={saving}>
                      {saving ? '...' : 'Atualizar'}
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
