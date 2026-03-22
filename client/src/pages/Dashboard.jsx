import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import {
  FiUploadCloud, FiFile, FiDownload, FiTrash2,
  FiImage, FiFileText, FiMusic, FiVideo, FiArchive, FiCode,
  FiHardDrive, FiClock
} from 'react-icons/fi'

const API_URL = '/api/files'

// Get icon based on mimetype
function getFileIcon(mimetype) {
  if (mimetype.startsWith('image/')) return <FiImage />
  if (mimetype.startsWith('video/')) return <FiVideo />
  if (mimetype.startsWith('audio/')) return <FiMusic />
  if (mimetype.includes('pdf') || mimetype.includes('document') || mimetype.includes('text')) return <FiFileText />
  if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('tar') || mimetype.includes('gzip')) return <FiArchive />
  if (mimetype.includes('javascript') || mimetype.includes('json') || mimetype.includes('html') || mimetype.includes('css') || mimetype.includes('xml')) return <FiCode />
  return <FiFile />
}

// Format file size
function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function Dashboard() {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [loadingFiles, setLoadingFiles] = useState(true)
  const fileInputRef = useRef(null)

  // Fetch files
  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(API_URL)
      setFiles(res.data)
    } catch (err) {
      console.error('Failed to fetch files:', err)
      setError('Failed to load files')
    }
    setLoadingFiles(false)
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // Upload file
  const handleUpload = async (file) => {
    if (!file) return
    setError('')
    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(pct)
        },
      })
      await fetchFiles()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    }
    setUploading(false)
    setUploadProgress(0)
  }

  // Handle file input change
  const onFileChange = (e) => {
    if (e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  // Download file
  const handleDownload = async (file) => {
    try {
      const res = await axios.get(`${API_URL}/download/${file._id}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.originalName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Download failed')
    }
  }

  const [confirmDelete, setConfirmDelete] = useState(null)

  // Delete file
  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await axios.delete(`${API_URL}/${confirmDelete._id}`)
      setFiles(files.filter((f) => f._id !== confirmDelete._id))
      setConfirmDelete(null)
    } catch (err) {
      setError('Delete failed')
    }
  }

  // Total storage used
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  return (
    <div className="dashboard-page" id="dashboard-page">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>My Files</h1>
          <p className="dashboard-greeting">Welcome back, <strong>{user?.name}</strong></p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card glass-card">
            <FiFile className="stat-icon" />
            <div>
              <span className="stat-value">{files.length}</span>
              <span className="stat-label">Files</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <FiHardDrive className="stat-icon" />
            <div>
              <span className="stat-value">{formatSize(totalSize)}</span>
              <span className="stat-label">Used / 500 MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone glass-card ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        id="upload-zone"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          hidden
          id="file-input"
        />
        {uploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p>Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <>
            <FiUploadCloud className="upload-icon" />
            <p className="upload-text">
              <strong>Drag & drop</strong> your file here, or <strong>click</strong> to browse
            </p>
            <span className="upload-hint">Max file size: 50MB &bull; Max storage: 500MB</span>
          </>
        )}
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* File List */}
      <div className="file-list" id="file-list">
        {loadingFiles ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="empty-state">
            <FiUploadCloud className="empty-icon" />
            <h3>No files yet</h3>
            <p>Upload your first file to get started</p>
          </div>
        ) : (
          <div className="file-table-wrap">
            <table className="file-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file._id} className="file-row">
                    <td className="file-name-cell">
                      <span className="file-type-icon">{getFileIcon(file.mimetype)}</span>
                      <span className="file-orig-name" title={file.originalName}>
                        {file.originalName}
                      </span>
                    </td>
                    <td className="file-size-cell">{formatSize(file.size)}</td>
                    <td className="file-date-cell">
                      <FiClock className="date-icon" />
                      {formatDate(file.uploadedAt)}
                    </td>
                    <td className="file-actions-cell">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(file) }}
                        className="btn btn-icon btn-download"
                        title="Download"
                      >
                        <FiDownload />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(file) }}
                        className="btn btn-icon btn-delete"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrapper">
              <FiTrash2 className="modal-icon error-icon" />
            </div>
            <h3>Delete File</h3>
            <p>Are you sure you want to delete <strong>{confirmDelete.originalName}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmDelete(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleDelete} className="btn btn-delete">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
