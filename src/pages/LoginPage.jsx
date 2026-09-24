import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/api';

export default function LoginPage({ onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [diet, setDiet] = useState('Vegetarian');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await registerUser(name, email, password, diet);
      } else {
        res = await loginUser(email, password);
      }

      if (res.error) {
        setError(res.error);
      } else {
        onLoginSuccess(res.user, res.token);
        onClose();
      }
    } catch (err) {
      setError('Connection error. Please check server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <button className="btn-secondary" style={{ padding: '0.2rem 0.6rem', borderRadius: '50%' }} onClick={onClose}>✕</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input 
                type="text" 
                className="glass-panel" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem', color: 'var(--text-main)', marginTop: '0.2rem' }} 
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              className="glass-panel" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 1rem', color: 'var(--text-main)', marginTop: '0.2rem' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              className="glass-panel" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 1rem', color: 'var(--text-main)', marginTop: '0.2rem' }} 
            />
          </div>

          {isRegister && (
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Diet Preference</label>
              <select 
                className="glass-panel"
                value={diet}
                onChange={e => setDiet(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem', color: 'var(--text-main)', marginTop: '0.2rem', background: 'var(--bg-card)' }}
              >
                <option value="Vegetarian">🌱 Vegetarian</option>
                <option value="Non-Vegetarian">🍗 Non-Vegetarian</option>
                <option value="Vegan">🥦 Vegan</option>
              </select>
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Log In' : 'Sign Up'}
          </span>
        </div>
      </div>
    </div>
  );
}
