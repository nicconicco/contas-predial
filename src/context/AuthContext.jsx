import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const PASSWORDS = {
  viewer: 'predial2025',
  admin: 'admin2025',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login(password) {
    if (password === PASSWORDS.admin) {
      setUser({ role: 'admin' })
      return { success: true }
    }
    if (password === PASSWORDS.viewer) {
      setUser({ role: 'viewer' })
      return { success: true }
    }
    return { success: false }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
