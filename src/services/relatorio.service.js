import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

const relatoriosRef = collection(db, 'relatorios')

export async function getRelatorios() {
  const snap = await getDocs(relatoriosRef)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addRelatorio(nomeArquivo, base64) {
  await addDoc(relatoriosRef, {
    nomeArquivo,
    base64,
    criadoEm: new Date().toLocaleDateString('pt-BR'),
  })
}

export async function deleteRelatorio(docId) {
  await deleteDoc(doc(db, 'relatorios', docId))
}
