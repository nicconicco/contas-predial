import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

function mesRef(ano, mes) {
  return doc(db, 'fundos', ano, 'meses', mes)
}

export async function getFundo(ano, mes) {
  const snap = await getDoc(mesRef(ano, mes))
  if (snap.exists()) return snap.data()
  return {
    ano,
    mes,
    apartamentos: [],
  }
}

export async function saveFundo(ano, mes, data) {
  await setDoc(mesRef(ano, mes), {
    ano,
    mes,
    apartamentos: data.apartamentos,
  })
}
