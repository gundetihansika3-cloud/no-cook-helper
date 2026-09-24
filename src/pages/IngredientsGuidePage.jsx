import React, { useState, useEffect } from 'react';
import { fetchIngredientsGuide } from '../utils/api';

export default function IngredientsGuidePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchIngredientsGuide().then(data => setItems(data));
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          🥦 Sitemap Section 4: Ingredient Guide
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Storage & Ingredient Substitutes</h1>
        <p style={{ color: 'var(--text-muted)' }}>How to store pantry essentials so food lasts longer & smart ingredient swaps</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {items.map(item => (
          <div key={item.id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>{item.name}</h3>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                {item.category}
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--accent-amber)' }}>📦 Storage Instructions:</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{item.storage}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--accent-purple)' }}>🔄 Smart Substitutes:</strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                {item.substitutes.map((sub, i) => <li key={i}>{sub}</li>)}
              </ul>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong>💡 Pro Tip:</strong> {item.tips}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
