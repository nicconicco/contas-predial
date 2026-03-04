import * as XLSX from 'xlsx'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const ANOS = ['2025', '2026']

export { MESES, ANOS }

export async function readXlsx(ano) {
  const url = `${import.meta.env.BASE_URL}data/dados_${ano}.xlsx`
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  const mesesData = {}
  MESES.forEach((mes) => {
    const sheet = workbook.Sheets[mes]
    mesesData[mes] = sheet ? XLSX.utils.sheet_to_json(sheet) : []
  })

  const compSheet = workbook.Sheets['Comprovantes']
  const comprovantes = {}
  if (compSheet) {
    const rows = XLSX.utils.sheet_to_json(compSheet)
    rows.forEach((row) => {
      comprovantes[row['Mês']] = {
        agua: row['Comprovante Água'] || '',
        luz: row['Comprovante Luz'] || '',
      }
    })
  }

  return { mesesData, comprovantes }
}

export function generateXlsx(mesesData, comprovantes, ano) {
  const wb = XLSX.utils.book_new()

  MESES.forEach((mes) => {
    const ws = XLSX.utils.json_to_sheet(mesesData[mes] || [])
    XLSX.utils.book_append_sheet(wb, ws, mes)
  })

  const compRows = MESES.map((mes) => ({
    'Mês': mes,
    'Comprovante Água': comprovantes[mes]?.agua || '',
    'Comprovante Luz': comprovantes[mes]?.luz || '',
  }))
  const wsComp = XLSX.utils.json_to_sheet(compRows)
  XLSX.utils.book_append_sheet(wb, wsComp, 'Comprovantes')

  XLSX.writeFile(wb, `dados_${ano}.xlsx`)
}
