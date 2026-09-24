import React from 'react';

export default function ProfilePage({ user, onLogout, onOpenLogin }) {
  if (!user) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>User Login & Profile</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Log in to save recipes across devices, store personal cooking notes, and customize dietary preferences!
          </p>
          <button className="btn-primary" onClick={onOpenLogin}>
            Login or Sign Up Now 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          👤 Sitemap Section 10: Profile & Preferences
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>User Profile</h1>
      </div>

      <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#fff' }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>{user.name}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            <span className="badge badge-veg" style={{ marginTop: '0.4rem' }}>
              Level: {user.cookingSkill || 'Absolute Beginner'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dietary Preference:</label>
            <div style={{ fontWeight: '600', fontSize: '1.1rem', marginTop: '0.2rem' }}>🌱 {user.dietPreference || 'Vegetarian'}</div>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kitchen Goal:</label>
            <div style={{ fontWeight: '600', fontSize: '1.1rem', marginTop: '0.2rem' }}>🍳 Master basic 10-minute non-scary recipes</div>
          </div>
        </div>

        <button className="btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }} onClick={onLogout}>
          Log Out of Account
        </button>
      </div>
    </div>
  );
}
