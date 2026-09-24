import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer style={{ background: 'var(--bg-glass)', borderTop: '1px solid var(--border-color)', padding: '3rem 0', marginTop: '4rem' }}>
      <div className="app-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🍳 No Cook Helper
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Cooking for Everyone, Even if You Can't Cook! Empowering beginners, students, and busy adults with step-by-step guidance.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Quick Explore</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('recipes')}>Browse All Recipes</li>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('learn')}>Basic Cooking Techniques</li>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('ingredients')}>Ingredient Storage Guide</li>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('tools')}>Essential Kitchen Tools</li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Beginner Tools</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>"What Can I Make With This?" Tool</li>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('mealplans')}>Student 5-Day Meal Plan</li>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('tips')}>Cooking Hacks & Safety</li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Mission</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ❤️ Make cooking stress-free, approachable, clear, and achievable for everyone.
          </p>
        </div>
      </div>
      <div className="app-container" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        © 2026 No Cook Helper / CookItEasy - All Rights Reserved
      </div>
    </footer>
  );
}
