import React, { useState } from 'react';
import { recommendRecipes } from '../utils/api';
import RecipeCard from './RecipeCard';

export default function IngredientPicker({ isFavorite, onToggleFavorite, onStartCooking, onViewDetails }) {
  const availableIngredients = [
    { name: "Bread", icon: "🍞" },
    { name: "Eggs", icon: "🥚" },
    { name: "Paneer", icon: "🧀" },
    { name: "Tomato", icon: "🍅" },
    { name: "Butter", icon: "🧈" },
    { name: "Noodles", icon: "🍜" },
    { name: "Oats", icon: "🥣" },
    { name: "Chickpeas", icon: "🫘" },
    { name: "Milk", icon: "🥛" },
    { name: "Chocolate", icon: "🍫" },
    { name: "Capsicum", icon: "🫑" },
    { name: "Cheese", icon: "🧀" }
  ];

  const [selected, setSelected] = useState(["Bread", "Eggs"]);
  const [matchedRecipes, setMatchedRecipes] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (ingName) => {
    if (selected.includes(ingName)) {
      setSelected(selected.filter(i => i !== ingName));
    } else {
      setSelected([...selected, ingName]);
    }
  };

  const handleRecommend = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const results = await recommendRecipes(selected);
      setMatchedRecipes(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', margin: '2rem 0', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(139, 92, 246, 0.08))', border: '1px solid var(--border-highlight)' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          🔍 Feature Spotlight (Phase 5)
        </span>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          "What Can I Make With This?" Tool
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Select the ingredients you currently have in your kitchen or fridge. We'll instantly match beginner-friendly recipes you can cook right now!
        </p>
      </div>

      {/* Ingredient Chip Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {availableIngredients.map(ing => {
          const isSel = selected.includes(ing.name);
          return (
            <button
              key={ing.name}
              onClick={() => toggleSelect(ing.name)}
              className="glass-panel"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-pill)',
                background: isSel ? 'var(--primary)' : 'var(--bg-card)',
                color: isSel ? '#ffffff' : 'var(--text-main)',
                border: isSel ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: isSel ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <span>{ing.icon}</span> {ing.name}
              {isSel && <span style={{ marginLeft: '0.2rem' }}>✓</span>}
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginBottom: matchedRecipes ? '2rem' : '0' }}>
        <button 
          className="btn-primary" 
          onClick={handleRecommend}
          disabled={loading || selected.length === 0}
          style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
        >
          {loading ? 'Finding Best Matches...' : `Find Recipes (${selected.length} Selected) 🚀`}
        </button>
      </div>

      {/* Results Display */}
      {matchedRecipes && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            🎯 Matched Recipes ({matchedRecipes.length} Found)
          </h3>
          {matchedRecipes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No exact recipe matches found. Try selecting more ingredients or view all recipes!</p>
          ) : (
            <div className="recipes-grid">
              {matchedRecipes.map(r => (
                <RecipeCard 
                  key={r.id} 
                  recipe={r} 
                  isFavorite={isFavorite(r.id)} 
                  onToggleFavorite={onToggleFavorite}
                  onStartCooking={onStartCooking}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
