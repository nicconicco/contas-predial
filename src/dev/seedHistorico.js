import { doc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { MESES } from '../constants/app'

const INQUILINOS = [
  'Térreo',
  'Apartamento 11',
  'Apartamento 12',
  'Apartamento 21',
  'Apartamento 22',
  'Apartamento 31',
  'Apartamento 32',
  'Casa 00',
  'Loja 00',
]

// Dados extraidos da planilha "Rateio do condominio outubro 2024 a dezembro 2025"
// Chave: "Ano-Mes" => { nomeApto: { pessoas, agua, luz } }
const DADOS = {
  '2024-Outubro': {
    'Apartamento 11': { pessoas: 1, agua: 54.23, luz: 5.00 },
    'Apartamento 12': { pessoas: 1, agua: 54.23, luz: 5.00 },
    'Apartamento 21': { pessoas: 1, agua: 54.23, luz: 5.00 },
    'Apartamento 22': { pessoas: 1, agua: 54.23, luz: 5.00 },
    'Apartamento 31': { pessoas: 2, agua: 108.46, luz: 5.00 },
    'Apartamento 32': { pessoas: 1, agua: 54.23, luz: 5.00 },
    'Casa 00': { pessoas: 3, agua: 162.69, luz: 0 },
    'Térreo': { pessoas: 3, agua: 162.69, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 176.54, luz: 0 },
  },
  '2024-Novembro': {
    'Apartamento 11': { pessoas: 1, agua: 54.89, luz: 4.72 },
    'Apartamento 12': { pessoas: 1, agua: 54.89, luz: 4.72 },
    'Apartamento 21': { pessoas: 1, agua: 54.88, luz: 4.72 },
    'Apartamento 22': { pessoas: 1, agua: 54.89, luz: 4.72 },
    'Apartamento 31': { pessoas: 2, agua: 109.78, luz: 4.72 },
    'Apartamento 32': { pessoas: 1, agua: 54.89, luz: 4.72 },
    'Casa 00': { pessoas: 3, agua: 164.67, luz: 0 },
    'Térreo': { pessoas: 3, agua: 164.67, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 176.54, luz: 0 },
  },
  '2024-Dezembro': {
    'Apartamento 11': { pessoas: 1, agua: 54.45, luz: 4.83 },
    'Apartamento 12': { pessoas: 1, agua: 54.45, luz: 4.83 },
    'Apartamento 21': { pessoas: 1, agua: 54.45, luz: 4.83 },
    'Apartamento 22': { pessoas: 1, agua: 54.45, luz: 4.83 },
    'Apartamento 31': { pessoas: 2, agua: 108.90, luz: 4.83 },
    'Apartamento 32': { pessoas: 1, agua: 54.46, luz: 4.83 },
    'Casa 00': { pessoas: 3, agua: 163.35, luz: 0 },
    'Térreo': { pessoas: 3, agua: 163.35, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 176.54, luz: 0 },
  },
  '2025-Janeiro': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 6.11 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 6.11 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 6.11 },
    'Apartamento 22': { pessoas: 1, agua: 10.00, luz: 6.11 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 6.11 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 6.11 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 13.11, luz: 0 },
  },
  '2025-Fevereiro': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 7.14 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 7.14 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 7.14 },
    'Apartamento 22': { pessoas: 1, agua: 10.00, luz: 7.14 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 7.14 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 7.14 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 180.85, luz: 0 },
  },
  '2025-Março': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 0 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 7.14 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 7.14 },
    'Apartamento 22': { pessoas: 1, agua: 0, luz: 7.14 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 7.14 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 7.14 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 185.16, luz: 0 },
  },
  '2025-Abril': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 12.49 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 12.49 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 12.49 },
    'Apartamento 22': { pessoas: 1, agua: 0, luz: 12.49 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 12.49 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 12.49 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 185.16, luz: 0 },
  },
  '2025-Maio': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 0 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 0 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 0 },
    'Apartamento 22': { pessoas: 1, agua: 0, luz: 0 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 0 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 0 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 190.20, luz: 0 },
  },
  '2025-Junho': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 6.58 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 6.58 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 6.58 },
    'Apartamento 22': { pessoas: 1, agua: 0, luz: 6.58 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 6.58 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 6.58 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 187.68, luz: 0 },
  },
  '2025-Julho': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 7.39 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 7.39 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 7.39 },
    'Apartamento 22': { pessoas: 1, agua: 0, luz: 7.39 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 7.39 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 7.39 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 192.16, luz: 0 },
  },
  '2025-Agosto': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 8.18 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 8.18 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 8.18 },
    'Apartamento 22': { pessoas: 1, agua: 0, luz: 8.18 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 8.18 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 8.18 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 218.84, luz: 0 },
  },
  '2025-Setembro': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 7.98 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 7.98 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 7.98 },
    'Apartamento 22': { pessoas: 1, agua: 0, luz: 7.98 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 7.98 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 7.98 },
    'Casa 00': { pessoas: 3, agua: 0, luz: 0 },
    'Térreo': { pessoas: 3, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 196.64, luz: 0 },
  },
  '2025-Outubro': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 0 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 7.98 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 7.98 },
    'Apartamento 22': { pessoas: 1, agua: 10.00, luz: 7.98 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 7.98 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 7.98 },
    'Casa 00': { pessoas: 2, agua: 0, luz: 0 },
    'Térreo': { pessoas: 1, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 13.11, luz: 0 },
  },
  '2025-Novembro': {
    'Apartamento 11': { pessoas: 1, agua: 0, luz: 7.20 },
    'Apartamento 12': { pessoas: 1, agua: 0, luz: 7.20 },
    'Apartamento 21': { pessoas: 1, agua: 0, luz: 7.20 },
    'Apartamento 22': { pessoas: 1, agua: 0, luz: 7.20 },
    'Apartamento 31': { pessoas: 2, agua: 0, luz: 7.20 },
    'Apartamento 32': { pessoas: 1, agua: 0, luz: 7.20 },
    'Casa 00': { pessoas: 2, agua: 0, luz: 0 },
    'Térreo': { pessoas: 1, agua: 0, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 0, luz: 0 },
  },
  '2025-Dezembro': {
    'Apartamento 11': { pessoas: 1, agua: 71.23, luz: 7.36 },
    'Apartamento 12': { pessoas: 1, agua: 71.23, luz: 7.36 },
    'Apartamento 21': { pessoas: 2, agua: 142.46, luz: 7.36 },
    'Apartamento 22': { pessoas: 1, agua: 71.23, luz: 7.37 },
    'Apartamento 31': { pessoas: 2, agua: 142.46, luz: 7.36 },
    'Apartamento 32': { pessoas: 1, agua: 71.23, luz: 7.36 },
    'Casa 00': { pessoas: 3, agua: 213.69, luz: 0 },
    'Térreo': { pessoas: 1, agua: 71.23, luz: 0 },
    'Loja 00': { pessoas: 0, agua: 202.07, luz: 0 },
  },
}

export async function seedHistorico() {
  const anos = ['2024', '2025']

  for (const ano of anos) {
    for (const mes of MESES) {
      const chave = `${ano}-${mes}`
      const dadosMes = DADOS[chave]

      // Se nao ha dados para esse mes, cria vazio
      const apartamentos = INQUILINOS.map((nome) => {
        const d = dadosMes ? dadosMes[nome] : null
        return {
          nome,
          quantidadePessoas: d ? d.pessoas : 1,
          pagamentoAgua: d ? 'Sim' : 'Não',
          pagamentoLuz: d ? 'Sim' : 'Não',
        }
      })

      await setDoc(doc(db, 'pagamentos', ano, 'meses', mes), {
        ano,
        mes,
        apartamentos,
        comprovanteAgua: '',
        comprovanteLuz: '',
        comprovanteDivisaoAguaLuz: '',
      })
    }
    console.log(`Pagamentos ${ano} criados`)
  }

  console.log('Seed histórico completo!')
}
