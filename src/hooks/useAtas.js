import { useEffect, useState } from 'react'
import { getAtas, addAta, updateAta, deleteAta } from '../services/ata.service'

export function useAtas() {
  const [atas, setAtas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [editingAta, setEditingAta] = useState(null)

  function sortByDate(list) {
    return list.sort((a, b) => {
      const [da, ma, ya] = a.criadoEm.split('/')
      const [db2, mb, yb] = b.criadoEm.split('/')
      return new Date(yb, mb - 1, db2) - new Date(ya, ma - 1, da)
    })
  }

  async function loadAtas() {
    setLoading(true)
    try {
      const data = await getAtas()
      setAtas(sortByDate(data))
    } catch {
      setSaveMsg('Erro ao carregar atas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAtas()
  }, [])

  async function handleAddAta(dados) {
    setSaving(true)
    setSaveMsg('')
    try {
      await addAta(dados)
      await loadAtas()
      setSaveMsg('Ata adicionada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao adicionar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  function handleEditAta(ata) {
    setEditingAta({ ...ata, anexos: [...(ata.anexos || [])] })
    setSaveMsg('')
  }

  function handleCancelEdit() {
    setEditingAta(null)
  }

  async function handleSaveEdit() {
    if (!editingAta) return
    setSaving(true)
    setSaveMsg('')
    try {
      await updateAta(editingAta.id, {
        titulo: editingAta.titulo,
        observacoes: editingAta.observacoes,
        anexos: editingAta.anexos,
      })
      setEditingAta(null)
      await loadAtas()
      setSaveMsg('Ata atualizada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao atualizar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAta(docId) {
    setSaving(true)
    setSaveMsg('')
    try {
      await deleteAta(docId)
      await loadAtas()
      setSaveMsg('Ata deletada.')
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
    setEditingAta((prev) => ({ ...prev, [field]: value }))
  }

  function addAnexoToEditing(file) {
    const reader = new FileReader()
    reader.onload = () => {
      setEditingAta((prev) => ({
        ...prev,
        anexos: [...prev.anexos, { nomeArquivo: file.name, base64: reader.result }],
      }))
    }
    reader.readAsDataURL(file)
  }

  function removeAnexoFromEditing(index) {
    setEditingAta((prev) => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index),
    }))
  }

  return {
    atas,
    loading,
    saving,
    saveMsg,
    editingAta,
    handleAddAta,
    handleEditAta,
    handleCancelEdit,
    handleSaveEdit,
    handleDeleteAta,
    handleDownload,
    updateEditingField,
    addAnexoToEditing,
    removeAnexoFromEditing,
  }
}
