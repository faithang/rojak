import { motion } from 'motion/react';
import { Check, X, SkipForward } from 'lucide-react';

interface GameButtonProps {
  type: 'correct' | 'incorrect' | 'skip';
  onClick: () => void;
  disabled?: boolean;
}

export function GameButton({ type, onClick, disabled = false }: GameButtonProps) {
  const configs = {
    correct: {
      icon: <Check size={28} />,
      label: 'I got it right',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      shadow: 'rgba(16, 185, 129, 0.4)',
      disabledGradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
      disabledShadow: 'rgba(156, 163, 175, 0.2)'
    },
    incorrect: {
      icon: <X size={28} />,
      label: 'I got it wrong',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      shadow: 'rgba(239, 68, 68, 0.4)',
      disabledGradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
      disabledShadow: 'rgba(156, 163, 175, 0.2)'
    },
    skip: {
      icon: <SkipForward size={24} />,
      label: 'Skip',
      gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
      shadow: 'rgba(107, 114, 128, 0.4)',
      disabledGradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
      disabledShadow: 'rgba(156, 163, 175, 0.2)'
    }
  };

  const config = configs[type];

  return (
    <motion.button
      className="flex-1 py-5 rounded-2xl text-white flex flex-col items-center justify-center gap-2"
      style={{
        background: disabled ? config.disabledGradient : config.gradient,
        boxShadow: disabled ? `0 8px 24px ${config.disabledShadow}` : `0 8px 24px ${config.shadow}`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <motion.div
        whileTap={{ rotate: type === 'correct' ? 360 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {config.icon}
      </motion.div>
      <span className="text-sm">{config.label}</span>
    </motion.button>
  );
}