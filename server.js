import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { readDB, writeDB, initDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'nocookhelper_secret_key_2026';

app.use(cors());
app.use(express.json());

// Initialize & Connect Database
initDB();

// Middleware: Authenticate JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) req.user = null;
    else req.user = user;
    next();
  });
}

app.use(authenticateToken);

// ================= AUTH ROUTES =================
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, dietPreference } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const db = readDB();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Email already registered.' });
  }

  const newUser = {
    id: 'u_' + Date.now(),
    name,
    email,
    password,
    dietPreference: dietPreference || 'Vegetarian',
    cookingSkill: 'Beginner',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, dietPreference: newUser.dietPreference } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, dietPreference: user.dietPreference } });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, dietPreference: user.dietPreference, cookingSkill: user.cookingSkill } });
});

// ================= RECIPES & INGREDIENT MATCHING =================
app.get('/api/recipes', (req, res) => {
  const db = readDB();
  let recipes = db.recipes;
  const { search, category, cuisine, difficulty, isVeg, maxTime } = req.query;

  if (search) {
    const s = search.toLowerCase();
    recipes = recipes.filter(r => 
      r.title.toLowerCase().includes(s) || 
      r.description.toLowerCase().includes(s) ||
      r.ingredients.some(ing => ing.name.toLowerCase().includes(s))
    );
  }
  if (category && category !== 'All') {
    recipes = recipes.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (difficulty && difficulty !== 'All') {
    recipes = recipes.filter(r => r.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (isVeg === 'true') {
    recipes = recipes.filter(r => r.isVeg === true);
  }
  if (maxTime) {
    const timeLimit = parseInt(maxTime, 10);
    recipes = recipes.filter(r => ((r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0)) <= timeLimit);
  }

  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const db = readDB();
  const recipe = db.recipes.find(r => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

// "What Can I Make With This?" Ingredient Recommender
app.post('/api/recipes/recommend', (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'Ingredients array required' });
  }

  const db = readDB();
  const selected = ingredients.map(i => i.toLowerCase());

  const matched = db.recipes.map(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
    let matchCount = 0;
    selected.forEach(s => {
      if (recipeIngredients.some(ring => ring.includes(s) || s.includes(ring))) {
        matchCount++;
      }
    });

    const matchScore = Math.round((matchCount / Math.max(recipeIngredients.length, 1)) * 100);
    return { ...recipe, matchCount, matchScore };
  })
  .filter(r => r.matchCount > 0)
  .sort((a, b) => b.matchCount - a.matchCount || b.matchScore - a.matchScore);

  res.json(matched);
});

// ================= AI ASSISTANT API =================
app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const msgLower = message.toLowerCase();
  const db = readDB();

  const match = db.aiKnowledge.find(k => k.keywords.some(kw => msgLower.includes(kw)));

  let answer = "";
  if (match) {
    answer = match.answer;
  } else if (msgLower.includes("make") || msgLower.includes("cook")) {
    answer = "I recommend our Fresh Mint Detox Juice, 35g Protein Chocolate Shake, or Avocado Toast! Use our 'What can I make with?' tool to select what's in your fridge.";
  } else if (msgLower.includes("beginner") || msgLower.includes("start")) {
    answer = "As a beginner, start with stove-free wraps or 5-minute boiled egg recipes! Keep your heat on Low to Medium, use non-stick pans, and remember to measure water 1:2 when boiling rice.";
  } else {
    answer = `Great cooking question! Always prep your ingredients before turning on the stove. You can substitute butter with oil, or cow milk with oat/almond milk in almost all simple recipes!`;
  }

  res.json({
    reply: answer,
    timestamp: new Date().toISOString()
  });
});

// ================= GUIDES, TOOLS & MEAL PLANS =================
app.get('/api/guides/basics', (req, res) => {
  const db = readDB();
  res.json(db.learnBasics);
});

app.get('/api/guides/ingredients', (req, res) => {
  const db = readDB();
  res.json(db.ingredientsGuide);
});

app.get('/api/guides/tools', (req, res) => {
  const db = readDB();
  res.json(db.kitchenTools);
});

app.get('/api/meal-plans', (req, res) => {
  const db = readDB();
  res.json(db.mealPlans);
});

app.get('/api/tips', (req, res) => {
  const db = readDB();
  res.json(db.tipsAndTricks);
});

// ================= SMART TOOLS API (SECTION 7 IN DIAGRAM) =================
app.get('/api/tools/shopping', (req, res) => {
  const db = readDB();
  res.json(db.shoppingList || []);
});

app.post('/api/tools/shopping', (req, res) => {
  const { item, quantity } = req.body;
  const db = readDB();
  const newItem = {
    id: 's_' + Date.now(),
    item,
    quantity: quantity || '1 unit',
    checked: false
  };
  db.shoppingList = db.shoppingList || [];
  db.shoppingList.unshift(newItem);
  writeDB(db);
  res.json(db.shoppingList);
});

app.get('/api/tools/pantry', (req, res) => {
  const db = readDB();
  res.json(db.pantryItems || []);
});

app.post('/api/tools/pantry', (req, res) => {
  const { name, category, status } = req.body;
  const db = readDB();
  const newItem = {
    id: 'p_' + Date.now(),
    name,
    category: category || 'Pantry',
    status: status || 'In Stock'
  };
  db.pantryItems = db.pantryItems || [];
  db.pantryItems.unshift(newItem);
  writeDB(db);
  res.json(db.pantryItems);
});

app.get('/api/tools/community', (req, res) => {
  const db = readDB();
  res.json(db.communityPosts || []);
});

app.post('/api/tools/community', (req, res) => {
  const { author, title, content } = req.body;
  const db = readDB();
  const newPost = {
    id: 'c_' + Date.now(),
    author: author || 'Cozy Chef',
    title,
    content,
    likes: 1,
    date: 'Just now'
  };
  db.communityPosts = db.communityPosts || [];
  db.communityPosts.unshift(newPost);
  writeDB(db);
  res.json(db.communityPosts);
});

// ================= FAVORITES, HISTORY & NOTES =================
app.get('/api/favorites', (req, res) => {
  const db = readDB();
  const favRecipes = db.recipes.filter(r => db.favorites.includes(r.id));
  res.json(favRecipes);
});

app.post('/api/favorites/toggle', (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).json({ error: 'recipeId required' });
  const db = readDB();

  const index = db.favorites.indexOf(recipeId);
  let isFav = false;
  if (index > -1) {
    db.favorites.splice(index, 1);
    isFav = false;
  } else {
    db.favorites.push(recipeId);
    isFav = true;
  }

  writeDB(db);
  res.json({ success: true, isFavorite: isFav, favorites: db.favorites });
});

app.get('/api/history', (req, res) => {
  const db = readDB();
  const fullHistory = db.history.map(item => {
    const recipe = db.recipes.find(r => r.id === item.recipeId);
    return { ...item, recipe };
  });
  res.json(fullHistory);
});

app.post('/api/history', (req, res) => {
  const { recipeId, rating, notes } = req.body;
  const db = readDB();
  const entry = {
    recipeId,
    rating: rating || 5,
    notes: notes || '',
    completedAt: new Date().toISOString()
  };
  db.history.unshift(entry);
  writeDB(db);
  res.json({ success: true, history: db.history });
});

// Serve static React build files
const clientBuildPath = path.join(process.cwd(), 'dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'), err => {
      if (err) {
        res.status(200).send("No Cook Helper API Server is running on port " + PORT + ".");
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 No Cook Helper Backend Server running at http://localhost:${PORT}`);
});
