import { useState, useEffect } from 'react'
import { historyAPI } from '../services/api'
import '../styles/History.css'

const History = () => {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    fetchHistory()
    fetchStats()
  }, [pagination.page, pagination.limit])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const result = await historyAPI.getAll({
        page: pagination.page,
        limit: pagination.limit
      })
      setHistory(result.history)
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
        pages: result.pagination.pages
      }))
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to fetch history')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const result = await historyAPI.getStats()
      setStats(result.stats)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const handleRecordClick = (record) => {
    setSelectedRecord(selectedRecord?.id === record.id ? null : record)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading && history.length === 0) {
    return (
      <div className="history-page">
        <div className="page-header">
          <h2>Processing History</h2>
          <p>View all processed JSON data</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-page">
      <div className="page-header">
        <h2>Processing History</h2>
        <p>View all processed JSON data from the application</p>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="stats-section">
          <h3>📊 Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.totalRecords}</span>
              <span className="stat-label">Total Records</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.todayRecords}</span>
              <span className="stat-label">Today's Records</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.uniqueIPs}</span>
              <span className="stat-label">Unique Users</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{Math.round(stats.avgProcessingTime)}ms</span>
              <span className="stat-label">Avg Processing Time</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls-section">
        <div className="pagination-controls">
          <label>
            Records per page:
            <select 
              value={pagination.limit} 
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* History List */}
      <div className="history-container">
        {history.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📄</span>
            <h3>No History Found</h3>
            <p>Start using the JSON formatter to see your processing history here.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((record) => (
              <div 
                key={record.id} 
                className={`history-item ${selectedRecord?.id === record.id ? 'expanded' : ''}`}
                onClick={() => handleRecordClick(record)}
              >
                <div className="item-header">
                  <div className="item-info">
                    <span className="item-date">{formatDate(record.createdAt)}</span>
                    <span className="item-ip">IP: {record.ipAddress}</span>
                    <span className="item-time">{record.processingTime}ms</span>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(record.formattedJson)
                      }}
                    >
                      Copy
                    </button>
                    <span className="expand-icon">
                      {selectedRecord?.id === record.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
                
                <div className="item-preview">
                  <strong>Original:</strong> {truncateText(record.originalJson)}
                </div>
                
                {selectedRecord?.id === record.id && (
                  <div className="item-details">
                    <div className="detail-section">
                      <h4>Original JSON:</h4>
                      <pre className="json-display">{record.originalJson}</pre>
                    </div>
                    <div className="detail-section">
                      <h4>Formatted JSON:</h4>
                      <pre className="json-display">{record.formattedJson}</pre>
                    </div>
                    <div className="detail-section">
                      <h4>Processing Details:</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Processing Time:</span>
                          <span className="detail-value">{record.processingTime}ms</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">IP Address:</span>
                          <span className="detail-value">{record.ipAddress}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">User Agent:</span>
                          <span className="detail-value">{record.userAgent || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Date:</span>
                          <span className="detail-value">{formatDate(record.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-secondary"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <button 
            className="btn btn-secondary"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default History 