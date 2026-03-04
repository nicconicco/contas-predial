const XLSX = require('xlsx')
const path = require('path')

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const inquilinos = [
  'Apartamento 101',
  'Apartamento 102',
  'Apartamento 103',
  'Apartamento 201',
  'Apartamento 202',
]

// --- 2025: Todos Não pagaram em todos os meses ---
const wb2025 = XLSX.utils.book_new()
meses.forEach((mes) => {
  const data = inquilinos.map((nome) => ({
    Nome: nome,
    'Pagamento Água': 'Não',
    'Pagamento Luz': 'Não',
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb2025, ws, mes)
})
const comp2025 = meses.map((mes) => ({
  'Mês': mes,
  'Comprovante Água': '',
  'Comprovante Luz': '',
}))
const wsComp2025 = XLSX.utils.json_to_sheet(comp2025)
XLSX.utils.book_append_sheet(wb2025, wsComp2025, 'Comprovantes')

const out2025 = path.join(__dirname, '..', '..', 'public', 'data', 'dados_2025.xlsx')
XLSX.writeFile(wb2025, out2025)
console.log('Planilha 2025 criada em:', out2025)

// --- 2026: Apenas Janeiro com Sim, resto Não ---
const wb2026 = XLSX.utils.book_new()
meses.forEach((mes) => {
  const pago = mes === 'Janeiro' ? 'Sim' : 'Não'
  const data = inquilinos.map((nome) => ({
    Nome: nome,
    'Pagamento Água': pago,
    'Pagamento Luz': pago,
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb2026, ws, mes)
})
const comp2026 = meses.map((mes) => ({
  'Mês': mes,
  'Comprovante Água': mes === 'Janeiro' ? 'janeiro_agua.pdf' : '',
  'Comprovante Luz': mes === 'Janeiro' ? 'janeiro_luz.pdf' : '',
}))
const wsComp2026 = XLSX.utils.json_to_sheet(comp2026)
XLSX.utils.book_append_sheet(wb2026, wsComp2026, 'Comprovantes')

const out2026 = path.join(__dirname, '..', '..', 'public', 'data', 'dados_2026.xlsx')
XLSX.writeFile(wb2026, out2026)
console.log('Planilha 2026 criada em:', out2026)
