import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

const atasRef = collection(db, 'atas')

export async function getAtas() {
  const snap = await getDocs(atasRef)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addAta(dados) {
  await addDoc(atasRef, {
    titulo: dados.titulo,
    observacoes: dados.observacoes,
    anexos: dados.anexos,
    criadoEm: new Date().toLocaleDateString('pt-BR'),
  })
}

export async function updateAta(docId, dados) {
  await updateDoc(doc(db, 'atas', docId), {
    titulo: dados.titulo,
    observacoes: dados.observacoes,
    anexos: dados.anexos,
  })
}

export async function deleteAta(docId) {
  await deleteDoc(doc(db, 'atas', docId))
}
