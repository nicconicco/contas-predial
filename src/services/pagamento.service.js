import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const CAMPO_COMPROVANTE = {
  agua: 'comprovanteAgua',
  luz: 'comprovanteLuz',
  divisaoAguaLuz: 'comprovanteDivisaoAguaLuz',
}

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
    comprovanteDivisaoAguaLuz: '',
  }
}

export async function savePagamento(ano, mes, data) {
  await setDoc(mesRef(ano, mes), {
    ano,
    mes,
    apartamentos: data.apartamentos,
    comprovanteAgua: data.comprovanteAgua || '',
    comprovanteLuz: data.comprovanteLuz || '',
    comprovanteDivisaoAguaLuz: data.comprovanteDivisaoAguaLuz || '',
  })
}

// Salva PDF base64 em documento separado + atualiza nome no doc principal
export async function saveComprovante(ano, mes, tipo, base64, nomeArquivo) {
  await setDoc(comprovanteRef(ano, mes, tipo), { base64, nomeArquivo })
  const campo = CAMPO_COMPROVANTE[tipo]
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
  const campo = CAMPO_COMPROVANTE[tipo]
  await updateDoc(mesRef(ano, mes), { [campo]: '' })
}

// Busca dados de todos os 12 meses de um ano em paralelo
export async function getAllPagamentosAno(ano, meses) {
  const results = await Promise.all(meses.map((mes) => getPagamento(ano, mes)))
  return results
}

// --- Comprovante por apartamento ---

function sanitizeNome(nome) {
  return nome.replace(/\s+/g, '_')
}

function comprovanteAptRef(ano, mes, nomeApt) {
  return doc(db, 'pagamentos', ano, 'comprovantes', `${mes}_apt_${sanitizeNome(nomeApt)}`)
}

export async function saveComprovanteApt(ano, mes, nomeApt, base64, nomeArquivo) {
  await setDoc(comprovanteAptRef(ano, mes, nomeApt), { base64, nomeArquivo })
}

export async function getComprovanteApt(ano, mes, nomeApt) {
  const snap = await getDoc(comprovanteAptRef(ano, mes, nomeApt))
  if (snap.exists()) return snap.data()
  return null
}

export async function deleteComprovanteApt(ano, mes, nomeApt) {
  await deleteDoc(comprovanteAptRef(ano, mes, nomeApt))
}
