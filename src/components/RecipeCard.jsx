import React from 'react';

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite, onStartCooking, onViewDetails }) {
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return (
    <div className="glass-panel recipe-card">
      <div className="recipe-card-img-wrapper">
        <img src={recipe.image} alt={recipe.title} className="recipe-card-img" />
        <button 
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '0.4rem' }}>
          <span className={recipe.isVeg ? "badge badge-veg" : "badge badge-nonveg"}>
            {recipe.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
          </span>
          <span className="badge badge-time">
            ⏱️ {totalTime} min
          </span>
        </div>
      </div>

      <div className="recipe-card-body">
        {recipe.matchScore !== undefined && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', display: 'inline-block' }}>
            🎯 {recipe.matchScore}% Ingredient Match ({recipe.matchCount} matched)
          </div>
        )}

        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-desc">{recipe.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔥 {recipe.difficulty} • {recipe.calories} kcal
          </span>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button 
              className="btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => onViewDetails(recipe)}
            >
              View
            </button>

            <button 
              className="btn-primary" 
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => onStartCooking(recipe)}
            >
              Start 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
