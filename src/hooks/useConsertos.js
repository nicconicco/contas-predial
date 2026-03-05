import { useState } from 'react'
import {
  getObservacoes,
  addObservacao,
  deleteObservacao,
} from '../services/conserto.service'

export function useConsertos() {
  const [apartamentoSelecionado, setApartamentoSelecionado] = useState(null)
  const [observacoes, setObservacoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  async function selectApartamento(nome) {
    setApartamentoSelecionado(nome)
    setLoading(true)
    setSaveMsg('')
    try {
      const obs = await getObservacoes(nome)
      obs.sort((a, b) => {
        const [da, ma, ya] = a.criadoEm.split('/')
        const [db2, mb, yb] = b.criadoEm.split('/')
        return new Date(yb, mb - 1, db2) - new Date(ya, ma - 1, da)
      })
      setObservacoes(obs)
    } catch {
      setSaveMsg('Erro ao carregar observações')
    } finally {
      setLoading(false)
    }
  }

  function voltarParaLista() {
    setApartamentoSelecionado(null)
    setObservacoes([])
    setSaveMsg('')
  }

  async function handleAddObservacao(dados) {
    setSaving(true)
    setSaveMsg('')
    try {
      await addObservacao(apartamentoSelecionado, dados)
      const obs = await getObservacoes(apartamentoSelecionado)
      obs.sort((a, b) => {
        const [da, ma, ya] = a.criadoEm.split('/')
        const [db2, mb, yb] = b.criadoEm.split('/')
        return new Date(yb, mb - 1, db2) - new Date(ya, ma - 1, da)
      })
      setObservacoes(obs)
      setSaveMsg('Observação adicionada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao adicionar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteObservacao(obsId) {
    setSaving(true)
    setSaveMsg('')
    try {
      await deleteObservacao(apartamentoSelecionado, obsId)
      setObservacoes((prev) => prev.filter((o) => o.id !== obsId))
      setSaveMsg('Observação deletada.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return {
    apartamentoSelecionado,
    observacoes,
    loading,
    saving,
    saveMsg,
    selectApartamento,
    voltarParaLista,
    handleAddObservacao,
    handleDeleteObservacao,
  }
}
