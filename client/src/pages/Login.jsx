import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your CloudVault account</p>
        </div>

        {error && <div className="alert alert-error" id="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              id="login-email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              id="login-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="login-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">Signing in...</span>
            ) : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
