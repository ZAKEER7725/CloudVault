import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUploadCloud, FiShield, FiGlobe, FiArrowRight, FiFolder, FiLock, FiZap } from 'react-icons/fi'

function Home() {
  const { user } = useAuth()

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <FiZap /> Next-Gen Cloud Storage
          </div>
          <h1 className="hero-title">
            Your Files,<br />
            <span className="gradient-text">Anywhere, Anytime</span>
          </h1>
          <p className="hero-subtitle">
            Securely store, manage, and access your files from any device.
            Lightning-fast uploads with enterprise-grade encryption.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg" id="hero-cta">
                Go to Dashboard <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta">
                  Start Free <FiArrowRight />
                </Link>
                <Link to="/login" className="btn btn-glass btn-lg" id="hero-login">
                  Sign In
                </Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50MB</span>
              <span className="stat-label">Max File Size</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">256-bit</span>
              <span className="stat-label">Encryption</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features-section">
        <h2 className="section-title">Why <span className="gradient-text">CloudVault</span>?</h2>
        <p className="section-subtitle">Everything you need to manage your files in the cloud</p>
        <div className="features-grid">
          <div className="feature-card" id="feature-upload">
            <div className="feature-icon-wrap">
              <FiUploadCloud className="feature-icon" />
            </div>
            <h3>Instant Upload</h3>
            <p>Drag and drop your files for lightning-fast uploads. Support for all file types up to 50MB.</p>
          </div>
          <div className="feature-card" id="feature-secure">
            <div className="feature-icon-wrap">
              <FiShield className="feature-icon" />
            </div>
            <h3>Secure Storage</h3>
            <p>Your files are protected with JWT authentication. Only you can access your uploaded content.</p>
          </div>
          <div className="feature-card" id="feature-access">
            <div className="feature-icon-wrap">
              <FiGlobe className="feature-icon" />
            </div>
            <h3>Access Anywhere</h3>
            <p>Access your files from any device, any browser, anywhere in the world. Always in sync.</p>
          </div>
          <div className="feature-card" id="feature-organize">
            <div className="feature-icon-wrap">
              <FiFolder className="feature-icon" />
            </div>
            <h3>Easy Management</h3>
            <p>Upload, download, and delete files with a clean, intuitive interface. Zero learning curve.</p>
          </div>
          <div className="feature-card" id="feature-private">
            <div className="feature-icon-wrap">
              <FiLock className="feature-icon" />
            </div>
            <h3>Private by Default</h3>
            <p>Every file you upload is private. No one else can see or access your storage space.</p>
          </div>
          <div className="feature-card" id="feature-fast">
            <div className="feature-icon-wrap">
              <FiZap className="feature-icon" />
            </div>
            <h3>Blazing Fast</h3>
            <p>Built with modern tech stack for maximum performance. Upload and download at full speed.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 CloudVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
