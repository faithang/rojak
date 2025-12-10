import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Flashcard } from "../components/Flashcard";
import { Button } from "../components/Button";
import { GameButton } from "../components/GameButton";
import { ChevronRight } from "lucide-react";

interface TutorialScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tutorialCards = [
  {
    front:
      "Every kid's favourite fast-food chain + US president",
    back: "McDonald Trump",
  },
  {
    front:
      "Leader of the Opposition + Country that Americans think is in China",
    back: "Pritam Singhapore",
  },
  {
    front:
    "What PAP is accused of every election to disadvantage the opposition + A fungal infection",
    back: "Gerrymande-ringworm",
  }
];

export function TutorialScreen({
  onComplete,
  onSkip,
}: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [readyMessage, setReadyMessage] = useState(false);
  const [showGuessConfirmation, setShowGuessConfirmation] =
    useState(false);
  const [
    hasShownGuessConfirmation,
    setHasShownGuessConfirmation,
  ] = useState(false);

  const currentCard = tutorialCards[currentStep];

  const handleFlip = (flipped: boolean) => {
    setHasFlipped(flipped);

    // For Step 2, we need to confirm the user has guessed first (only once)
    if (
      currentStep === 1 &&
      flipped &&
      !hasBeenRevealed &&
      !hasShownGuessConfirmation
    ) {
      setShowGuessConfirmation(true);
      setHasShownGuessConfirmation(true);
      return;
    }

    // Mark as revealed once flipped to back
    if (flipped) {
      setHasBeenRevealed(true);
    }
  };

  const handleConfirmGuess = () => {
    setShowGuessConfirmation(false);
    setHasFlipped(true);
    setHasBeenRevealed(true);
  };

  const handleGoBackToGuess = () => {
    setShowGuessConfirmation(false);
    setHasFlipped(false); // Flip card back to front to show clue again
  };

  const handleStep1Next = () => {
    setCurrentStep(1);
    setHasFlipped(false);
    setHasBeenRevealed(false);
  };

  const handleStep2Grade = () => {
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
      setCurrentStep(2);
      setHasFlipped(false);
      setHasBeenRevealed(false);
    }, 2000);
  };

  const handleStep3Grade = () => {
    setReadyMessage(true);
  };

  const getMicrocopy = () => {
    if (currentStep === 0) {
      return hasFlipped
        ? "This is the real answer. During the game, you'll grade yourself honestly."
        : "Read the clue, then tap to reveal the answer.";
    }
    if (currentStep === 1) {
      return hasFlipped
        ? "Now practice grading yourself:"
        : "Make a guess first, then flip the card to check your answer.";
    }
    if (currentStep === 2) {
      return hasFlipped
        ? "Almost there! Grade yourself:"
        : "One more practice round!";
    }
    return "";
  };

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

      {/* Tooltip for Step 2 */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="bg-white rounded-2xl px-6 py-4 shadow-xl max-w-xs text-center">
              <p className="text-gray-800">
                Perfect! This is how you'll self-grade during
                gameplay. ✨
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ready Message for Step 3 */}
      <AnimatePresence>
        {readyMessage && (
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
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl mb-4">Ready to play?</h2>
              <p className="text-gray-600 mb-2">
                In the real game, you'll play in short rounds of
                10 cards at a time. Have fun! ✨
              </p>
              <Button
                onClick={onComplete}
                variant="primary"
                icon={<ChevronRight size={20} />}
                fullWidth
              >
                Start Game
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex gap-2 mb-1">
          {tutorialCards.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 rounded-full transition-all"
              style={{
                background:
                  index <= currentStep
                    ? "#fff"
                    : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        <motion.div
          key={`header-${currentStep}`}
          className="text-white text-center mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl md:text-xl mb-0.5">
            {currentStep === 0 &&
              "Step 1: Understanding the mechanic"}
            {currentStep === 1 && "Step 2: Guided practice"}
            {currentStep === 2 && "Step 3: Full practice round"}
          </h2>
          <p className="text-white/80 text-sm md:text-md">
            {getMicrocopy()}
          </p>
        </motion.div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center mb-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="w-full max-w-[300px] md:max-w-sm aspect-[3/4]"
              initial={{ x: 300, opacity: 0, rotateY: -20 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: -300, opacity: 0, rotateY: 20 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <Flashcard
                front={currentCard.front}
                back={currentCard.back}
                onFlip={handleFlip}
                showSparkles={hasFlipped}
                isFlipped={hasFlipped}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="px-3 md:px-6">
          {/* Step 1: Next button after flip only */}
          {currentStep === 0 && !hasFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <button
                onClick={onSkip}
                className="text-white/70 hover:text-white text-sm underline transition-colors w-full py-1"
              >
                Skip Tutorial
              </button>
            </motion.div>
          )}

          {currentStep === 0 && hasFlipped && (
            <motion.div
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-white/80 text-sm md:text-md">
                Got it? Let&apos;s practice again!
              </p>
              <Button
                onClick={handleStep1Next}
                variant="primary"
                icon={<ChevronRight size={20} />}
                fullWidth
              >
                Next
              </Button>
            </motion.div>
          )}

          {/* Step 2: Just tap to flip, then grade buttons */}
          {currentStep === 1 && !hasFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-1"
            >
              <p className="text-white/70 text-sm md:text-md">
                Tap the card to see the answer.
              </p>
              <button
                onClick={onSkip}
                className="text-white/70 hover:text-white text-sm underline transition-colors w-full py-1"
              >
                Skip Tutorial
              </button>
            </motion.div>
          )}

          {currentStep === 1 && hasFlipped && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-white/70 text-center text-sm md:text-md">
                Compare with your guess. How did you do?
              </p>
              <div className="flex gap-2 md:gap-3">
                <GameButton
                  type="incorrect"
                  onClick={handleStep2Grade}
                />
                <GameButton
                  type="correct"
                  onClick={handleStep2Grade}
                />
              </div>
              <button
                onClick={onSkip}
                className="text-white/70 hover:text-white text-sm underline transition-colors w-full py-1"
              >
                Skip Tutorial
              </button>
            </motion.div>
          )}

          {/* Step 3: Full game flow with disabled skip before flip, grade buttons after */}
          {currentStep === 2 && !hasFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <p className="text-white/70 text-center text-sm md:text-md">
                In the real game, you can skip here.<br/> 
                (Disabled for tutorial practice.)
              </p>
              <div className="flex gap-2 md:gap-3">
                <GameButton
                  type="skip"
                  onClick={() => {}}
                  disabled={true}
                />
              </div>
              <button
                onClick={onSkip}
                className="text-white/70 hover:text-white text-sm underline transition-colors w-full py-1"
              >
                Skip Tutorial
              </button>
            </motion.div>
          )}

          {currentStep === 2 && hasFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <p className="text-white/70 text-center text-sm md:text-md">
                Compare with your guess. How did you do?
              </p>
              <div className="flex gap-2 md:gap-3">
                <GameButton
                  type="incorrect"
                  onClick={handleStep3Grade}
                />
                <GameButton
                  type="correct"
                  onClick={handleStep3Grade}
                />
              </div>
              <button
                onClick={onSkip}
                className="text-white/70 hover:text-white text-sm underline transition-colors w-full py-1"
              >
                Skip Tutorial
              </button>
            </motion.div>
          )}
        </div>

        {/* Guess Confirmation for Step 2 */}
        <AnimatePresence>
          {showGuessConfirmation && (
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
                <div className="text-5xl mb-4">🤔</div>
                <h2 className="text-3xl mb-4">
                  Have you made your guess?
                </h2>
                <p className="text-gray-600 mb-6">
                  Always try guessing before you flip the card.
                  Keep your answer in mind — you’ll check it
                  right after.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleConfirmGuess}
                    variant="primary"
                    fullWidth
                  >
                    Yes, reveal the answer!
                  </Button>
                  <Button
                    onClick={handleGoBackToGuess}
                    variant="secondary"
                    fullWidth
                  >
                    No, let me guess first
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}