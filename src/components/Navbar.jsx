import React, { useState, useEffect } from 'react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAI }) {
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
    { id: 'learn', label: 'Learn Basics', icon: '🎓' },
    { id: 'ingredients', label: 'Ingredients', icon: '🥦' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'mealplans', label: 'Gym & Meal Plans', icon: '💪' },
    { id: 'tips', label: 'Tips & Hacks', icon: '💡' },
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
              onClick={handleInstallPWA}
              title="Install native phone app"
            >
              📲 Install App
            </button>

            <button 
              className="btn-primary" 
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
              onClick={onOpenAI}
            >
              🤖 AI Help
            </button>

            <button 
              className="btn-secondary" 
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
              onClick={() => setActiveTab('profile')}
            >
              👤 {user ? user.name.split(' ')[0] : 'Login'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Phone App Bottom Navigation Bar */}
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
          className={`mobile-nav-item ${activeTab === 'mealplans' ? 'active' : ''}`}
          onClick={() => setActiveTab('mealplans')}
        >
          <span>💪</span> Gym Plans
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
