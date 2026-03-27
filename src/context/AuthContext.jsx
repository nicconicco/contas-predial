import { createContext, useContext, useEffect, useState } from 'react'
import { getSenhas } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [senhas, setSenhas] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSenhas()
      .then((data) => {
        setSenhas(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  function login(password) {
    if (!senhas) return { success: false }

    if (password === senhas.admin) {
      const u = { role: 'admin' }
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
      return { success: true }
    }
    if (password === senhas.normal) {
      const u = { role: 'viewer' }
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
      return { success: true }
    }
    return { success: false }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
