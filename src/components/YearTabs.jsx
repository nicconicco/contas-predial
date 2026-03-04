import { ANOS } from '../constants/app'

export default function YearTabs({ anoSelecionado, onSelect }) {
  return (
    <div className="tabs-ano">
      {ANOS.map((ano) => (
        <button
          key={ano}
          className={`tab-ano ${anoSelecionado === ano ? 'tab-ano-active' : ''}`}
          onClick={() => onSelect(ano)}
        >
          Ano {ano}
        </button>
      ))}
    </div>
  )
}
