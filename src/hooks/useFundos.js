import { useEffect, useState } from 'react'
import {
  getFundo,
  saveFundo,
  saveComprovanteFundoApt,
  getComprovanteFundoApt,
  deleteComprovanteFundoApt,
  addRateio,
  getRateioFile,
  removeRateio,
} from '../services/fundo.service'
import { MESES, ANOS, APARTAMENTOS } from '../constants/app'
import { jsPDF } from 'jspdf'

const VALOR_INTERNO = 50
const VALOR_EXTERNO = 30

export function useFundos() {
  const [anoSelecionado, setAnoSelecionado] = useState(ANOS[ANOS.length - 1])
  const [mesSelecionado, setMesSelecionado] = useState(MESES[0])
  const [dadosMes, setDadosMes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [edited, setEdited] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [showTotais, setShowTotais] = useState(false)
  const [totais, setTotais] = useState([])
  const [loadingTotais, setLoadingTotais] = useState(false)
  const [showRateio, setShowRateio] = useState(false)
  const [rateioPreview, setRateioPreview] = useState(null)
  const [loadingRateio, setLoadingRateio] = useState(false)

  useEffect(() => {
    setLoading(true)
    setEdited(false)
    setSaveMsg('')
    setShowRateio(false)
    setRateioPreview(null)
    getFundo(anoSelecionado, mesSelecionado)
      .then((data) => {
        if (!data.apartamentos || data.apartamentos.length === 0) {
          data.apartamentos = APARTAMENTOS.map((nome) => ({
            nome,
            fundoInterno: 'Não',
            fundoExterno: 'Não',
          }))
        }
        setDadosMes(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar dados')
        setLoading(false)
      })
  }, [anoSelecionado, mesSelecionado])

  function toggleFundo(index, field) {
    setDadosMes((prev) => ({
      ...prev,
      apartamentos: prev.apartamentos.map((row, i) =>
        i === index ? { ...row, [field]: row[field] === 'Sim' ? 'Não' : 'Sim' } : row
      ),
    }))
    setEdited(true)
    setSaveMsg('')
  }

  function handleValorManual(index, value) {
    const num = parseFloat(value)
    if (value !== '' && (isNaN(num) || num < 0)) return
    setDadosMes((prev) => ({
      ...prev,
      apartamentos: prev.apartamentos.map((row, i) =>
        i === index ? { ...row, valorManual: value === '' ? '' : num } : row
      ),
    }))
    setEdited(true)
    setSaveMsg('')
  }

  async function handleSave() {
    setSaving(true)
    setSaveMsg('')
    try {
      await saveFundo(anoSelecionado, mesSelecionado, dadosMes)
      setEdited(false)
      setSaveMsg('Salvo com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao salvar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function calcularTotais() {
    setLoadingTotais(true)
    try {
      const todosMeses = await Promise.all(
        MESES.map((mes) => getFundo(anoSelecionado, mes))
      )

      const somaPorApartamento = {}

      for (const mesData of todosMeses) {
        if (!mesData.apartamentos) continue
        for (const apt of mesData.apartamentos) {
          if (!somaPorApartamento[apt.nome]) {
            somaPorApartamento[apt.nome] = { nome: apt.nome, totalInterno: 0, totalExterno: 0, totalManual: 0 }
          }
          const calculado =
            (apt.fundoInterno === 'Sim' ? VALOR_INTERNO : 0) +
            (apt.fundoExterno === 'Sim' ? VALOR_EXTERNO : 0)
          const efetivo = apt.valorManual !== '' && apt.valorManual != null ? Number(apt.valorManual) : calculado
          if (apt.fundoInterno === 'Sim') {
            somaPorApartamento[apt.nome].totalInterno += VALOR_INTERNO
          }
          if (apt.fundoExterno === 'Sim') {
            somaPorApartamento[apt.nome].totalExterno += VALOR_EXTERNO
          }
          somaPorApartamento[apt.nome].totalManual += efetivo
        }
      }

      const resultado = Object.values(somaPorApartamento).map((apt) => ({
        ...apt,
        total: apt.totalManual,
      }))

      setTotais(resultado)
      setShowTotais(true)
    } catch {
      setSaveMsg('Erro ao calcular totais')
    } finally {
      setLoadingTotais(false)
    }
  }

  function fecharTotais() {
    setShowTotais(false)
  }

  // --- Comprovante por apartamento ---

  async function handleComprovanteApt(index, e) {
    const file = e.target.files[0]
    if (!file) return
    const nomeApt = dadosMes.apartamentos[index].nome
    setSaving(true)
    setSaveMsg('')
    try {
      const reader = new FileReader()
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      await saveComprovanteFundoApt(anoSelecionado, mesSelecionado, nomeApt, base64, file.name)
      setDadosMes((prev) => ({
        ...prev,
        apartamentos: prev.apartamentos.map((row, i) =>
          i === index ? { ...row, comprovantePdf: file.name } : row
        ),
      }))
      setSaveMsg('Comprovante do apartamento enviado com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao enviar comprovante: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDownloadComprovanteApt(index) {
    const nomeApt = dadosMes.apartamentos[index].nome
    setSaving(true)
    try {
      const data = await getComprovanteFundoApt(anoSelecionado, mesSelecionado, nomeApt)
      if (!data) {
        setSaveMsg('Comprovante não encontrado.')
        setSaving(false)
        return
      }
      const isImage = data.base64.startsWith('data:image/')
      if (isImage) {
        const img = new Image()
        img.src = data.base64
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        const orientation = img.width > img.height ? 'l' : 'p'
        const pdf = new jsPDF(orientation, 'px', [img.width, img.height])
        pdf.addImage(data.base64, 'JPEG', 0, 0, img.width, img.height)
        const pdfName = data.nomeArquivo.replace(/\.(jpg|jpeg|png)$/i, '.pdf')
        pdf.save(pdfName)
      } else {
        const link = document.createElement('a')
        link.href = data.base64
        link.download = data.nomeArquivo
        link.click()
      }
    } catch (err) {
      setSaveMsg(`Erro ao baixar comprovante: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteComprovanteApt(index) {
    const nomeApt = dadosMes.apartamentos[index].nome
    setSaving(true)
    setSaveMsg('')
    try {
      await deleteComprovanteFundoApt(anoSelecionado, mesSelecionado, nomeApt)
      setDadosMes((prev) => ({
        ...prev,
        apartamentos: prev.apartamentos.map((row, i) =>
          i === index ? { ...row, comprovantePdf: '' } : row
        ),
      }))
      setSaveMsg('Comprovante do apartamento deletado.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar comprovante: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // --- Rateio do mês (múltiplos PDFs) ---

  function handleVisualizarRateio() {
    setRateioPreview(null)
    setShowRateio(true)
  }

  async function handleUploadRateio(e) {
    const file = e.target.files[0]
    if (!file) return
    setSaving(true)
    setSaveMsg('')
    try {
      const reader = new FileReader()
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const item = await addRateio(anoSelecionado, mesSelecionado, base64, file.name)
      setDadosMes((prev) => ({
        ...prev,
        rateios: [...(prev.rateios || []), item],
      }))
      setSaveMsg('Rateio enviado com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao enviar rateio: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteRateioItem(id) {
    setSaving(true)
    setSaveMsg('')
    try {
      await removeRateio(anoSelecionado, mesSelecionado, id)
      setDadosMes((prev) => ({
        ...prev,
        rateios: (prev.rateios || []).filter((r) => r.id !== id),
      }))
      if (rateioPreview && rateioPreview.id === id) {
        setRateioPreview(null)
      }
      setSaveMsg('Rateio deletado.')
    } catch (err) {
      setSaveMsg(`Erro ao deletar rateio: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handlePreviewRateio(id) {
    setLoadingRateio(true)
    try {
      const data = await getRateioFile(anoSelecionado, mesSelecionado, id)
      if (data) {
        setRateioPreview({ id, ...data })
      } else {
        setSaveMsg('Arquivo não encontrado.')
      }
    } catch (err) {
      setSaveMsg(`Erro ao carregar rateio: ${err.message}`)
    } finally {
      setLoadingRateio(false)
    }
  }

  function fecharRateio() {
    setShowRateio(false)
    setRateioPreview(null)
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
    showTotais,
    totais,
    loadingTotais,
    toggleFundo,
    handleValorManual,
    handleSave,
    calcularTotais,
    fecharTotais,
    handleComprovanteApt,
    handleDownloadComprovanteApt,
    handleDeleteComprovanteApt,
    showRateio,
    rateioPreview,
    loadingRateio,
    handleVisualizarRateio,
    handleUploadRateio,
    handleDeleteRateioItem,
    handlePreviewRateio,
    fecharRateio,
  }
}
