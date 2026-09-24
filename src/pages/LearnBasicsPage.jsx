import React, { useState, useEffect } from 'react';
import { fetchLearnBasics } from '../utils/api';

export default function LearnBasicsPage() {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    fetchLearnBasics().then(data => setGuides(data));
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          🎓 Sitemap Section 3: Learn Basics
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Fundamental Cooking Techniques</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Master boiling, frying, kitchen safety, and measurement conversions with beginner step-by-step guides.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {guides.map(g => (
          <div key={g.id} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '12px' }}>
                📖
              </div>
              <div>
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontSize: '0.75rem' }}>
                  {g.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>{g.title}</h3>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{g.summary}</p>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem', whiteSpace: 'pre-line', lineHeight: '1.7', flexGrow: 1 }}>
              {g.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
