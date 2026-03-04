import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const ANOS = ['2025', '2026']

export { MESES, ANOS }

// Buscar senhas do Firestore
export async function getSenhas() {
  const ref = doc(db, 'config', 'senhas')
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()
  return null
}

// Buscar dados de um mês específico
export async function getPagamento(ano, mes) {
  const ref = doc(db, 'pagamentos', `${ano}_${mes}`)
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()
  return {
    ano,
    mes,
    apartamentos: [],
    comprovanteAgua: '',
    comprovanteLuz: '',
  }
}

// Salvar dados de um mês específico
export async function savePagamento(ano, mes, data) {
  const ref = doc(db, 'pagamentos', `${ano}_${mes}`)
  await setDoc(ref, {
    ano,
    mes,
    apartamentos: data.apartamentos,
    comprovanteAgua: data.comprovanteAgua || '',
    comprovanteLuz: data.comprovanteLuz || '',
  })
}
