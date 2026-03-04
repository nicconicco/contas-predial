import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const INQUILINOS = [
  'Apartamento 101',
  'Apartamento 102',
  'Apartamento 103',
  'Apartamento 201',
  'Apartamento 202',
]

export async function seedFirestore() {
  // Senhas
  await setDoc(doc(db, 'config', 'senhas'), {
    normal: 'predial2025',
    admin: 'admin2025',
  })
  console.log('Senhas criadas')

  // 2025 - Todos não pagaram
  for (const mes of MESES) {
    await setDoc(doc(db, 'pagamentos', `2025_${mes}`), {
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
    })
  }
  console.log('Dados 2025 criados')

  // 2026 - Janeiro pago, resto não
  for (const mes of MESES) {
    const pago = mes === 'Janeiro' ? 'Sim' : 'Não'
    await setDoc(doc(db, 'pagamentos', `2026_${mes}`), {
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
    })
  }
  console.log('Dados 2026 criados')
  console.log('Seed completo!')
}
