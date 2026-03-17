import { useEffect, useState } from 'react'
import {
  getSecoes,
  addSecao,
  updateSecao,
  deleteSecao,
  getAnotacoes,
  addAnotacao,
  updateAnotacao,
  deleteAnotacao,
} from '../services/secao.service'

function sortByDate(list) {
  return list.sort((a, b) => {
    const [da, ma, ya] = a.criadoEm.split('/')
    const [db2, mb, yb] = b.criadoEm.split('/')
    return new Date(yb, mb - 1, db2) - new Date(ya, ma - 1, da)
  })
}

export function useSecoes() {
  const [secoes, setSecoes] = useState([])
  const [secaoSelecionada, setSecaoSelecionada] = useState(null)
  const [anotacoes, setAnotacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  async function loadSecoes() {
    setLoading(true)
    try {
      const data = await getSecoes()
      setSecoes(sortByDate(data))
    } catch {
      setSaveMsg('Erro ao carregar seções')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSecoes()
  }, [])

  // --- Seções CRUD ---

  async function handleAddSecao(dados) {
    setSaving(true)
    setSaveMsg('')
    try {
      await addSecao(dados)
      await loadSecoes()
      setSaveMsg('Seção criada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao criar seção: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleEditSecao(secaoId, dados) {
    setSaving(true)
    setSaveMsg('')
    try {
      await updateSecao(secaoId, dados)
      setSecoes((prev) =>
        prev.map((s) => (s.id === secaoId ? { ...s, ...dados } : s))
      )
      setSaveMsg('Seção atualizada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao atualizar seção: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteSecao(secaoId) {
    setSaving(true)
    setSaveMsg('')
    try {
      await deleteSecao(secaoId)
      setSecoes((prev) => prev.filter((s) => s.id !== secaoId))
      setSaveMsg('Seção deletada.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar seção: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // --- Navegação entre vistas ---

  async function selectSecao(secao) {
    setSecaoSelecionada(secao)
    setLoading(true)
    setSaveMsg('')
    try {
      const data = await getAnotacoes(secao.id)
      setAnotacoes(sortByDate(data))
    } catch {
      setSaveMsg('Erro ao carregar anotações')
    } finally {
      setLoading(false)
    }
  }

  function voltarParaLista() {
    setSecaoSelecionada(null)
    setAnotacoes([])
    setSaveMsg('')
  }

  // --- Anotações CRUD ---

  async function handleAddAnotacao(dados) {
    setSaving(true)
    setSaveMsg('')
    try {
      await addAnotacao(secaoSelecionada.id, dados)
      const data = await getAnotacoes(secaoSelecionada.id)
      setAnotacoes(sortByDate(data))
      setSaveMsg('Anotação adicionada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao adicionar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleEditAnotacao(anotacaoId, dados) {
    setSaving(true)
    setSaveMsg('')
    try {
      await updateAnotacao(secaoSelecionada.id, anotacaoId, dados)
      setAnotacoes((prev) =>
        prev.map((a) => (a.id === anotacaoId ? { ...a, ...dados } : a))
      )
      setSaveMsg('Anotação atualizada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao atualizar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAnotacao(anotacaoId) {
    setSaving(true)
    setSaveMsg('')
    try {
      await deleteAnotacao(secaoSelecionada.id, anotacaoId)
      setAnotacoes((prev) => prev.filter((a) => a.id !== anotacaoId))
      setSaveMsg('Anotação deletada.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return {
    secoes,
    secaoSelecionada,
    anotacoes,
    loading,
    saving,
    saveMsg,
    loadSecoes,
    handleAddSecao,
    handleEditSecao,
    handleDeleteSecao,
    selectSecao,
    voltarParaLista,
    handleAddAnotacao,
    handleEditAnotacao,
    handleDeleteAnotacao,
  }
}
