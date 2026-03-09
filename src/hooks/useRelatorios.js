import { useEffect, useState } from 'react'
import {
  getRelatorios,
  addRelatorio,
  deleteRelatorio,
} from '../services/relatorio.service'

export function useRelatorios() {
  const [relatorios, setRelatorios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [pendingFile, setPendingFile] = useState(null)

  async function loadRelatorios() {
    setLoading(true)
    try {
      const data = await getRelatorios()
      data.sort((a, b) => {
        const [da, ma, ya] = a.criadoEm.split('/')
        const [db2, mb, yb] = b.criadoEm.split('/')
        return new Date(yb, mb - 1, db2) - new Date(ya, ma - 1, da)
      })
      setRelatorios(data)
    } catch {
      setSaveMsg('Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRelatorios()
  }, [])

  function handleSelectFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPendingFile({ nomeArquivo: file.name, base64: reader.result })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleUpload() {
    if (!pendingFile) return
    setSaving(true)
    setSaveMsg('')
    try {
      await addRelatorio(pendingFile.nomeArquivo, pendingFile.base64)
      setPendingFile(null)
      await loadRelatorios()
      setSaveMsg('Relatório enviado com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao enviar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(docId) {
    setSaving(true)
    setSaveMsg('')
    try {
      await deleteRelatorio(docId)
      await loadRelatorios()
      setSaveMsg('Relatório deletado.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  function handleDownload(relatorio) {
    const link = document.createElement('a')
    link.href = relatorio.base64
    link.download = relatorio.nomeArquivo
    link.click()
  }

  return {
    relatorios,
    loading,
    saving,
    saveMsg,
    pendingFile,
    handleSelectFile,
    handleUpload,
    handleDelete,
    handleDownload,
  }
}
