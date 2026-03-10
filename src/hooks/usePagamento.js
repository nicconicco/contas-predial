import { useEffect, useState } from 'react'
import {
  getPagamento,
  savePagamento,
  saveComprovante,
  getComprovante,
  deleteComprovante,
} from '../services/pagamento.service'
import { MESES, ANOS } from '../constants/app'

const CAMPO_COMPROVANTE = {
  agua: 'comprovanteAgua',
  luz: 'comprovanteLuz',
  divisaoAguaLuz: 'comprovanteDivisaoAguaLuz',
}

export function usePagamento() {
  const [anoSelecionado, setAnoSelecionado] = useState(ANOS[ANOS.length - 1])
  const [mesSelecionado, setMesSelecionado] = useState(MESES[0])
  const [dadosMes, setDadosMes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [edited, setEdited] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [pendingFiles, setPendingFiles] = useState({ agua: null, luz: null, divisaoAguaLuz: null })

  useEffect(() => {
    setLoading(true)
    setEdited(false)
    setSaveMsg('')
    setPendingFiles({ agua: null, luz: null, divisaoAguaLuz: null })
    getPagamento(anoSelecionado, mesSelecionado)
      .then((data) => {
        setDadosMes(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar dados')
        setLoading(false)
      })
  }, [anoSelecionado, mesSelecionado])

  function handlePessoas(index, value) {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 0) return
    setDadosMes((prev) => ({
      ...prev,
      apartamentos: prev.apartamentos.map((row, i) =>
        i === index ? { ...row, quantidadePessoas: num } : row
      ),
    }))
    setEdited(true)
    setSaveMsg('')
  }

  function togglePayment(index, field) {
    setDadosMes((prev) => ({
      ...prev,
      apartamentos: prev.apartamentos.map((row, i) =>
        i === index ? { ...row, [field]: row[field] === 'Sim' ? 'Não' : 'Sim' } : row
      ),
    }))
    setEdited(true)
    setSaveMsg('')
  }

  // Le o arquivo como base64 e guarda em pendingFiles ate confirmar
  function handleComprovante(tipo, e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPendingFiles((prev) => ({
        ...prev,
        [tipo]: { base64: reader.result, nomeArquivo: file.name },
      }))
    }
    reader.readAsDataURL(file)
  }

  // Confirma upload: salva base64 no Firestore
  async function handleConfirmUpload(tipo) {
    const pending = pendingFiles[tipo]
    if (!pending) return
    setSaving(true)
    setSaveMsg('')
    try {
      await saveComprovante(
        anoSelecionado,
        mesSelecionado,
        tipo,
        pending.base64,
        pending.nomeArquivo
      )
      const campo = CAMPO_COMPROVANTE[tipo]
      setDadosMes((prev) => ({ ...prev, [campo]: pending.nomeArquivo }))
      setPendingFiles((prev) => ({ ...prev, [tipo]: null }))
      setSaveMsg('Comprovante enviado com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao enviar comprovante: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Baixa o PDF: busca base64 do Firestore e dispara download
  async function handleDownloadComprovante(tipo) {
    setSaving(true)
    try {
      const data = await getComprovante(anoSelecionado, mesSelecionado, tipo)
      if (!data) {
        setSaveMsg('Comprovante não encontrado.')
        setSaving(false)
        return
      }
      const link = document.createElement('a')
      link.href = data.base64
      link.download = data.nomeArquivo
      link.click()
    } catch (err) {
      setSaveMsg(`Erro ao baixar comprovante: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Deleta comprovante do Firestore
  async function handleDeleteComprovante(tipo) {
    setSaving(true)
    setSaveMsg('')
    try {
      await deleteComprovante(anoSelecionado, mesSelecionado, tipo)
      const campo = CAMPO_COMPROVANTE[tipo]
      setDadosMes((prev) => ({ ...prev, [campo]: '' }))
      setPendingFiles((prev) => ({ ...prev, [tipo]: null }))
      setSaveMsg('Comprovante deletado.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar comprovante: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaveMsg('')
    try {
      await savePagamento(anoSelecionado, mesSelecionado, dadosMes)
      setEdited(false)
      setSaveMsg('Salvo com sucesso! As alterações já estão disponíveis para todos.')
    } catch (err) {
      setSaveMsg(`Erro ao salvar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return {
    anoSelecionado,
    setAnoSelecionado,
    mesSelecionado,
    setMesSelecionado,
    dadosMes,
    loading,
    saving,
    error,
    edited,
    saveMsg,
    pendingFiles,
    handlePessoas,
    togglePayment,
    handleComprovante,
    handleConfirmUpload,
    handleDownloadComprovante,
    handleDeleteComprovante,
    handleSave,
  }
}
