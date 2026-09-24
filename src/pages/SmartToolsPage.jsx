import React, { useState, useEffect } from 'react';
import { 
  fetchShoppingList, addShoppingItem, 
  fetchPantryItems, addPantryItem, 
  fetchCommunityPosts, addCommunityPost 
} from '../utils/api';

export default function SmartToolsPage() {
  const [activeSubTab, setActiveSubTab] = useState('pantry'); // 'pantry' | 'shopping' | 'leftovers' | 'converter' | 'budget' | 'community'

  // Pantry State
  const [pantry, setPantry] = useState([]);
  const [newPantryName, setNewPantryName] = useState('');

  // Shopping List State
  const [shopping, setShopping] = useState([]);
  const [newItemName, setNewItemName] = useState('');

  // Leftover Ideas State
  const [leftoverInput, setLeftoverInput] = useState('Leftover Rice & Boiled Potato');
  const [leftoverResult, setLeftoverResult] = useState('');

  // Unit Converter State
  const [convertVal, setConvertVal] = useState(1);
  const [convertType, setConvertType] = useState('cupToMl');

  // Budget Calculator State
  const [servingsCount, setServingsCount] = useState(2);
  const [ingredientCost, setIngredientCost] = useState(4.5);

  // Community State
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    fetchPantryItems().then(data => setPantry(data));
    fetchShoppingList().then(data => setShopping(data));
    fetchCommunityPosts().then(data => setPosts(data));
  }, []);

  const handleAddPantry = async (e) => {
    e.preventDefault();
    if (!newPantryName.trim()) return;
    const updated = await addPantryItem(newPantryName, 'General', 'In Stock');
    setPantry(updated);
    setNewPantryName('');
  };

  const handleAddShopping = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const updated = await addShoppingItem(newItemName, '1 pack');
    setShopping(updated);
    setNewItemName('');
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    const updated = await addCommunityPost('Cozy Kitchen Chef', postTitle, postContent);
    setPosts(updated);
    setPostTitle('');
    setPostContent('');
  };

  const calculateUnit = () => {
    const val = parseFloat(convertVal) || 0;
    switch (convertType) {
      case 'cupToMl': return `${val} Cup = ${val * 240} ml`;
      case 'tbspToTsp': return `${val} Tablespoon = ${val * 3} Teaspoons`;
      case 'tbspToMl': return `${val} Tablespoon = ${val * 15} ml`;
      case 'gToOz': return `${val} Grams = ${(val * 0.035274).toFixed(2)} Ounces`;
      default: return '';
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlignment: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-veg" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          🧰 Diagram Section 7: Smart Tools & Community Hub
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Kitchen Intelligence Hub</h1>
        <p style={{ color: 'var(--text-muted)' }}>Pantry Manager, Smart Shopping List, Leftover Ideas, Unit Converter & Community</p>
      </div>

      {/* Subtab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {[
          { id: 'pantry', label: '🥫 Pantry Manager' },
          { id: 'shopping', label: '🛒 Shopping List' },
          { id: 'leftovers', label: '🍲 Leftover Ideas' },
          { id: 'converter', label: '📐 Unit Converter' },
          { id: 'budget', label: '💰 Budget Calculator' },
          { id: 'community', label: '💬 Community & Tips' }
        ].map(st => (
          <button 
            key={st.id}
            onClick={() => setActiveSubTab(st.id)}
            className={activeSubTab === st.id ? "btn-primary" : "btn-secondary"}
            style={{ fontSize: '0.88rem' }}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* 1. PANTRY MANAGER */}
      {activeSubTab === 'pantry' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '750px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem' }}>🥫 Pantry Manager</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Keep track of ingredients in your kitchen so you never buy duplicates or run out!
          </p>

          <form onSubmit={handleAddPantry} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="glass-panel" 
              placeholder="Add pantry item (e.g. Milk, Eggs, Butter)..." 
              value={newPantryName}
              onChange={e => setNewPantryName(e.target.value)}
              style={{ flexGrow: 1, padding: '0.65rem 1rem', color: 'var(--text-main)', background: 'var(--bg-card)' }}
            />
            <button className="btn-primary" type="submit">Add Item</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pantry.map(item => (
              <div key={item.id} className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>{item.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({item.category})</span>
                </div>
                <span className="badge badge-veg">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SHOPPING LIST */}
      {activeSubTab === 'shopping' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '750px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem' }}>🛒 Smart Grocery Shopping List</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Check off items while walking through the grocery store!
          </p>

          <form onSubmit={handleAddShopping} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="glass-panel" 
              placeholder="Add ingredient to buy (e.g. 1 loaf Bread, 6 Eggs)..." 
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              style={{ flexGrow: 1, padding: '0.65rem 1rem', color: 'var(--text-main)', background: 'var(--bg-card)' }}
            />
            <button className="btn-primary" type="submit">Add to List</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {shopping.map(item => (
              <label key={item.id} className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  onChange={() => {
                    setShopping(shopping.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i));
                  }}
                />
                <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--text-muted)' : 'var(--text-main)' }}>
                  <strong>{item.item}</strong> ({item.quantity})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 3. LEFTOVER IDEAS */}
      {activeSubTab === 'leftovers' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '750px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem' }}>🍲 Zero-Waste Leftover Meal Generator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Type what leftover food you have in your fridge (e.g., stale bread, boiled rice, leftover paneer) to get instant recipe ideas!
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="glass-panel" 
              value={leftoverInput}
              onChange={e => setLeftoverInput(e.target.value)}
              style={{ flexGrow: 1, padding: '0.65rem 1rem', color: 'var(--text-main)', background: 'var(--bg-card)' }}
            />
            <button 
              className="btn-primary" 
              onClick={() => {
                setLeftoverResult(`💡 Zero-Waste Idea: Transform your '${leftoverInput}' into a 5-Minute Quick Stir Fry Bowl! Add 1 tsp butter, black pepper, diced tomatoes, and toss on medium flame for 3 minutes.`);
              }}
            >
              Generate Idea 💡
            </button>
          </div>

          {leftoverResult && (
            <div style={{ background: 'rgba(217, 119, 6, 0.12)', borderLeft: '4px solid #d97706', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              {leftoverResult}
            </div>
          )}
        </div>
      )}

      {/* 4. UNIT CONVERTER */}
      {activeSubTab === 'converter' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem' }}>📐 Kitchen Unit Converter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Easily convert cups, tablespoons, grams, and milliliters for precise cooking.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <input 
              type="number" 
              className="glass-panel"
              value={convertVal}
              onChange={e => setConvertVal(e.target.value)}
              style={{ width: '100px', padding: '0.65rem', color: 'var(--text-main)', background: 'var(--bg-card)' }}
            />

            <select 
              className="glass-panel"
              value={convertType}
              onChange={e => setConvertType(e.target.value)}
              style={{ padding: '0.65rem 1rem', color: 'var(--text-main)', background: 'var(--bg-card)', flexGrow: 1 }}
            >
              <option value="cupToMl">Cups ➡️ Milliliters (ml)</option>
              <option value="tbspToTsp">Tablespoons (tbsp) ➡️ Teaspoons (tsp)</option>
              <option value="tbspToMl">Tablespoons (tbsp) ➡️ Milliliters (ml)</option>
              <option value="gToOz">Grams (g) ➡️ Ounces (oz)</option>
            </select>
          </div>

          <div style={{ background: 'var(--accent-cream)', padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
            {calculateUnit()}
          </div>
        </div>
      )}

      {/* 5. BUDGET CALCULATOR */}
      {activeSubTab === 'budget' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem' }}>💰 Recipe Budget Calculator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Calculate exact cost per serving for students & budget-conscious cooks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Ingredient Cost ($):</label>
              <input 
                type="number" 
                className="glass-panel"
                value={ingredientCost}
                onChange={e => setIngredientCost(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem', color: 'var(--text-main)', marginTop: '0.2rem', background: 'var(--bg-card)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Number of Servings:</label>
              <input 
                type="number" 
                className="glass-panel"
                value={servingsCount}
                onChange={e => setServingsCount(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem', color: 'var(--text-main)', marginTop: '0.2rem', background: 'var(--bg-card)' }}
              />
            </div>
          </div>

          <div style={{ background: 'rgba(129, 178, 154, 0.15)', border: '1px solid rgba(129, 178, 154, 0.4)', padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>COST PER SERVING:</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#2b7a58' }}>
              ${((parseFloat(ingredientCost) || 0) / (parseInt(servingsCount, 10) || 1)).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* 6. COMMUNITY & TIPS */}
      {activeSubTab === 'community' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '1rem' }}>💬 Post a Community Tip or Question</h3>
            <form onSubmit={handleAddPost} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input 
                type="text" 
                className="glass-panel" 
                placeholder="Title (e.g. Easy way to peel garlic without hassle)..." 
                value={postTitle}
                onChange={e => setPostTitle(e.target.value)}
                style={{ padding: '0.65rem 1rem', color: 'var(--text-main)', background: 'var(--bg-card)' }}
              />
              <textarea 
                className="glass-panel" 
                placeholder="Share your kitchen tip or ask a question to the community..." 
                rows="3"
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                style={{ padding: '0.65rem 1rem', color: 'var(--text-main)', background: 'var(--bg-card)' }}
              />
              <button className="btn-primary" type="submit" style={{ alignSelf: 'flex-start' }}>
                Share Post 🚀
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {posts.map(post => (
              <div key={post.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--primary)' }}>👤 {post.author}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.date}</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{post.title}</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6' }}>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
