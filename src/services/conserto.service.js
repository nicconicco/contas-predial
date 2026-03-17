import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

function toApartamentoId(nome) {
  return nome.replace(/ /g, '_')
}

function observacoesRef(apartamentoId) {
  return collection(db, 'consertos', apartamentoId, 'observacoes')
}

export async function getObservacoes(nome) {
  const id = toApartamentoId(nome)
  const snap = await getDocs(observacoesRef(id))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addObservacao(nome, dados) {
  const id = toApartamentoId(nome)
  await addDoc(observacoesRef(id), {
    titulo: dados.titulo,
    descricao: dados.descricao,
    custo: dados.custo,
    criadoEm: dados.criadoEm,
    anexos: dados.anexos,
  })
}

export async function updateObservacao(nome, obsId, dados) {
  const id = toApartamentoId(nome)
  await updateDoc(doc(db, 'consertos', id, 'observacoes', obsId), {
    titulo: dados.titulo,
    descricao: dados.descricao,
    custo: dados.custo,
    anexos: dados.anexos,
  })
}

export async function deleteObservacao(nome, obsId) {
  const id = toApartamentoId(nome)
  await deleteDoc(doc(db, 'consertos', id, 'observacoes', obsId))
}
