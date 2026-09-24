import React, { useState, useEffect } from 'react';
import { fetchKitchenTools } from '../utils/api';

export default function KitchenToolsPage() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetchKitchenTools().then(data => setTools(data));
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          🛠️ Sitemap Section 5: Kitchen Tools
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Essential Kitchen Tools Guide</h1>
        <p style={{ color: 'var(--text-muted)' }}>The only 4 tools an absolute beginner needs to start cooking confidently</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {tools.map(t => (
          <div key={t.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{t.name}</h3>
              {t.essential && <span className="badge badge-veg">Essential</span>}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', flexGrow: 1 }}>
              <strong>Uses:</strong> {t.useCase}
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <strong style={{ color: 'var(--accent-amber)' }}>🛡️ Care & Maintenance:</strong> {t.care}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
