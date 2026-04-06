import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
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
  }, { merge: true })
}

// --- Comprovante por apartamento ---

function sanitizeNome(nome) {
  return nome.replace(/\s+/g, '_')
}

function comprovanteAptRef(ano, mes, nomeApt) {
  return doc(db, 'fundos', ano, 'comprovantes', `${mes}_apt_${sanitizeNome(nomeApt)}`)
}

export async function saveComprovanteFundoApt(ano, mes, nomeApt, base64, nomeArquivo) {
  await setDoc(comprovanteAptRef(ano, mes, nomeApt), { base64, nomeArquivo })
}

export async function getComprovanteFundoApt(ano, mes, nomeApt) {
  const snap = await getDoc(comprovanteAptRef(ano, mes, nomeApt))
  if (snap.exists()) return snap.data()
  return null
}

export async function deleteComprovanteFundoApt(ano, mes, nomeApt) {
  await deleteDoc(comprovanteAptRef(ano, mes, nomeApt))
}

// --- Rateios do mês (múltiplos PDFs) ---

export async function addRateio(ano, mes, base64, nomeArquivo) {
  const id = Date.now().toString()
  await setDoc(doc(db, 'fundos', ano, 'comprovantes', `${mes}_rateio_${id}`), { base64, nomeArquivo })
  const ref = mesRef(ano, mes)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const rateios = snap.data().rateios || []
    rateios.push({ id, nomeArquivo })
    await updateDoc(ref, { rateios })
  } else {
    await setDoc(ref, { ano, mes, apartamentos: [], rateios: [{ id, nomeArquivo }] })
  }
  return { id, nomeArquivo }
}

export async function getRateioFile(ano, mes, id) {
  const snap = await getDoc(doc(db, 'fundos', ano, 'comprovantes', `${mes}_rateio_${id}`))
  if (snap.exists()) return snap.data()
  return null
}

export async function removeRateio(ano, mes, id) {
  await deleteDoc(doc(db, 'fundos', ano, 'comprovantes', `${mes}_rateio_${id}`))
  const ref = mesRef(ano, mes)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const rateios = (snap.data().rateios || []).filter((r) => r.id !== id)
    await updateDoc(ref, { rateios })
  }
}
