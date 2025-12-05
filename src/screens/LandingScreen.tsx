import { motion } from "motion/react";
import { AppIcon } from "../components/AppIcon";
import { Button } from "../components/Button";
import { Sparkles } from "../components/Sparkles";
import { HelpCircle, Play } from "lucide-react";

interface LandingScreenProps {
  onStartGame: () => void;
  onHowToPlay: () => void;
}

export function LandingScreen({
  onStartGame,
  onHowToPlay,
}: LandingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Sparkles count={30} />

      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        }}
      />

      <motion.div
        className="text-center w-full max-w-[90%] md:max-w-none mx-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        <motion.div
          className="mb-4 flex justify-center"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <AppIcon size={140} />
        </motion.div>

        <motion.h1
          className="text-white text-4xl md:text-6xl mb-2 flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Rojak
        </motion.h1>

        <motion.p
          className="text-white/80 text-xl mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The Singaporean word fusion game ✨
        </motion.p>

        <motion.div
          className="flex flex-col gap-4 w-full max-w-sm mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onStartGame}
            variant="primary"
            icon={<Play size={20} />}
            fullWidth
          >
            Start Game
          </Button>
          <Button
            onClick={onHowToPlay}
            variant="secondary-light"
            icon={<HelpCircle size={20} />}
            fullWidth
          >
            How to Play
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}