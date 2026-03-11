import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

const aguaExtraRef = collection(db, 'aguaExtra')

export async function getAguaExtra() {
  const snap = await getDocs(aguaExtraRef)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addAguaExtra(dados) {
  await addDoc(aguaExtraRef, {
    titulo: dados.titulo,
    observacoes: dados.observacoes,
    anexos: dados.anexos,
    criadoEm: new Date().toLocaleDateString('pt-BR'),
  })
}

export async function updateAguaExtra(docId, dados) {
  await updateDoc(doc(db, 'aguaExtra', docId), {
    titulo: dados.titulo,
    observacoes: dados.observacoes,
    anexos: dados.anexos,
  })
}

export async function deleteAguaExtra(docId) {
  await deleteDoc(doc(db, 'aguaExtra', docId))
}
