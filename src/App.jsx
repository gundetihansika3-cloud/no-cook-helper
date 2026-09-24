import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import LearnBasicsPage from './pages/LearnBasicsPage';
import IngredientsGuidePage from './pages/IngredientsGuidePage';
import KitchenToolsPage from './pages/KitchenToolsPage';
import MealPlansPage from './pages/MealPlansPage';
import TipsTricksPage from './pages/TipsTricksPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SmartToolsPage from './pages/SmartToolsPage';
import StepByStepCookModal from './components/StepByStepCookModal';
import AIAssistantModal from './components/AIAssistantModal';
import { fetchRecipes, toggleFavorite, fetchFavorites, saveCookHistory } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState({ name: 'Cozy Family Chef', email: 'demo@nocook.com', dietPreference: 'High Protein' });
  const [currentLang, setCurrentLang] = useState('en');

  // Selected recipe for detail view or step cooking
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [cookingRecipe, setCookingRecipe] = useState(null);

  // Modals
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchRecipes().then(data => setRecipes(data)).catch(err => console.error(err));
    fetchFavorites().then(data => setFavorites(data.map(r => r.id))).catch(err => console.error(err));
  }, []);

  const handleToggleFavorite = async (recipeId) => {
    try {
      const res = await toggleFavorite(recipeId);
      if (res.favorites) setFavorites(res.favorites);
    } catch (err) {
      if (favorites.includes(recipeId)) {
        setFavorites(favorites.filter(id => id !== recipeId));
      } else {
        setFavorites([...favorites, recipeId]);
      }
    }
  };

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  const handleStartCooking = (recipe) => {
    setCookingRecipe(recipe);
  };

  const handleFinishCooking = async (recipeId, rating, notes) => {
    try {
      await saveCookHistory(recipeId, rating, notes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setActiveTab('recipe-detail');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab}
        setActiveTab={(tab) => { setSelectedRecipe(null); setActiveTab(tab); }}
        user={user}
        onOpenAI={() => setShowAIAssistant(true)}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      <main className="app-container" style={{ flexGrow: 1 }}>
        {activeTab === 'home' && (
          <HomePage 
            recipes={recipes}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onStartCooking={handleStartCooking}
            onViewDetails={handleViewDetails}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesPage 
            recipes={recipes}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onStartCooking={handleStartCooking}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeTab === 'recipe-detail' && selectedRecipe && (
          <RecipeDetailPage 
            recipe={selectedRecipe}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onStartCooking={handleStartCooking}
            onBack={() => setActiveTab('recipes')}
          />
        )}

        {activeTab === 'smart-tools' && <SmartToolsPage />}
        {activeTab === 'learn' && <LearnBasicsPage />}
        {activeTab === 'ingredients' && <IngredientsGuidePage />}
        {activeTab === 'tools' && <KitchenToolsPage />}
        {activeTab === 'mealplans' && <MealPlansPage recipes={recipes} />}
        {activeTab === 'tips' && <TipsTricksPage />}

        {activeTab === 'favorites' && (
          <FavoritesPage 
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onStartCooking={handleStartCooking}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage 
            user={user}
            onLogout={() => setUser(null)}
            onOpenLogin={() => setShowLoginModal(true)}
          />
        )}
      </main>

      <Footer setActiveTab={(tab) => { setSelectedRecipe(null); setActiveTab(tab); }} />

      {/* Visual & Voice Step-by-Step Cooking Modal */}
      {cookingRecipe && (
        <StepByStepCookModal 
          recipe={cookingRecipe}
          onClose={() => setCookingRecipe(null)}
          onFinishCook={handleFinishCooking}
        />
      )}

      {/* Cozy AI Voice Assistant Modal */}
      {showAIAssistant && (
        <AIAssistantModal 
          onClose={() => setShowAIAssistant(false)}
        />
      )}

      {/* Login / Register Modal */}
      {showLoginModal && (
        <LoginPage 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(loggedUser) => setUser(loggedUser)}
        />
      )}
    </div>
  );
}
