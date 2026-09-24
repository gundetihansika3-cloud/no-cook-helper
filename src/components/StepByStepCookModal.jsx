import React, { useState, useEffect, useRef } from 'react';

export default function StepByStepCookModal({ recipe, onClose, onFinishCook }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerLeft, setTimerLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [userRating, setUserRating] = useState(5);
  const [userNote, setUserNote] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [autoVoiceGuide, setAutoVoiceGuide] = useState(true);

  const videoRef = useRef(null);

  const steps = recipe.steps || [];
  const currentStep = steps[currentStepIndex] || {};

  // Hands-free Voice Guided Steps (Text-to-Speech)
  const speakStepText = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (currentStep.title && autoVoiceGuide) {
      speakStepText(`Step ${currentStepIndex + 1}: ${currentStep.title}. ${currentStep.description}`);
    }
  }, [currentStepIndex, recipe, autoVoiceGuide]);

  // Handle Step Timer
  useEffect(() => {
    if (currentStep.timerSeconds) {
      setTimerLeft(currentStep.timerSeconds);
      setTimerRunning(false);
    } else {
      setTimerLeft(0);
      setTimerRunning(false);
    }
  }, [currentStepIndex, recipe]);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft(prev => prev - 1);
      }, 1000);
    } else if (timerLeft === 0 && timerRunning) {
      setTimerRunning(false);
      speakStepText("Timer finished!");
      if (typeof window !== 'undefined' && window.navigator?.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerLeft]);

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      speakStepText(`Congratulations! You have completed cooking ${recipe.title}!`);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleCompleteSubmit = () => {
    onFinishCook(recipe.id, userRating, userNote);
    onClose();
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-veg" style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                🎥 Visual & Voice Guided Mode
              </span>
              <button 
                className="badge" 
                style={{ background: autoVoiceGuide ? 'rgba(129, 178, 154, 0.25)' : 'rgba(0,0,0,0.06)', color: autoVoiceGuide ? '#2b7a58' : 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setAutoVoiceGuide(!autoVoiceGuide)}
              >
                {autoVoiceGuide ? '🎙️ Voice Guide ON' : '🔇 Voice Guide Off'}
              </button>
            </div>
            <h2 style={{ fontSize: '1.35rem', marginTop: '0.2rem' }}>{recipe.title}</h2>
          </div>
          <button className="btn-secondary" style={{ padding: '0.3rem 0.75rem', borderRadius: '50%' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {!isCompleted ? (
          <div>
            {/* Step Progress Bar */}
            <div style={{ background: 'var(--accent-cream)', borderRadius: '99px', height: '8px', marginBottom: '1.25rem', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`, 
                  height: '100%', 
                  background: 'var(--primary)',
                  transition: 'width 0.3s ease' 
                }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-time" style={{ fontSize: '0.85rem' }}>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => speakStepText(`Step ${currentStepIndex + 1}: ${currentStep.title}. ${currentStep.description}`)}
              >
                🔊 Read Out Loud
              </button>
            </div>

            {/* Step Content: Video Player & Instructions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                {/* Step Demonstration Video Player */}
                <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#000' }}>
                  <video 
                    ref={videoRef}
                    src={currentStep.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                    poster={currentStep.image || recipe.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.65)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-pill)', backdropFilter: 'blur(8px)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      🎬 AI Step Video Demo
                    </span>
                    <button onClick={toggleVideoPlay} style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>
                      {isVideoPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                  </div>
                </div>

                {/* Step Timer */}
                {currentStep.timerSeconds > 0 && (
                  <div className="timer-box" style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ Recommended Timer</div>
                    <div className="timer-display">{formatTime(timerLeft)}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.35rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => setTimerRunning(!timerRunning)}
                      >
                        {timerRunning ? '⏸️ Pause' : '▶️ Start Timer'}
                      </button>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
                        onClick={() => { setTimerLeft(currentStep.timerSeconds); setTimerRunning(false); }}
                      >
                        🔄 Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  {currentStep.title}
                </h3>
                <p style={{ fontSize: '0.98rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-main)' }}>
                  {currentStep.description}
                </p>

                {/* Beginner Tip Alert */}
                {currentStep.tip && (
                  <div style={{ background: 'rgba(217, 119, 6, 0.1)', borderLeft: '4px solid #d97706', padding: '0.85rem 1rem', borderRadius: '8px', margin: '1rem 0' }}>
                    <div style={{ fontWeight: '700', color: '#d97706', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                      💡 Beginner Tip (Easy Phrasing)
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{currentStep.tip}</div>
                  </div>
                )}

                {/* Tools Needed Display */}
                {recipe.toolsNeeded && (
                  <div style={{ margin: '0.85rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    🛠️ <strong>Tools Needed:</strong> {recipe.toolsNeeded.join(', ')}
                  </div>
                )}

                {/* Safety Warning */}
                {currentStepIndex === 0 && recipe.safetyTips && recipe.safetyTips.length > 0 && (
                  <div style={{ background: 'rgba(230, 57, 70, 0.1)', borderLeft: '4px solid #e63946', padding: '0.85rem 1rem', borderRadius: '8px', margin: '1rem 0' }}>
                    <div style={{ fontWeight: '700', color: '#e63946', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                      ⚠️ Kitchen Safety Note
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                      {recipe.safetyTips.map((st, i) => <li key={i}>{st}</li>)}
                    </ul>
                  </div>
                )}

                {/* Ingredients Check-list on Step 1 */}
                {currentStepIndex === 0 && (
                  <div style={{ background: 'var(--accent-cream)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>🥦 Ingredients Checklist:</div>
                    {recipe.ingredients.map((ing, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                        <input 
                          type="checkbox" 
                          checked={!!checkedIngredients[idx]} 
                          onChange={() => toggleIngredientCheck(idx)}
                        />
                        <span style={{ textDecoration: checkedIngredients[idx] ? 'line-through' : 'none', color: checkedIngredients[idx] ? 'var(--text-muted)' : 'var(--text-main)' }}>
                          <strong>{ing.quantity}</strong> {ing.name}
                        </span>
                        {ing.substitute && <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}> (Or: {ing.substitute})</span>}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '1rem' }}>
              <button 
                className="btn-secondary" 
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                style={{ opacity: currentStepIndex === 0 ? 0.5 : 1 }}
              >
                ⬅️ Previous Step
              </button>

              <button className="btn-primary" onClick={handleNextStep}>
                {currentStepIndex === steps.length - 1 ? 'Finish & Save 🎉' : 'Next Step ➡️'}
              </button>
            </div>
          </div>
        ) : (
          /* Completion Celebration Screen */
          <div style={{ textAlignment: 'center', padding: '2rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉 🍳</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Awesome! You Prepared {recipe.title}!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You've completed every step with AI video & voice guidance. Rate your preparation below:
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Rating:</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '1.8rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} onClick={() => setUserRating(star)}>
                    {star <= userRating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
              <textarea 
                className="glass-panel" 
                placeholder="Add a private note (e.g. Turned out warm & delicious!)..." 
                rows="3"
                value={userNote}
                onChange={e => setUserNote(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            <button className="btn-primary" style={{ padding: '0.75rem 2rem' }} onClick={handleCompleteSubmit}>
              Save to History & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
