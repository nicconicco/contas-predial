import { MESES, MESES_CURTOS } from '../constants/app'

export default function MonthTabs({ mesSelecionado, onSelect }) {
  return (
    <div className="tabs">
      {MESES.map((mes, i) => (
        <button
          key={mes}
          className={`tab ${mesSelecionado === mes ? 'tab-active' : ''}`}
          onClick={() => onSelect(mes)}
        >
          {MESES_CURTOS[i]}
        </button>
      ))}
    </div>
  )
}
