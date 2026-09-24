import React, { useState } from 'react';
import RecipeCard from '../components/RecipeCard';

export default function RecipesPage({ recipes, isFavorite, onToggleFavorite, onStartCooking, onViewDetails }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [noStoveOnly, setNoStoveOnly] = useState(false);
  const [maxTime, setMaxTime] = useState('');

  const categories = [
    'All', 
    'Juices & Coolers', 
    'Milkshakes & Smoothies', 
    'Gym Protein Food', 
    'No-Stove / No-Oven',
    'Breakfast', 
    'Lunch', 
    'Desserts'
  ];

  const filtered = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.description.toLowerCase().includes(search.toLowerCase()) ||
                          r.ingredients.some(ing => ing.name.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || r.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesVeg = !vegOnly || r.isVeg === true;
    const matchesNoStove = !noStoveOnly || r.isNoStove === true;
    const totalTime = (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0);
    const matchesTime = !maxTime || totalTime <= parseInt(maxTime, 10);

    return matchesSearch && matchesCategory && matchesVeg && matchesNoStove && matchesTime;
  });

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.3rem' }}>Explore Beginner Recipes</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Juices, Milkshakes, Gym Protein Foods, No-Stove Meals, and AI Video Demonstrations
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search */}
        <input 
          type="text" 
          className="glass-panel" 
          placeholder="🔍 Search juice, shake, protein, eggs, paneer, detox..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flexGrow: 1, minWidth: '220px', padding: '0.65rem 1rem', borderRadius: 'var(--radius-pill)', color: 'var(--text-main)' }}
        />

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.3rem', maxWidth: '100%' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters: Veg, No Stove & Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input 
              type="checkbox" 
              checked={vegOnly}
              onChange={e => setVegOnly(e.target.checked)}
            />
            🌱 Veg Only
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input 
              type="checkbox" 
              checked={noStoveOnly}
              onChange={e => setNoStoveOnly(e.target.checked)}
            />
            ❄️ No Stove / No Oven
          </label>

          <select 
            className="glass-panel"
            value={maxTime}
            onChange={e => setMaxTime(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-pill)', color: 'var(--text-main)', background: 'var(--bg-card)', fontSize: '0.85rem' }}
          >
            <option value="">⏱️ Any Preparation Time</option>
            <option value="5">Under 5 mins</option>
            <option value="10">Under 10 mins</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', margin: '2rem 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No recipes match your filter criteria. Try clearing search filters!</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filtered.map(r => (
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
  );
}
