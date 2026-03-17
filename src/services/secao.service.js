import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

const secoesRef = collection(db, 'secoes')

function anotacoesRef(secaoId) {
  return collection(db, 'secoes', secaoId, 'anotacoes')
}

// --- Seções ---

export async function getSecoes() {
  const snap = await getDocs(secoesRef)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addSecao(dados) {
  await addDoc(secoesRef, {
    titulo: dados.titulo,
    subtitulo: dados.subtitulo,
    criadoEm: new Date().toLocaleDateString('pt-BR'),
  })
}

export async function updateSecao(secaoId, dados) {
  await updateDoc(doc(db, 'secoes', secaoId), {
    titulo: dados.titulo,
    subtitulo: dados.subtitulo,
  })
}

export async function deleteSecao(secaoId) {
  await deleteDoc(doc(db, 'secoes', secaoId))
}

// --- Anotações ---

export async function getAnotacoes(secaoId) {
  const snap = await getDocs(anotacoesRef(secaoId))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addAnotacao(secaoId, dados) {
  await addDoc(anotacoesRef(secaoId), {
    titulo: dados.titulo,
    descricao: dados.descricao,
    custo: dados.custo,
    criadoEm: new Date().toLocaleDateString('pt-BR'),
    anexos: dados.anexos,
  })
}

export async function updateAnotacao(secaoId, anotacaoId, dados) {
  await updateDoc(doc(db, 'secoes', secaoId, 'anotacoes', anotacaoId), {
    titulo: dados.titulo,
    descricao: dados.descricao,
    custo: dados.custo,
    anexos: dados.anexos,
  })
}

export async function deleteAnotacao(secaoId, anotacaoId) {
  await deleteDoc(doc(db, 'secoes', secaoId, 'anotacoes', anotacaoId))
}
