import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

// Path: pagamentos/{ano}/meses/{mes}
function mesRef(ano, mes) {
  return doc(db, 'pagamentos', ano, 'meses', mes)
}

export async function getPagamento(ano, mes) {
  const snap = await getDoc(mesRef(ano, mes))
  if (snap.exists()) return snap.data()
  return {
    ano,
    mes,
    apartamentos: [],
    comprovanteAgua: '',
    comprovanteLuz: '',
  }
}

export async function savePagamento(ano, mes, data) {
  await setDoc(mesRef(ano, mes), {
    ano,
    mes,
    apartamentos: data.apartamentos,
    comprovanteAgua: data.comprovanteAgua || '',
    comprovanteLuz: data.comprovanteLuz || '',
  })
}
