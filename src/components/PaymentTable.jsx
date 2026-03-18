export default function PaymentTable({
  apartamentos,
  isAdmin,
  saving,
  onTogglePayment,
  onChangePessoas,
  onChangeValorTotal,
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
            <th>Qtd. Pessoas</th>
            <th>Pagamento Água</th>
            <th>Pagamento Luz</th>
            {isAdmin && <th>Valor Total</th>}
            {isAdmin && <th>Comprovante PDF</th>}
            {isAdmin && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {apartamentos.map((row, index) => (
            <tr key={index}>
              <td className="cell-nome">{row.nome}</td>
              <td className="cell-pessoas">
                {isAdmin ? (
                  <input
                    type="number"
                    min="0"
                    className="input-pessoas"
                    value={row.quantidadePessoas}
                    onChange={(e) => onChangePessoas(index, e.target.value)}
                  />
                ) : (
                  row.quantidadePessoas
                )}
              </td>
              <td>
                {isAdmin ? (
                  <button
                    className={`btn-toggle ${row.pagamentoAgua === 'Sim' ? 'toggle-sim' : 'toggle-nao'}`}
                    onClick={() => onTogglePayment(index, 'pagamentoAgua')}
                  >
                    {row.pagamentoAgua}
                  </button>
                ) : (
                  <span className={`status ${row.pagamentoAgua === 'Sim' ? 'status-sim' : 'status-nao'}`}>
                    {row.pagamentoAgua}
                  </span>
                )}
              </td>
              <td>
                {isAdmin ? (
                  <button
                    className={`btn-toggle ${row.pagamentoLuz === 'Sim' ? 'toggle-sim' : 'toggle-nao'}`}
                    onClick={() => onTogglePayment(index, 'pagamentoLuz')}
                  >
                    {row.pagamentoLuz}
                  </button>
                ) : (
                  <span className={`status ${row.pagamentoLuz === 'Sim' ? 'status-sim' : 'status-nao'}`}>
                    {row.pagamentoLuz}
                  </span>
                )}
              </td>
              {isAdmin && (
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-valor-total"
                    value={row.valorTotal ?? ''}
                    placeholder="0,00"
                    onChange={(e) => onChangeValorTotal(index, e.target.value)}
                  />
                </td>
              )}
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
          ))}
        </tbody>
      </table>
    </div>
  )
}
