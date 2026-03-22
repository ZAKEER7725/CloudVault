import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_URL = '/api/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Set axios default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await axios.get(`${API_URL}/me`)
        setUser(res.data)
      } catch (err) {
        console.error('Failed to load user:', err)
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
      setLoading(false)
    }
    loadUser()
  }, [token])

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
