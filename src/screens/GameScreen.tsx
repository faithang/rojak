import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Flashcard } from "../components/Flashcard";
import { GameButton } from "../components/GameButton";
import { StreakIndicator } from "../components/StreakIndicator";
import { SparkBurst } from "../components/Sparkles";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { X, Share2, Home, ChevronRight } from "lucide-react";
import {
  GameState,
  Card,
  handleCorrect,
  handleIncorrect,
  handleSkip,
  getCurrentCard,
  getRemainingCount,
  getAccuracy,
  getPatternString,
  shouldResetDeck,
  resetDeck,
  getCardsLeftInRound,
  shouldShowRoundComplete,
  startNextRound,
} from "../utils/gameLogic";

interface GameScreenProps {
  gameState: GameState;
  allCards: Card[];
  onUpdateGameState: (state: GameState) => void;
  onExit: () => void;
}

export function GameScreen({
  gameState,
  allCards,
  onUpdateGameState,
  onExit,
}: GameScreenProps) {
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResultsModal, setShowResultsModal] =
    useState(false);
  const [showRoundCompleteModal, setShowRoundCompleteModal] =
    useState(false);
  const [showDeckCompleteModal, setShowDeckCompleteModal] =
    useState(false);
  const [sparkBurst, setSparkBurst] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [cardExitDirection, setCardExitDirection] = useState<
    "left" | "right" | null
  >(null);
  const [showNewCycleMessage, setShowNewCycleMessage] =
    useState(false);
  const [skipCounterPulse, setSkipCounterPulse] =
    useState(false);
  const [isCurrentCardFlipped, setIsCurrentCardFlipped] =
    useState(false);
  const [hasCurrentCardBeenRevealed, setHasCurrentCardBeenRevealed] =
    useState(false);

  const currentCard = getCurrentCard(gameState);
  const remaining = getRemainingCount(gameState);
  const cardsLeftInRound = getCardsLeftInRound(gameState);
  const skipsRemaining = 3 - gameState.skipsUsed;

  useEffect(() => {
    if (shouldResetDeck(gameState)) {
      setTimeout(() => {
        setShowResultsModal(true);
      }, 500);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState.hasCompletedCycle && !showNewCycleMessage) {
      setShowNewCycleMessage(true);
      setTimeout(() => setShowNewCycleMessage(false), 3000);
    }
  }, [gameState.hasCompletedCycle]);

  // Reset flip state when card changes
  useEffect(() => {
    setIsCurrentCardFlipped(false);
    setHasCurrentCardBeenRevealed(false);
  }, [currentCard?.id]);

  const handleCardFlip = (flipped: boolean) => {
    setIsCurrentCardFlipped(flipped);
    // Mark card as revealed once flipped to back side
    if (flipped) {
      setHasCurrentCardBeenRevealed(true);
    }
  };

  const handleCardAction = (
    action: "correct" | "incorrect" | "skip",
  ) => {
    if (!currentCard) return;

    let newState = gameState;

    if (action === "correct") {
      setCardExitDirection("left");
      // Trigger spark burst at center of card
      setSparkBurst({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 100,
      });
      newState = handleCorrect(gameState, currentCard.id);
    } else if (action === "incorrect") {
      setCardExitDirection("left");
      newState = handleIncorrect(gameState, currentCard.id);
    } else if (action === "skip") {
      // Check if player has exceeded skip limit
      if (gameState.skipsUsed >= 3) {
        // End the game by showing results modal
        setTimeout(() => {
          setShowResultsModal(true);
        }, 100);
        return;
      }

      // Trigger skip counter pulse animation
      setSkipCounterPulse(true);
      setTimeout(() => setSkipCounterPulse(false), 600);

      setCardExitDirection("right");
      newState = handleSkip(gameState, currentCard.id);

      // Check if this was the last skip - if so, end the game after animation
      if (gameState.skipsUsed === 2) {
        // Will become 3 after this skip
        setTimeout(() => {
          setShowResultsModal(true);
        }, 800);
      }
    }

    setTimeout(() => {
      onUpdateGameState(newState);
      setCardExitDirection(null);
      setSparkBurst(null);

      // Check if round is complete after state update
      if (shouldShowRoundComplete(newState)) {
        // Check if deck is also complete
        if (getRemainingCount(newState) === 0) {
          setTimeout(() => setShowDeckCompleteModal(true), 500);
        } else {
          setTimeout(
            () => setShowRoundCompleteModal(true),
            500,
          );
        }
      }
    }, 400);
  };

  const handleShare = () => {
    const accuracy = getAccuracy(gameState);
    const pattern = getPatternString(gameState);
    const shareText = `Rojak Results 🥗✨\n${gameState.correctCards.size}/${gameState.correctCards.size + gameState.incorrectCards.size} correct • ${accuracy}% accuracy\n🔥 Longest streak: ${gameState.longestStreak}\n\nMy mix today:\n${pattern}\n\nTry beating my Rojak 😤\nrojak.app.tc1.airbase.sg`;

    // Create a temporary textarea for better clipboard support
    const textarea = document.createElement("textarea");
    textarea.value = shareText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      // Try the old execCommand method first (more reliable)
      const successful = document.execCommand("copy");
      if (successful) {
        alert("Copied to clipboard! 📋✨");
      } else {
        // Try the modern clipboard API
        if (
          navigator.clipboard &&
          navigator.clipboard.writeText
        ) {
          navigator.clipboard
            .writeText(shareText)
            .then(() => {
              alert("Copied to clipboard! 📋✨");
            })
            .catch(() => {
              alert(`Copy this text:\n\n${shareText}`);
            });
        } else {
          alert(`Copy this text:\n\n${shareText}`);
        }
      }
    } catch (err) {
      // Final fallback
      alert(`Copy this text:\n\n${shareText}`);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handlePlayAgain = () => {
    const newState = resetDeck(gameState, allCards);
    onUpdateGameState(newState);
    setShowResultsModal(false);
  };

  const handleEndGame = () => {
    onExit();
  };

  const handleContinueToNextRound = () => {
    const newState = startNextRound(gameState);
    onUpdateGameState(newState);
    setShowRoundCompleteModal(false);
  };

  const handleFinishSession = () => {
    setShowRoundCompleteModal(false);
    setShowResultsModal(true);
  };

  const handleStartNewCycle = () => {
    const newState = resetDeck(gameState, allCards);
    onUpdateGameState(newState);
    setShowDeckCompleteModal(false);
  };

  if (!currentCard && !showResultsModal) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col p-3 md:p-6 relative overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />

      {/* Spark burst effect */}
      {sparkBurst && (
        <SparkBurst
          x={sparkBurst.x}
          y={sparkBurst.y}
          onComplete={() => setSparkBurst(null)}
        />
      )}

      {/* New Cycle Message */}
      <AnimatePresence>
        {showNewCycleMessage && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
            initial={{ y: -100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.8 }}
          >
            <div
              className="px-8 py-4 rounded-2xl text-white text-xl"
              style={{
                background:
                  "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                boxShadow: "0 8px 32px rgba(245, 158, 11, 0.5)",
              }}
            >
              🎉 New Deck Cycle!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-1 md:mb-2">
          <button
            onClick={() => setShowExitModal(true)}
            className="text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all shadow-lg text-sm"
          >
            <X size={16} />
            <span>End</span>
          </button>

          <motion.div
            className="flex flex-col items-end gap-0.5"
            animate={
              skipCounterPulse
                ? {
                    scale: [1, 1.3, 1],
                    rotate: [0, -5, 5, 0],
                  }
                : {}
            }
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{
                background:
                  skipsRemaining === 0
                    ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                    : "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
              animate={
                skipCounterPulse
                  ? {
                      boxShadow: [
                        "0 4px 12px rgba(0,0,0,0.2)",
                        "0 8px 24px rgba(239, 68, 68, 0.6)",
                        "0 4px 12px rgba(0,0,0,0.2)",
                      ],
                    }
                  : {}
              }
            >
              <span className="text-base">⏭️</span>
              <span className="text-white text-sm">
                {skipsRemaining}/3
              </span>
            </motion.div>
            <div className="text-white/60 text-xs px-1">
              skips left
            </div>
          </motion.div>
        </div>

        {/* Remaining cards count */}
        <div className="text-center text-white/70 text-sm md:text-md mb-0.5">
          Round {gameState.currentRound} — {cardsLeftInRound}{" "}
          left
        </div>

        {/* Streak Indicator */}
        <div className="flex justify-center mb-1">
          <StreakIndicator streak={gameState.streak} />
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center mb-1 min-h-0">
          <AnimatePresence mode="wait">
            {currentCard && !cardExitDirection && (
              <motion.div
                key={currentCard.id}
                className="w-full max-w-[300px] md:max-w-sm aspect-[3/4]"
                initial={{
                  scale: 0.8,
                  opacity: 0,
                  rotateY: -20,
                }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{
                  x: cardExitDirection === "left" ? -400 : 400,
                  opacity: 0,
                  rotate:
                    cardExitDirection === "left" ? -20 : 20,
                  scale: 0.8,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                <Flashcard
                  front={currentCard.front}
                  back={currentCard.back}
                  showSparkles
                  isFlipped={isCurrentCardFlipped}
                  onFlip={handleCardFlip}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="px-3 md:px-6">
          <AnimatePresence mode="wait">
            {!hasCurrentCardBeenRevealed ? (
              // Pre-reveal state: Only Skip button (card hasn't been revealed yet)
              <motion.div
                key="skip-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-white/70 text-center text-sm md:text-md mb-2">
                  Make a guess in your head,<br/> or skip if you're totally stuck.
                </p>
                <div className="flex gap-2 md:gap-3">
                  <GameButton
                    type="skip"
                    onClick={() => handleCardAction("skip")}
                  />
                </div>
              </motion.div>
            ) : (
              // Post-reveal state: Only grading buttons (card has been revealed)
              <motion.div
                key="grading-buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-white/70 text-center text-sm md:text-md mb-2">
                  Compare with your guess. How did you do?
                </p>
                <div className="flex gap-2 md:gap-3">
                  <GameButton
                    type="incorrect"
                    onClick={() => handleCardAction("incorrect")}
                  />
                  <GameButton
                    type="correct"
                    onClick={() => handleCardAction("correct")}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Exit Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
      >
        <div className="text-center">
          <h2 className="text-3xl mb-6">Exit Game?</h2>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
            <div className="text-5xl mb-2">
              {gameState.correctCards.size}/
              {gameState.correctCards.size +
                gameState.incorrectCards.size}
            </div>
            <div className="text-gray-600 mb-4">
              Correct • {getAccuracy(gameState)}% accuracy
            </div>
            <div className="text-2xl">
              🔥 Longest streak: {gameState.longestStreak}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleShare}
              variant="primary"
              icon={<Share2 size={20} />}
              fullWidth
            >
              Share Results
            </Button>
            <Button
              onClick={handleEndGame}
              variant="danger"
              fullWidth
            >
              End Game
            </Button>
            <Button
              onClick={() => setShowExitModal(false)}
              variant="outline"
              fullWidth
            >
              Keep Playing
            </Button>
          </div>
        </div>
      </Modal>

      {/* Results Modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => {}}
        showClose={false}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl mb-6">Amazing!</h2>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-6xl mb-2">
              {gameState.correctCards.size}/
              {gameState.correctCards.size +
                gameState.incorrectCards.size}
            </div>
            <div className="text-gray-600 text-xl mb-4">
              {getAccuracy(gameState)}% accuracy
            </div>
            <div className="text-3xl">
              🔥 Longest streak: {gameState.longestStreak}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleShare}
              variant="primary"
              icon={<Share2 size={20} />}
              fullWidth
            >
              Share Results
            </Button>
            <Button
              onClick={handlePlayAgain}
              variant="secondary"
              fullWidth
              borderColor="#8B5CF6"
            >
              Play Again
            </Button>
            <Button
              onClick={onExit}
              variant="outline"
              icon={<Home size={20} />}
              fullWidth
            >
              Return Home
            </Button>
          </motion.div>
        </div>
      </Modal>

      {/* Round Complete Modal */}
      <Modal
        isOpen={showRoundCompleteModal}
        onClose={() => {}}
        showClose={false}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-4xl mb-4">
              Round {gameState.currentRound} complete!
            </h2>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-gray-600 mb-3">
              <div className="text-2xl mb-2">
                Cards completed:{" "}
                {gameState.cardsAttemptedInRound}
              </div>
              <div className="text-xl mb-2">
                Running accuracy: {getAccuracy(gameState)}%
              </div>
              <div className="text-xl">
                🔥 Current streak: {gameState.streak}
              </div>
            </div>
          </motion.div>

          <p className="text-gray-600 mb-6">
            Nice work — want to keep going?
          </p>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleContinueToNextRound}
              variant="primary"
              icon={<ChevronRight size={20} />}
              fullWidth
            >
              Continue to Next Round
            </Button>
            <Button
              onClick={handleFinishSession}
              variant="secondary"
              fullWidth
            >
              Finish Session & View Results
            </Button>
          </motion.div>
        </div>
      </Modal>

      {/* Deck Complete Modal */}
      <Modal
        isOpen={showDeckCompleteModal}
        onClose={() => {}}
        showClose={false}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl mb-4">
              You&apos;ve completed the deck!
            </h2>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-gray-600 mb-3">
              <div className="text-2xl mb-2">
                Total cards:{" "}
                {gameState.correctCards.size +
                  gameState.incorrectCards.size}
              </div>
              <div className="text-xl mb-2">
                Final accuracy: {getAccuracy(gameState)}%
              </div>
              <div className="text-xl">
                🔥 Longest streak: {gameState.longestStreak}
              </div>
            </div>
          </motion.div>

          <p className="text-gray-600 mb-6">
            Fresh deck coming right up.
          </p>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleStartNewCycle}
              variant="primary"
              icon={<ChevronRight size={20} />}
              fullWidth
            >
              Start a New Cycle
            </Button>
            <Button
              onClick={onExit}
              variant="outline"
              icon={<Home size={20} />}
              fullWidth
            >
              Return Home
            </Button>
          </motion.div>
        </div>
      </Modal>
    </div>
  );
}