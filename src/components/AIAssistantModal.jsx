import React, { useState } from 'react';
import { sendAIChat } from '../utils/api';

export default function AIAssistantModal({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your No-Cook AI Helper 🤖. Ask me anything like: 'What can I substitute for eggs?', 'Why is my rice mushy?', or 'What can I make with bread and tomatoes?'" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What can I replace milk with?",
    "Why did my rice become mushy?",
    "What can I make with bread & eggs?",
    "How to boil eggs without cracking?"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAIChat(query);
      setMessages([...newMsgs, { sender: 'ai', text: res.reply || "I'm happy to help with any beginner cooking tips!" }]);
    } catch (err) {
      setMessages([...newMsgs, { sender: 'ai', text: "I'm currently updating my recipe database. Try selecting an ingredient in our guide!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" style={{ maxWidth: '650px', height: '600px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>AI Cooking Assistant</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>24/7 Kitchen guidance for non-cooks</p>
            </div>
          </div>
          <button className="btn-secondary" style={{ padding: '0.2rem 0.6rem', borderRadius: '50%' }} onClick={onClose}>✕</button>
        </div>

        {/* Chat History */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
              <div 
                style={{ 
                  background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), #059669)' : 'var(--bg-card)', 
                  color: m.sender === 'user' ? '#fff' : 'var(--text-main)',
                  padding: '0.75rem 1rem',
                  borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: m.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              🤖 AI is typing kitchen tips...
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {quickPrompts.map((qp, i) => (
            <button 
              key={i} 
              className="badge" 
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', whiteSpace: 'nowrap', cursor: 'pointer', border: '1px solid var(--border-color)' }}
              onClick={() => handleSend(qp)}
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input 
            type="text" 
            className="glass-panel" 
            placeholder="Ask your cooking question..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ flexGrow: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-pill)', color: 'var(--text-main)' }}
          />
          <button className="btn-primary" type="submit" style={{ padding: '0.75rem 1.25rem' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
