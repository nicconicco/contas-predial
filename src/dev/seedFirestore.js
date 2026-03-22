import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { MESES } from '../constants/app'

const INQUILINOS = [
  'Térreo',
  'Apartamento 11',
  'Apartamento 12',
  'Apartamento 21',
  'Apartamento 22',
  'Apartamento 31',
  'Apartamento 32',
  'Casa 00',
  'Loja 00',
]

export async function seedFirestore() {
  await setDoc(doc(db, 'config', 'senhas'), {
    normal: 'predial2025',
    admin: 'admin2025',
  })
  console.log('Senhas criadas')

  // pagamentos/{ano}/meses/{mes}
  for (const mes of MESES) {
    await setDoc(doc(db, 'pagamentos', '2025', 'meses', mes), {
      ano: '2025',
      mes,
      apartamentos: INQUILINOS.map((nome) => ({
        nome,
        quantidadePessoas: 1,
        pagamentoAgua: 'Não',
        pagamentoLuz: 'Não',
      })),
      comprovanteAgua: '',
      comprovanteLuz: '',
      comprovanteDivisaoAguaLuz: '',
    })
  }
  console.log('Dados 2025 criados')

  for (const mes of MESES) {
    const pago = mes === 'Janeiro' ? 'Sim' : 'Não'
    await setDoc(doc(db, 'pagamentos', '2026', 'meses', mes), {
      ano: '2026',
      mes,
      apartamentos: INQUILINOS.map((nome) => ({
        nome,
        quantidadePessoas: 1,
        pagamentoAgua: pago,
        pagamentoLuz: pago,
      })),
      comprovanteAgua: mes === 'Janeiro' ? 'janeiro_agua.pdf' : '',
      comprovanteLuz: mes === 'Janeiro' ? 'janeiro_luz.pdf' : '',
      comprovanteDivisaoAguaLuz: '',
    })
  }
  console.log('Dados 2026 criados')

  // fundos/{ano}/meses/{mes}
  for (const mes of MESES) {
    await setDoc(doc(db, 'fundos', '2025', 'meses', mes), {
      ano: '2025',
      mes,
      apartamentos: INQUILINOS.map((nome) => ({
        nome,
        fundoInterno: 'Não',
        fundoExterno: 'Não',
      })),
    })
  }
  console.log('Fundos 2025 criados')

  for (const mes of MESES) {
    const pago = mes === 'Janeiro' ? 'Sim' : 'Não'
    await setDoc(doc(db, 'fundos', '2026', 'meses', mes), {
      ano: '2026',
      mes,
      apartamentos: INQUILINOS.map((nome) => ({
        nome,
        fundoInterno: pago,
        fundoExterno: pago,
      })),
    })
  }
  console.log('Fundos 2026 criados')
  console.log('Seed completo!')
}

export async function resetPagamentos2025() {
  for (const mes of MESES) {
    const ref = doc(db, 'pagamentos', '2025', 'meses', mes)
    const snap = await getDoc(ref)
    if (!snap.exists()) continue
    const data = snap.data()
    const apartamentos = (data.apartamentos || []).map((apt) => ({
      ...apt,
      pagamentoAgua: 'Não',
      pagamentoLuz: 'Não',
    }))
    await setDoc(ref, { ...data, apartamentos })
    console.log(`${mes} 2025 resetado`)
  }
  console.log('Reset 2025 completo!')
}
