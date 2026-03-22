import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Get started with CloudVault for free</p>
        </div>

        {error && <div className="alert alert-error" id="register-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              id="register-name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              id="register-email"
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
              id="register-password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="register-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">Creating account...</span>
            ) : (
              <>
                <FiUserPlus /> Create Account
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
