import { motion } from 'motion/react';
import { useState } from 'react';

interface FlashcardProps {
  front: string;
  back: string;
  onFlip?: (isFlipped: boolean) => void;
  autoFlip?: boolean;
  showSparkles?: boolean;
  isFlipped?: boolean; // Add controlled state prop
}

export function Flashcard({ front, back, onFlip, autoFlip = true, showSparkles = false, isFlipped: controlledFlipped }: FlashcardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const handleClick = () => {
    if (!autoFlip) return;
    const newFlipped = !isFlipped;
    
    // Only update internal state if not controlled
    if (controlledFlipped === undefined) {
      setInternalFlipped(newFlipped);
    }
    
    onFlip?.(newFlipped);
  };

  return (
    <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 100,
          damping: 15
        }}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Front */}
        <motion.div
          className="absolute inset-0 rounded-3xl p-8 flex items-center justify-center text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            minHeight: '100%'
          }}
        >
          <div className="w-full">
            <div className="text-white/60 mb-2">Combine these:</div>
            <div className="text-white text-3xl leading-tight">{front}</div>
            <div className="text-white/40 mt-6 text-sm">Tap to reveal</div>
          </div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 rounded-3xl p-8 flex items-center justify-center text-center relative overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            rotateY: 180,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            minHeight: '100%'
          }}
        >
          {showSparkles && (
            <>
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 20 20">
                    <path
                      d="M10 0 L11 9 L20 10 L11 11 L10 20 L9 11 L0 10 L9 9 Z"
                      fill="#FFD700"
                    />
                  </svg>
                </motion.div>
              ))}
            </>
          )}
          <div className="relative z-10 w-full">
            <div className="text-white/70 mb-2">The answer is:</div>
            <motion.div
              className="text-white text-3xl leading-tight"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {back}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}