import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export async function getSenhas() {
  const ref = doc(db, 'config', 'senhas')
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()
  return null
}
