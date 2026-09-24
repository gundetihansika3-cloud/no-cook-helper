import React, { useState, useEffect } from 'react';
import { fetchMealPlans } from '../utils/api';

export default function MealPlansPage({ onStartCookingByName, recipes }) {
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState('');

  useEffect(() => {
    fetchMealPlans().then(data => {
      setPlans(data);
      if (data.length > 0) setActivePlanId(data[0].id);
    });
  }, []);

  const currentPlan = plans.find(p => p.id === activePlanId);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          📅 Sitemap Section 6: Meal Plans
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Curated Weekly Meal Plans</h1>
        <p style={{ color: 'var(--text-muted)' }}>Never ask "What should I eat today?" again!</p>
      </div>

      {/* Plan Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {plans.map(p => (
          <button 
            key={p.id}
            onClick={() => setActivePlanId(p.id)}
            className={activePlanId === p.id ? "btn-primary" : "btn-secondary"}
          >
            {p.title}
          </button>
        ))}
      </div>

      {currentPlan && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{currentPlan.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{currentPlan.description}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {currentPlan.schedule.map((item, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-amber)', marginBottom: '0.85rem' }}>
                  🗓️ {item.day}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MORNING</div>
                    <strong style={{ fontSize: '0.9rem' }}>🥣 {item.breakfast}</strong>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AFTERNOON</div>
                    <strong style={{ fontSize: '0.9rem' }}>🥗 {item.lunch}</strong>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EVENING / NIGHT</div>
                    <strong style={{ fontSize: '0.9rem' }}>🍲 {item.dinner}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
