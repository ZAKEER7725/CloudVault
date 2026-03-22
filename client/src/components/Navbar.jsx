import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiCloud, FiLogOut, FiGrid } from 'react-icons/fi'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="navbar-brand">
        <FiCloud className="brand-icon" />
        <span>CloudVault</span>
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link" id="nav-dashboard">
              <FiGrid />
              <span>Dashboard</span>
            </Link>
            <div className="nav-user">
              <span className="nav-user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn btn-ghost" id="nav-logout">
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" id="nav-login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
