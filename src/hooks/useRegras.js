import { useEffect, useState } from 'react'
import { getRegras, addRegra, updateRegra, deleteRegra } from '../services/regra.service'

export function useRegras() {
  const [regras, setRegras] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [editingRegra, setEditingRegra] = useState(null)

  function sortByDate(list) {
    return list.sort((a, b) => {
      const [da, ma, ya] = a.criadoEm.split('/')
      const [db2, mb, yb] = b.criadoEm.split('/')
      return new Date(yb, mb - 1, db2) - new Date(ya, ma - 1, da)
    })
  }

  async function loadRegras() {
    setLoading(true)
    try {
      const data = await getRegras()
      setRegras(sortByDate(data))
    } catch {
      setSaveMsg('Erro ao carregar regras')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRegras()
  }, [])

  async function handleAdd(dados) {
    setSaving(true)
    setSaveMsg('')
    try {
      await addRegra(dados)
      await loadRegras()
      setSaveMsg('Regra adicionada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao adicionar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(regra) {
    setEditingRegra({ ...regra })
    setSaveMsg('')
  }

  function handleCancelEdit() {
    setEditingRegra(null)
  }

  async function handleSaveEdit() {
    if (!editingRegra) return
    setSaving(true)
    setSaveMsg('')
    try {
      await updateRegra(editingRegra.id, {
        titulo: editingRegra.titulo,
        descricao: editingRegra.descricao,
      })
      setEditingRegra(null)
      await loadRegras()
      setSaveMsg('Regra atualizada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao atualizar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(docId) {
    setSaving(true)
    setSaveMsg('')
    try {
      await deleteRegra(docId)
      await loadRegras()
      setSaveMsg('Regra deletada.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  function updateEditingField(field, value) {
    setEditingRegra((prev) => ({ ...prev, [field]: value }))
  }

  return {
    regras,
    loading,
    saving,
    saveMsg,
    editingRegra,
    handleAdd,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
    updateEditingField,
  }
}
