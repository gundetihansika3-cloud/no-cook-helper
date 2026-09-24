import React from 'react';
import IngredientPicker from '../components/IngredientPicker';
import RecipeCard from '../components/RecipeCard';

export default function HomePage({ recipes, isFavorite, onToggleFavorite, onStartCooking, onViewDetails, setActiveTab }) {
  const featured = recipes.slice(0, 3);

  const targetUsers = [
    { title: "Students", desc: "Quick hostel-friendly meals under 10 minutes", icon: "🎓" },
    { title: "Busy Professionals", desc: "Zero hassle prep after a long working day", icon: "💼" },
    { title: "Newly Independent Adults", desc: "Step-by-step guidance so you never burn food", icon: "🏠" },
    { title: "Non-Cooking Beginners", desc: "No culinary experience required at all!", icon: "🍳" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '1rem', padding: '0.35rem 0.85rem' }}>
          ✨ Step-by-Step Cooking Guide for Non-Cooks
        </div>
        <h1 className="hero-title">
          Cooking Made Simple,<br />Even If You Can't Cook!
        </h1>
        <p className="hero-subtitle">
          Welcome to No Cook Helper / CookItEasy. Learn to prepare delicious meals with beginner-friendly instructions, interactive timers, ingredient substitutes, and instant AI guidance.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem' }} onClick={() => setActiveTab('recipes')}>
            Explore All Recipes 📖
          </button>
          <button className="btn-secondary" style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem' }} onClick={() => setActiveTab('learn')}>
            Learn Kitchen Basics 🎓
          </button>
        </div>
      </section>

      {/* Target Users Cards */}
      <section style={{ margin: '3rem 0' }}>
        <h3 style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Designed Specially For
        </h3>
        <div className="user-types-grid">
          {targetUsers.map((u, i) => (
            <div key={i} className="user-type-card glass-panel">
              <div className="user-type-icon">{u.icon}</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{u.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredient Recommender Spotlight */}
      <IngredientPicker 
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onStartCooking={onStartCooking}
        onViewDetails={onViewDetails}
      />

      {/* Featured Beginner Recipes */}
      <section style={{ margin: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem' }}>Popular Beginner Recipes</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fast, foolproof recipes with high ratings</p>
          </div>
          <button className="btn-secondary" onClick={() => setActiveTab('recipes')}>
            View All ({recipes.length}) ➡️
          </button>
        </div>

        <div className="recipes-grid">
          {featured.map(r => (
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
      </section>
    </div>
  );
}
