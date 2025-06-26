import { useState } from 'react'
import { base64API } from '../services/api'
import '../styles/Base64Tool.css'

const Base64Tool = () => {
  const [encodeInput, setEncodeInput] = useState('')
  const [encodeOutput, setEncodeOutput] = useState('')
  const [decodeInput, setDecodeInput] = useState('')
  const [decodeOutput, setDecodeOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState({ encode: false, decode: false })

  const handleEncode = async () => {
    if (!encodeInput.trim()) {
      setError('Please enter some text to encode')
      return
    }

    setLoading(true)
    setError('')
    setEncodeOutput('')

    try {
      const result = await base64API.encode(encodeInput)
      setEncodeOutput(result.encoded)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to encode text')
      setEncodeOutput('')
    } finally {
      setLoading(false)
    }
  }

  const handleDecode = async () => {
    if (!decodeInput.trim()) {
      setError('Please enter some Base64 text to decode')
      return
    }

    setLoading(true)
    setError('')
    setDecodeOutput('')

    try {
      const result = await base64API.decode(decodeInput)
      setDecodeOutput(result.decoded)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to decode Base64')
      setDecodeOutput('')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text, type) => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(prev => ({ ...prev, [type]: true }))
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = (type) => {
    if (type === 'encode') {
      setEncodeInput('')
      setEncodeOutput('')
    } else {
      setDecodeInput('')
      setDecodeOutput('')
    }
    setError('')
    setCopied(prev => ({ ...prev, [type]: false }))
  }

  const handleSampleData = (type) => {
    if (type === 'encode') {
      setEncodeInput('Hello World! This is a sample text for Base64 encoding.')
      setEncodeOutput('')
    } else {
      setDecodeInput('SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBzYW1wbGUgdGV4dCBmb3IgQmFzZTY0IGRlY29kaW5nLg==')
      setDecodeOutput('')
    }
    setError('')
  }

  const handleInputChange = (e, type) => {
    if (type === 'encode') {
      setEncodeInput(e.target.value)
    } else {
      setDecodeInput(e.target.value)
    }
    setError('')
  }

  return (
    <div className="base64-tool">
      <div className="page-header">
        <h2>Base64 Encoder/Decoder</h2>
        <p>Convert text to and from Base64 encoding</p>
      </div>

      <div className="tool-container">
        {/* Encoder Section */}
        <div className="encoder-section">
          <div className="section-header">
            <h3>🔒 Encode to Base64</h3>
            <div className="header-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => handleSampleData('encode')}
                disabled={loading}
              >
                Sample
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => handleClear('encode')}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Plain Text Input:</label>
            <textarea
              className="text-input"
              value={encodeInput}
              onChange={(e) => handleInputChange(e, 'encode')}
              placeholder="Enter text to encode..."
              disabled={loading}
              rows={6}
            />
          </div>
          
          <button 
            className="btn btn-primary action-btn"
            onClick={handleEncode}
            disabled={loading || !encodeInput.trim()}
          >
            {loading ? 'Encoding...' : 'Encode'}
          </button>
          
          <div className="output-group">
            <label>Base64 Output:</label>
            <div className="output-container">
              {encodeOutput ? (
                <pre className="text-output">{encodeOutput}</pre>
              ) : (
                <div className="output-placeholder">
                  <span className="placeholder-icon">🔒</span>
                  <p>Encoded text will appear here</p>
                </div>
              )}
            </div>
            {encodeOutput && (
              <button 
                className={`btn btn-secondary copy-btn ${copied.encode ? 'copied' : ''}`}
                onClick={() => handleCopy(encodeOutput, 'encode')}
              >
                {copied.encode ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>

        {/* Decoder Section */}
        <div className="decoder-section">
          <div className="section-header">
            <h3>🔓 Decode from Base64</h3>
            <div className="header-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => handleSampleData('decode')}
                disabled={loading}
              >
                Sample
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => handleClear('decode')}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Base64 Input:</label>
            <textarea
              className="text-input"
              value={decodeInput}
              onChange={(e) => handleInputChange(e, 'decode')}
              placeholder="Enter Base64 text to decode..."
              disabled={loading}
              rows={6}
            />
          </div>
          
          <button 
            className="btn btn-primary action-btn"
            onClick={handleDecode}
            disabled={loading || !decodeInput.trim()}
          >
            {loading ? 'Decoding...' : 'Decode'}
          </button>
          
          <div className="output-group">
            <label>Decoded Text:</label>
            <div className="output-container">
              {decodeOutput ? (
                <pre className="text-output">{decodeOutput}</pre>
              ) : (
                <div className="output-placeholder">
                  <span className="placeholder-icon">🔓</span>
                  <p>Decoded text will appear here</p>
                </div>
              )}
            </div>
            {decodeOutput && (
              <button 
                className={`btn btn-secondary copy-btn ${copied.decode ? 'copied' : ''}`}
                onClick={() => handleCopy(decodeOutput, 'decode')}
              >
                {copied.decode ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="info-section">
        <h3>About Base64</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>What is Base64?</h4>
            <p>Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation.</p>
          </div>
          <div className="info-card">
            <h4>Common Uses</h4>
            <ul>
              <li>Email attachments</li>
              <li>Data URLs</li>
              <li>API authentication</li>
              <li>Binary data in JSON</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>Character Set</h4>
            <p>Uses A-Z, a-z, 0-9, +, and / characters. Padding with = is used when necessary.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Base64Tool 