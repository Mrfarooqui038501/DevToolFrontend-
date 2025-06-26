import { useState } from 'react'
import { jsonAPI } from '../services/api'
import '../styles/JsonFormatter.css'

const JsonFormatter = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFormat = async () => {
    if (!input.trim()) {
      setError('Please enter some JSON to format')
      return
    }

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const result = await jsonAPI.format(input)
      setOutput(result.formatted)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to format JSON')
      setOutput('')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setCopied(false)
  }

  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSampleData = () => {
    const sampleJson = `{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zip":"10001"},"hobbies":["reading","swimming","coding"],"active":true}`
    setInput(sampleJson)
    setError('')
    setOutput('')
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setError('')
    setOutput('')
  }

  return (
    <div className="json-formatter">
      <div className="page-header">
        <h2>JSON Formatter</h2>
        <p>Format and validate your JSON with proper indentation</p>
      </div>

      <div className="formatter-container">
        <div className="input-section">
          <div className="section-header">
            <h3>Input JSON</h3>
            <div className="header-actions">
              <button 
                className="btn btn-secondary" 
                onClick={handleSampleData}
                disabled={loading}
              >
                Load Sample
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>
          
          <textarea
            className={`json-input ${error ? 'error' : ''}`}
            value={input}
            onChange={handleInputChange}
            placeholder="Paste your JSON here..."
            disabled={loading}
            rows={15}
          />
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <button 
            className="btn btn-primary format-btn"
            onClick={handleFormat}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Formatting...' : 'Format JSON'}
          </button>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h3>Formatted Output</h3>
            {output && (
              <button 
                className={`btn btn-secondary ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="output-container">
            {output ? (
              <pre className="json-output">{output}</pre>
            ) : (
              <div className="output-placeholder">
                <span className="placeholder-icon">📄</span>
                <p>Formatted JSON will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <h3>Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">✅</span>
            <h4>JSON Validation</h4>
            <p>Validates JSON syntax and shows detailed error messages</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎨</span>
            <h4>Pretty Formatting</h4>
            <p>Formats JSON with proper indentation and spacing</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📋</span>
            <h4>One-Click Copy</h4>
            <p>Copy formatted JSON to clipboard with a single click</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h4>History Tracking</h4>
            <p>All processed JSON is saved for future reference</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonFormatter 