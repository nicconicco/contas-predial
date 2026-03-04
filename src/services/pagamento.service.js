import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

// Path: pagamentos/{ano}/meses/{mes}
function mesRef(ano, mes) {
  return doc(db, 'pagamentos', ano, 'meses', mes)
}

// Path: pagamentos/{ano}/comprovantes/{mes}_{tipo}
function comprovanteRef(ano, mes, tipo) {
  return doc(db, 'pagamentos', ano, 'comprovantes', `${mes}_${tipo}`)
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

// Salva PDF base64 em documento separado + atualiza nome no doc principal
export async function saveComprovante(ano, mes, tipo, base64, nomeArquivo) {
  await setDoc(comprovanteRef(ano, mes, tipo), { base64, nomeArquivo })
  const campo = tipo === 'agua' ? 'comprovanteAgua' : 'comprovanteLuz'
  await updateDoc(mesRef(ano, mes), { [campo]: nomeArquivo })
}

// Busca PDF base64
export async function getComprovante(ano, mes, tipo) {
  const snap = await getDoc(comprovanteRef(ano, mes, tipo))
  if (snap.exists()) return snap.data()
  return null
}

// Deleta PDF base64 + limpa nome no doc principal
export async function deleteComprovante(ano, mes, tipo) {
  await deleteDoc(comprovanteRef(ano, mes, tipo))
  const campo = tipo === 'agua' ? 'comprovanteAgua' : 'comprovanteLuz'
  await updateDoc(mesRef(ano, mes), { [campo]: '' })
}
