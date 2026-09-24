import React, { useState, useEffect } from 'react';
import { fetchFavorites, fetchCookHistory } from '../utils/api';
import RecipeCard from '../components/RecipeCard';

export default function FavoritesPage({ isFavorite, onToggleFavorite, onStartCooking, onViewDetails }) {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'history'
  const [favs, setFavs] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchFavorites().then(data => setFavs(data));
    fetchCookHistory().then(data => setHistory(data));
  }, [isFavorite]);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          ❤️ Sitemap Section 9: Favorites & History
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Your Saved Items & Cooking Log</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track recipes you love and your cooking milestones</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={activeTab === 'saved' ? "btn-primary" : "btn-secondary"}
          onClick={() => setActiveTab('saved')}
        >
          ❤️ Saved Recipes ({favs.length})
        </button>

        <button 
          className={activeTab === 'history' ? "btn-primary" : "btn-secondary"}
          onClick={() => setActiveTab('history')}
        >
          📜 Cooking History ({history.length})
        </button>
      </div>

      {activeTab === 'saved' && (
        <div>
          {favs.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No saved recipes yet. Click the heart icon on any recipe to save it here!</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {favs.map(r => (
                <RecipeCard 
                  key={r.id}
                  recipe={r}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onStartCooking={onStartCooking}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't completed any step-by-step cook sessions yet. Start cooking a recipe to build your log!</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.recipe && (
                    <img 
                      src={item.recipe.image} 
                      alt={item.recipe.title} 
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px' }} 
                    />
                  )}
                  <div>
                    <h4 style={{ fontSize: '1.1rem' }}>{item.recipe ? item.recipe.title : 'Cooked Meal'}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Completed on: {new Date(item.completedAt).toLocaleDateString()}
                    </div>
                    {item.notes && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
                        📝 Note: "{item.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.2rem' }}>
                    {'⭐'.repeat(item.rating || 5)}
                  </div>
                  {item.recipe && (
                    <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => onStartCooking(item.recipe)}>
                      Cook Again 🔄
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
