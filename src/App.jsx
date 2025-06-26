import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import JsonFormatter from './pages/JsonFormatter'
import Base64Tool from './pages/Base64Tool'
import History from './pages/History'
import './styles/App.css'

function App() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('json')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Set active tab based on current route
    if (location.pathname === '/') setActiveTab('json')
    else if (location.pathname === '/base64') setActiveTab('base64')
    else if (location.pathname === '/history') setActiveTab('history')
  }, [location])

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
    localStorage.setItem('theme', initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">
            <span className="logo-icon">🛠️</span>
            Dev Toolbox
          </h1>
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveTab('json')}
            >
              JSON Formatter
            </Link>
            <Link 
              to="/base64" 
              className={`nav-link ${activeTab === 'base64' ? 'active' : ''}`}
              onClick={() => setActiveTab('base64')}
            >
              Base64 Encoder/Decoder
            </Link>
            <Link 
              to="/history" 
              className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </Link>
            <button 
              className="theme-toggle btn btn-secondary"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<JsonFormatter />} />
            <Route path="/base64" element={<Base64Tool />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2024 Dev Toolbox. Built with React & Node.js</p>
        </div>
      </footer>
    </div>
  )
}

export default App