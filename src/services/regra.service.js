import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

const regrasRef = collection(db, 'regras')

export async function getRegras() {
  const snap = await getDocs(regrasRef)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addRegra(dados) {
  await addDoc(regrasRef, {
    titulo: dados.titulo,
    descricao: dados.descricao,
    criadoEm: new Date().toLocaleDateString('pt-BR'),
  })
}

export async function updateRegra(docId, dados) {
  await updateDoc(doc(db, 'regras', docId), {
    titulo: dados.titulo,
    descricao: dados.descricao,
  })
}

export async function deleteRegra(docId) {
  await deleteDoc(doc(db, 'regras', docId))
}
