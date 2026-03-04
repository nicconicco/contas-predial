import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBhs6195i9rkEUyIkgWYaio_G0DKwQdACM",
  authDomain: "contas-predial.firebaseapp.com",
  projectId: "contas-predial",
  storageBucket: "contas-predial.firebasestorage.app",
  messagingSenderId: "638046486467",
  appId: "1:638046486467:web:2d94228720d4462dbbc776"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
