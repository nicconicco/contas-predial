const VALOR_INTERNO = 50
const VALOR_EXTERNO = 30

export default function FundoTable({
  apartamentos,
  isAdmin,
  saving,
  onToggleFundo,
  onSave,
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
                <td className="cell-total">R$ {totalMes.toFixed(2)}</td>
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
