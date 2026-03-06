export default function TotaisPanel({ totais, ano, onClose }) {
  const grandeTotal = totais.reduce((sum, t) => sum + t.total, 0)
  const grandeTotalInterno = totais.reduce((sum, t) => sum + t.totalInterno, 0)
  const grandeTotalExterno = totais.reduce((sum, t) => sum + t.totalExterno, 0)

  return (
    <div className="totais-overlay">
      <div className="totais-panel">
        <div className="totais-header">
          <h2>Valores Totais — {ano}</h2>
          <button className="btn-fechar-totais" onClick={onClose}>Fechar</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Total Interno</th>
                <th>Total Externo</th>
                <th>Total Geral</th>
              </tr>
            </thead>
            <tbody>
              {totais.map((t) => (
                <tr key={t.nome}>
                  <td className="cell-nome">{t.nome}</td>
                  <td>R$ {t.totalInterno.toFixed(2)}</td>
                  <td>R$ {t.totalExterno.toFixed(2)}</td>
                  <td className="cell-total">R$ {t.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="totais-row-final">
                <td className="cell-nome">TOTAL GERAL</td>
                <td>R$ {grandeTotalInterno.toFixed(2)}</td>
                <td>R$ {grandeTotalExterno.toFixed(2)}</td>
                <td className="cell-total">R$ {grandeTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
