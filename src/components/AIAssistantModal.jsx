import React, { useState, useEffect } from 'react';
import { sendAIChat } from '../utils/api';

export default function AIAssistantModal({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! Welcome to your Cozy Family Kitchen AI Voice Assistant 🤖. Tap the microphone to speak with me, or ask: 'What can I substitute for eggs?', 'Why is my rice mushy?', or 'What can I make with bread & eggs?'" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const quickPrompts = [
    "What can I replace milk with?",
    "Why did my rice become mushy?",
    "What can I make with bread & eggs?",
    "How to boil eggs without cracking?"
  ];

  // Speak out loud using Web Speech API
  const speakOutLoud = (text) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Voice Input Speech Recognition
  const startVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please type your prompt.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAIChat(query);
      const replyText = res.reply || "I'm happy to help with any cooking questions!";
      setMessages([...newMsgs, { sender: 'ai', text: replyText }]);
      speakOutLoud(replyText);
    } catch (err) {
      const fallback = "I'm here in your cozy kitchen! Try selecting ingredients in our guide.";
      setMessages([...newMsgs, { sender: 'ai', text: fallback }]);
      speakOutLoud(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" style={{ maxWidth: '680px', height: '620px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🤖</span>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Cozy AI Voice Assistant</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hands-free voice Q&A & kitchen guidance</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="badge"
              style={{ background: isVoiceEnabled ? 'rgba(129, 178, 154, 0.2)' : 'rgba(0,0,0,0.06)', color: isVoiceEnabled ? '#2b7a58' : 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            >
              {isVoiceEnabled ? '🔊 Voice On' : '🔇 Voice Muted'}
            </button>
            <button className="btn-secondary" style={{ padding: '0.2rem 0.6rem', borderRadius: '50%' }} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Chat History */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
              <div 
                style={{ 
                  background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primary-hover))' : 'var(--bg-card)', 
                  color: m.sender === 'user' ? '#fff' : 'var(--text-main)',
                  padding: '0.75rem 1rem',
                  borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: m.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              🤖 AI is speaking & typing kitchen tips...
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {quickPrompts.map((qp, i) => (
            <button 
              key={i} 
              className="badge" 
              style={{ background: 'var(--accent-cream)', color: 'var(--text-main)', whiteSpace: 'nowrap', cursor: 'pointer', border: '1px solid var(--border-color)' }}
              onClick={() => handleSend(qp)}
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Form with Voice Button */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button 
            type="button"
            className="btn-secondary"
            onClick={startVoiceInput}
            style={{ background: isListening ? '#e63946' : 'var(--bg-card)', color: isListening ? '#fff' : 'var(--text-main)', padding: '0.75rem 1rem' }}
            title="Click to speak using your microphone"
          >
            {isListening ? '🎙️ Listening...' : '🎙️ Speak'}
          </button>

          <input 
            type="text" 
            className="glass-panel" 
            placeholder="Type or speak your question..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ flexGrow: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-pill)', color: 'var(--text-main)', background: 'var(--bg-card)' }}
          />
          <button className="btn-primary" type="submit" style={{ padding: '0.75rem 1.25rem' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
