import React, { useState, useEffect } from 'react';
import { fetchTips } from '../utils/api';

export default function TipsTricksPage() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetchTips().then(data => setTips(data));
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          💡 Sitemap Section 7: Tips & Tricks
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Cooking Hacks & Common Mistakes</h1>
        <p style={{ color: 'var(--text-muted)' }}>Learn how to fix salty food, save time, and cook stress-free</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {tips.map(t => (
          <div key={t.id} className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                {t.category}
              </span>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>{t.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>{t.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
