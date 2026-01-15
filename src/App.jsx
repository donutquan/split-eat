import './index.css'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Split Eat</h1>
        <p className="hero-subtitle">Bills split better, together. 🍕</p>
      </header>

      <div className="feature-list">
        <div className="feature-item">
          <span className="feature-icon">👥</span>
          <span className="feature-text">Add your crew</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🍱</span>
          <span className="feature-text">Input food items</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🤝</span>
          <span className="feature-text">Share the love (and the cost)</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📊</span>
          <span className="feature-text">Live total updates</span>
        </div>
      </div>

      <div className="glass-card">
        <p style={{ textAlign: 'center', opacity: 0.8, fontSize: '0.9rem' }}>
          Coming soon: Service charge, tax, and custom discounts!
        </p>
      </div>

      <button className="btn-primary">
        Get Started 🚀
      </button>
    </div>
  )
}

export default App
