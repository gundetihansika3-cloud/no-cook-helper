import React, { useState, useEffect } from 'react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAI, currentLang, setCurrentLang }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("To install on iPhone/Android:\n1. Tap your browser share/menu button (⋮ or 📤).\n2. Select 'Add to Home Screen'!");
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'recipes', label: 'Recipes', icon: '📖' },
    { id: 'smart-tools', label: 'Smart Tools', icon: '🧰' },
    { id: 'learn', label: 'Learn Basics', icon: '🎓' },
    { id: 'ingredients', label: 'Ingredients', icon: '🥦' },
    { id: 'mealplans', label: 'Gym & Meal Plans', icon: '💪' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' }
  ];

  return (
    <>
      <header className="navbar-header">
        <div className="app-container navbar-content">
          <div className="brand-logo" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <span>🍳</span> No Cook Helper
          </div>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className="nav-links">
              {navItems.map(item => (
                <li key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`}>
                  <button onClick={() => setActiveTab(item.id)}>
                    <span>{item.icon}</span> {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Multi-Language Selector */}
            <select 
              className="glass-panel"
              value={currentLang}
              onChange={e => setCurrentLang(e.target.value)}
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)', color: 'var(--text-main)', background: 'var(--bg-card)' }}
            >
              <option value="en">🌐 EN</option>
              <option value="hi">🌐 HI (हिंदी)</option>
              <option value="es">🌐 ES</option>
              <option value="fr">🌐 FR</option>
            </select>

            <button 
              className="btn-primary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, #d97706, #e07a5f)' }}
              onClick={handleInstallPWA}
              title="Install native phone app"
            >
              📲 Install App
            </button>

            <button 
              className="btn-primary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, #e07a5f, #81b29a)' }}
              onClick={onOpenAI}
            >
              🎙️ AI Voice
            </button>

            <button 
              className="btn-secondary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={() => setActiveTab('profile')}
            >
              👤 {user ? user.name.split(' ')[0] : 'Login'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <span>🏠</span> Home
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <span>📖</span> Recipes
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'smart-tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('smart-tools')}
        >
          <span>🧰</span> Tools
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <span>❤️</span> Favorites
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span>👤</span> Profile
        </button>
      </div>
    </>
  );
}
