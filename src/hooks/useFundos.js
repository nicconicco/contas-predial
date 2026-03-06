import { useEffect, useState } from 'react'
import { getFundo, saveFundo } from '../services/fundo.service'
import { MESES, ANOS, APARTAMENTOS } from '../constants/app'

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

  useEffect(() => {
    setLoading(true)
    setEdited(false)
    setSaveMsg('')
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
            somaPorApartamento[apt.nome] = { nome: apt.nome, totalInterno: 0, totalExterno: 0 }
          }
          if (apt.fundoInterno === 'Sim') {
            somaPorApartamento[apt.nome].totalInterno += VALOR_INTERNO
          }
          if (apt.fundoExterno === 'Sim') {
            somaPorApartamento[apt.nome].totalExterno += VALOR_EXTERNO
          }
        }
      }

      const resultado = Object.values(somaPorApartamento).map((apt) => ({
        ...apt,
        total: apt.totalInterno + apt.totalExterno,
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
    handleSave,
    calcularTotais,
    fecharTotais,
  }
}
