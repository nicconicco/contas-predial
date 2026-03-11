import { useEffect, useState } from 'react'
import { getAguaExtra, addAguaExtra, updateAguaExtra, deleteAguaExtra } from '../services/aguaExtra.service'

export function useAguaExtra() {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [editingRegistro, setEditingRegistro] = useState(null)

  function sortByDate(list) {
    return list.sort((a, b) => {
      const [da, ma, ya] = a.criadoEm.split('/')
      const [db2, mb, yb] = b.criadoEm.split('/')
      return new Date(yb, mb - 1, db2) - new Date(ya, ma - 1, da)
    })
  }

  async function loadRegistros() {
    setLoading(true)
    try {
      const data = await getAguaExtra()
      setRegistros(sortByDate(data))
    } catch {
      setSaveMsg('Erro ao carregar registros')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRegistros()
  }, [])

  async function handleAdd(dados) {
    setSaving(true)
    setSaveMsg('')
    try {
      await addAguaExtra(dados)
      await loadRegistros()
      setSaveMsg('Registro adicionado com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao adicionar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(registro) {
    setEditingRegistro({ ...registro, anexos: [...(registro.anexos || [])] })
    setSaveMsg('')
  }

  function handleCancelEdit() {
    setEditingRegistro(null)
  }

  async function handleSaveEdit() {
    if (!editingRegistro) return
    setSaving(true)
    setSaveMsg('')
    try {
      await updateAguaExtra(editingRegistro.id, {
        titulo: editingRegistro.titulo,
        observacoes: editingRegistro.observacoes,
        anexos: editingRegistro.anexos,
      })
      setEditingRegistro(null)
      await loadRegistros()
      setSaveMsg('Registro atualizado com sucesso!')
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
      await deleteAguaExtra(docId)
      await loadRegistros()
      setSaveMsg('Registro deletado.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  function handleDownload(anexo) {
    const link = document.createElement('a')
    link.href = anexo.base64
    link.download = anexo.nomeArquivo
    link.click()
  }

  function updateEditingField(field, value) {
    setEditingRegistro((prev) => ({ ...prev, [field]: value }))
  }

  function addAnexoToEditing(file) {
    const reader = new FileReader()
    reader.onload = () => {
      setEditingRegistro((prev) => ({
        ...prev,
        anexos: [...prev.anexos, { nomeArquivo: file.name, base64: reader.result }],
      }))
    }
    reader.readAsDataURL(file)
  }

  function removeAnexoFromEditing(index) {
    setEditingRegistro((prev) => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index),
    }))
  }

  return {
    registros,
    loading,
    saving,
    saveMsg,
    editingRegistro,
    handleAdd,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
    handleDownload,
    updateEditingField,
    addAnexoToEditing,
    removeAnexoFromEditing,
  }
}
