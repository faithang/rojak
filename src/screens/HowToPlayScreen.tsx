import { motion } from "motion/react";
import { Button } from "../components/Button";
import {
  ArrowLeft,
  Sparkles as SparklesIcon,
} from "lucide-react";

interface HowToPlayScreenProps {
  onBack: () => void;
  onTryTutorial: () => void;
}

export function HowToPlayScreen({
  onBack,
  onTryTutorial,
}: HowToPlayScreenProps) {
  return (
    <div className="min-h-[100dvh] p-6 relative overflow-auto">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          minHeight: '100dvh'
        }}
      />

      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white mb-8 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-white text-5xl mb-6">
            How to Play
          </h1>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <h2 className="text-white text-2xl mb-4">
              What's Rojak?
            </h2>
            <p className="text-white/90 mb-4">
              Rojak is a word fusion game. 
              Every puzzle consists of two clues separated by a (+) sign. Each clue has its own answer, and the two answers share at least one syllable.  
              Crack both answers, then smash them together into one final combined answer.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <h2 className="text-white text-2xl mb-4">
              Example
            </h2>
            <div className="bg-purple-900/40 rounded-xl p-4 mb-3">
              <div className="text-white/60 text-sm mb-1">
                Clue:
              </div>
              <div className="text-white text-xl">
                Halloween greeting + Agreement that ended World
                War II
              </div>
            </div>
            <div className="flex items-center justify-center mb-3">
              <div className="text-4xl">👇</div>
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                background:
                  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              }}
            >
              <div className="text-white/70 text-sm mb-1">
                Answer:
              </div>
              <div className="text-white text-3xl">
                Trick or Treaty of Versailles
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6">
            <h2 className="text-white text-2xl mb-4">
              Gameplay
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-white bg-white/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="text-white mb-1">
                    Read the clue and make your guess
                  </div>
                  <div className="text-white/70 text-sm">
                    Think of your answer in your head. Don't
                    know it? You can skip before revealing.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-white bg-white/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="text-white mb-1">
                    Tap the card to flip it
                  </div>
                  <div className="text-white/70 text-sm">
                    See the real answer revealed.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-white bg-white/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="text-white mb-1">
                    Grade yourself honestly
                  </div>
                  <div className="text-white/70 text-sm">
                    Did your guess match? Tap "I got it right"
                    or "I got it wrong" to move on.
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/80 text-sm">
                💡 You can only skip before you reveal the
                answer. Once you tap to reveal, Skip disappears
                and you'll need to grade yourself honestly. This
                game runs on honesty scoring. 💯
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/80 text-sm">
                🎴 Cards are grouped into small rounds of 10, so
                gameplay stays easy to pick up. When a round
                ends, you'll see a quick summary and can choose
                to continue or stop.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8">
            <h2 className="text-white text-2xl mb-4">
              Extra Tips
            </h2>
            <ul className="text-white/90 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⏭️</span>
                <span>
                  Skip tough ones – they'll come back later (3
                  skips max)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔥</span>
                <span>
                  Get 3+ correct in a row for a fire streak!
                </span>
              </li>
            </ul>
          </div>

          <Button
            onClick={onTryTutorial}
            variant="primary"
            icon={<SparklesIcon size={20} />}
            fullWidth
          >
            Try the Tutorial
          </Button>
        </motion.div>
      </div>
    </div>
  );
}