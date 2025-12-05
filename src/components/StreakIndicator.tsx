import { motion } from 'motion/react';

interface StreakIndicatorProps {
  streak: number;
}

export function StreakIndicator({ streak }: StreakIndicatorProps) {
  if (streak < 3) return null;

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
      style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)'
      }}
      initial={{ scale: 0, y: -20 }}
      animate={{ 
        scale: 1, 
        y: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 15
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 0.4
        }}
      >
        🔥
      </motion.div>
      <motion.span 
        className="text-white"
        key={streak}
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        {streak} streak!
      </motion.span>
    </motion.div>
  );
}
