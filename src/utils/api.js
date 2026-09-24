const API_BASE = '/api';

export async function fetchRecipes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/recipes?${query}`);
  return res.json();
}

export async function fetchRecipeById(id) {
  const res = await fetch(`${API_BASE}/recipes/${id}`);
  return res.json();
}

export async function recommendRecipes(ingredients) {
  const res = await fetch(`${API_BASE}/recipes/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients })
  });
  return res.json();
}

export async function sendAIChat(message) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return res.json();
}

export async function fetchLearnBasics() {
  const res = await fetch(`${API_BASE}/guides/basics`);
  return res.json();
}

export async function fetchIngredientsGuide() {
  const res = await fetch(`${API_BASE}/guides/ingredients`);
  return res.json();
}

export async function fetchKitchenTools() {
  const res = await fetch(`${API_BASE}/guides/tools`);
  return res.json();
}

export async function fetchMealPlans() {
  const res = await fetch(`${API_BASE}/meal-plans`);
  return res.json();
}

export async function fetchTips() {
  const res = await fetch(`${API_BASE}/tips`);
  return res.json();
}

export async function fetchFavorites() {
  const res = await fetch(`${API_BASE}/favorites`);
  return res.json();
}

export async function toggleFavorite(recipeId) {
  const res = await fetch(`${API_BASE}/favorites/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeId })
  });
  return res.json();
}

export async function fetchCookHistory() {
  const res = await fetch(`${API_BASE}/history`);
  return res.json();
}

export async function saveCookHistory(recipeId, rating, notes) {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeId, rating, notes })
  });
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function registerUser(name, email, password, dietPreference) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, dietPreference })
  });
  return res.json();
}
