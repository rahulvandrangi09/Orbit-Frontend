import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // 🔥 Added to track current page
import '../Components/styles/chatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Track the URL
  const messageEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Orbit Command AI online. How can I assist your journey?' }
  ]);

  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Auto-scroll to the bottom of the bot chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt = null) => {
    const finalInput = customPrompt || input;
    if (!finalInput.trim()) return;
    
    setMessages((prev) => [...prev, { sender: 'user', text: finalInput }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${url}/api/rooms/bot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🔥 We now send the current URL to the backend!
        body: JSON.stringify({ prompt: finalInput, currentUrl: location.pathname }), 
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'bot', text: '☄️ Transmission failed. Server offline.' }]);
    }
    setLoading(false);
  };

  // Check if we are currently inside a chat room to show the Quick Action button
  const isInRoom = location.pathname.includes('/publicroom/') || location.pathname.includes('/privateroom/');

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h4>Orbit AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>
          
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message bot">Scanning frequencies...</div>}
            <div ref={messageEndRef} />
          </div>

          {/* Quick Action Buttons */}
          {isInRoom && !loading && (
             <div style={{ padding: '0 16px 10px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
                <button 
                  onClick={() => handleSend("Can you summarize the recent messages in this room?")}
                  style={{
                    backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #38bdf8',
                    padding: '6px 12px', borderRadius: '15px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  📝 Summarize Chat
                </button>
             </div>
          )}

          <div className="chat-footer">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask a question..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={() => handleSend()} disabled={loading}>Send</button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          🤖 OrbitBot
        </button>
      )}
    </div>
  );
};

export default ChatWidget;