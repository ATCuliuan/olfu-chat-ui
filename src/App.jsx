import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  // We will keep the history, but handle the first greeting separately in the UI
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  
  // NEW: Create a reference to the bottom of the chat
  const messagesEndRef = useRef(null)

  // NEW: Function to scroll smoothly to that reference
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // NEW: Trigger the scroll every time 'messages' or 'loading' changes
  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const askAI = async (questionText) => {
    if (!questionText.trim() || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: questionText }])
    setLoading(true)

    try {
      const res = await fetch('https://olfu-chat-api.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText })
      })
      
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply }])
      
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: "Error: Unable to connect to the server." }])
    }
    
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    askAI(input)
    setInput('')
  }

  return (
    <div className="app-wrapper">
      
      {/* 1. TOP NAVIGATION BAR (Cleaned up!) */}
      <nav className="navbar">
        <div className="nav-left">
          <img src="/images/olfu-logo.png" alt="OLFU Logo" className="logo" />
          <h1>OUR LADY OF FATIMA UNIVERSITY</h1>
        </div>
      </nav>

      {/* 2. HERO IMAGE BANNER */}
      <header className="hero-section">
        <div className="hero-overlay">
          <h2>Welcome to OLFU-QC SHS Chatbot!</h2>
          <p>How can I assist you today?</p>
        </div>
      </header>

      {/* 3. MAIN CHAT INTERFACE */}
      <main className="main-content">
        <div className="chat-container">
          
          {/* Avatar & Initial Greeting */}
          <div className="chat-greeting-area">
            <img src="/images/ai-avatar.png" alt="AI Agent" className="ai-avatar" />
            <div className="greeting-bubble">Hello! How can I help you today?</div>
          </div>

          {/* Quick Questions (Disappears once the user starts chatting) */}
          {messages.length === 0 && (
            <div className="quick-questions-section">
              <p className="qq-title">FAQ:</p>
              <div className="qq-buttons">
                <button onClick={() => askAI("What are the admission requirements?")}>What are the admission requirements?</button>
                <button onClick={() => askAI("Tell me about your SHS strands.")}>Tell me about your SHS strands.</button>
                <button onClick={() => askAI("How do I commute to the QC campus?")}>How do I commute to the QC campus?</button>
              </div>
            </div>
          )}

          {/* Scrolling Chat History */}
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className={`message-bubble ${msg.role}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-wrapper ai">
                <div className="message-bubble ai typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            
            {/* NEW: The invisible anchor for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Area */}
          <form onSubmit={handleSubmit} className="input-area">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type your question..." 
              disabled={loading}
            />
            <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="send-icon">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
              Send
            </button>
          </form>

          {/* Footer */}
          <div className="chat-footer">
            Powered by <strong>Gemini AI API</strong>
          </div>

        </div>
      </main>

    </div>
  )
}

export default App