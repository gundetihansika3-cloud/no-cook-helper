import React from 'react';

export default function RecipeDetailPage({ recipe, isFavorite, onToggleFavorite, onStartCooking, onBack }) {
  if (!recipe) return null;

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return (
    <div style={{ padding: '2rem 0' }}>
      <button className="btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={onBack}>
        ⬅️ Back to Recipes
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className={recipe.isVeg ? "badge badge-veg" : "badge badge-nonveg"}>
                {recipe.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
              </span>
              <span className="badge badge-time">
                ⏱️ Prep: {recipe.prepTimeMinutes}m | Cook: {recipe.cookTimeMinutes}m
              </span>
              <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                🔥 {recipe.difficulty}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{recipe.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>{recipe.description}</p>

            <div style={{ display: 'flex', gap: '1.5rem', margin: '1.5rem 0', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SERVINGS</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>👥 {recipe.servings} Person</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CALORIES</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>⚡ {recipe.calories} kcal</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CUISINE</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>🌍 {recipe.cuisine}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-primary" 
                style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', flexGrow: 1 }}
                onClick={() => onStartCooking(recipe)}
              >
                Start Cooking Step-by-Step 🚀
              </button>

              <button 
                className="btn-secondary"
                onClick={() => onToggleFavorite(recipe.id)}
                style={{ padding: '0.85rem 1.25rem' }}
              >
                {isFavorite(recipe.id) ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients & Substitutes Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              🥦 Ingredients & Substitutes
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>{ing.name}</strong>
                    {ing.substitute && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
                        💡 Substitute: {ing.substitute}
                      </div>
                    )}
                  </div>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {ing.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              📋 Step-by-Step Overview ({recipe.steps.length} Steps)
            </h3>
            <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recipe.steps.map((st, idx) => (
                <li key={idx} style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>{st.title}</strong>: {st.description.slice(0, 80)}...
                </li>
              ))}
            </ol>

            {recipe.safetyTips && recipe.safetyTips.length > 0 && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', borderLeft: '4px solid #ef4444', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem' }}>
                <h4 style={{ color: '#ef4444', marginBottom: '0.4rem' }}>⚠️ Kitchen Safety Note</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem' }}>
                  {recipe.safetyTips.map((st, i) => <li key={i}>{st}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
