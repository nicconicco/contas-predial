import { useEffect, useState } from 'react'
import {
  getPagamento,
  savePagamento,
  saveComprovante,
  getComprovante,
  deleteComprovante,
  getAllPagamentosAno,
} from '../services/pagamento.service'
import { MESES, MESES_CURTOS, ANOS, APARTAMENTOS } from '../constants/app'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

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
  const [gerando, setGerando] = useState(false)

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

  function handleValorTotal(index, value) {
    const num = parseFloat(value)
    if (value !== '' && (isNaN(num) || num < 0)) return
    setDadosMes((prev) => ({
      ...prev,
      apartamentos: prev.apartamentos.map((row, i) =>
        i === index ? { ...row, valorTotal: value === '' ? '' : num } : row
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

  // Baixa o comprovante: se for imagem, converte para PDF antes de baixar
  async function handleDownloadComprovante(tipo) {
    setSaving(true)
    try {
      const data = await getComprovante(anoSelecionado, mesSelecionado, tipo)
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

  async function handleGerarPlanilha() {
    setGerando(true)
    setSaveMsg('')
    try {
      const todosMeses = await getAllPagamentosAno(anoSelecionado, MESES)

      // Header: Apartamento + 3 colunas por mês (Valor, Água, Luz) + totais
      const header = ['Apartamento']
      MESES_CURTOS.forEach((mes) => {
        header.push(`${mes} Valor`, `${mes} Água`, `${mes} Luz`)
      })
      header.push('Total Pago', 'Total em Dívida')

      const rows = APARTAMENTOS.map((nomeApt) => {
        const row = [nomeApt]
        let totalPago = 0
        let totalDivida = 0
        todosMeses.forEach((dadosMes) => {
          const apt = (dadosMes.apartamentos || []).find((a) => a.nome === nomeApt)
          const valor = apt && apt.valorTotal ? Number(apt.valorTotal) || 0 : 0
          const agua = apt ? (apt.pagamentoAgua || 'Não') : 'Não'
          const luz = apt ? (apt.pagamentoLuz || 'Não') : 'Não'
          row.push(valor, agua, luz)
          if (agua === 'Sim' && luz === 'Sim') {
            totalPago += valor
          } else {
            totalDivida += valor
          }
        })
        row.push(totalPago, totalDivida)
        return row
      })

      const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, anoSelecionado)
      XLSX.writeFile(wb, `pagamentos_${anoSelecionado}.xlsx`)
      setSaveMsg('Planilha gerada com sucesso!')
    } catch (err) {
      setSaveMsg(`Erro ao gerar planilha: ${err.message}`)
    } finally {
      setGerando(false)
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
    gerando,
    handlePessoas,
    handleValorTotal,
    togglePayment,
    handleComprovante,
    handleConfirmUpload,
    handleDownloadComprovante,
    handleDeleteComprovante,
    handleSave,
    handleGerarPlanilha,
  }
}
