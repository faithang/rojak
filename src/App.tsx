import { useState, useEffect } from 'react';
import { LandingScreen } from './screens/LandingScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { GameScreen } from './screens/GameScreen';
import { parseCSV, initializeGame, GameState, Card } from './utils/gameLogic';
import { cardsData } from './data/cardsData';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './components/Button';
import { Sparkles } from 'lucide-react';

type Screen = 'landing' | 'howToPlay' | 'tutorial' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStartingGamePopup, setShowStartingGamePopup] = useState(false);

  useEffect(() => {
    // Parse CSV data
    console.log('Parsing CSV data...');
    const cards = parseCSV(cardsData);
    console.log('Parsed cards:', cards.length);
    setAllCards(cards);
    setIsLoading(false);
  }, []);

  const startNewGame = () => {
    console.log('Starting new game with', allCards.length, 'cards');
    if (allCards.length === 0) {
      console.error('Cannot start game: no cards loaded');
      return;
    }
    
    const newGameState = initializeGame(allCards);
    console.log('Game state initialized:', newGameState);
    setGameState(newGameState);
    
    if (!hasSeenTutorial) {
      setCurrentScreen('tutorial');
    } else {
      setCurrentScreen('game');
    }
  };

  const handleTutorialComplete = () => {
    setHasSeenTutorial(true);
    setCurrentScreen('game');
  };

  const handleTutorialSkip = () => {
    setHasSeenTutorial(true);
    setShowStartingGamePopup(true);
  };

  const handleStartGame = () => {
    setShowStartingGamePopup(false);
    setCurrentScreen('game');
  };

  const handleExitGame = () => {
    setCurrentScreen('landing');
    setGameState(null);
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && (
        <LandingScreen
          onStartGame={startNewGame}
          onHowToPlay={() => setCurrentScreen('howToPlay')}
        />
      )}

      {currentScreen === 'howToPlay' && (
        <HowToPlayScreen
          onBack={() => setCurrentScreen('landing')}
          onTryTutorial={() => {
            if (allCards.length === 0) {
              console.error('Cannot start game: no cards loaded');
              return;
            }
            const newGameState = initializeGame(allCards);
            setGameState(newGameState);
            setCurrentScreen('tutorial'); // Always show tutorial when clicked from How to Play
          }}
        />
      )}

      {currentScreen === 'tutorial' && (
        <TutorialScreen onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />
      )}

      {currentScreen === 'game' && gameState && (
        <GameScreen
          gameState={gameState}
          allCards={allCards}
          onUpdateGameState={setGameState}
          onExit={handleExitGame}
        />
      )}

      {showStartingGamePopup && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-sm text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-4xl mb-4">
                Ready to play?
              </h2>
              <p className="text-gray-600 mb-6">
                You'll play in rounds of 10 cards. Remember: flip to reveal, then grade yourself honestly! ✨
              </p>
              <Button
                onClick={handleStartGame}
                variant="primary"
                icon={<Sparkles size={20} />}
                fullWidth
              >
                Start Game
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}