import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'neutral' | 'secondary' | 'secondary-light' | 'outline';
  icon?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  borderColor?: string;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon,
  disabled = false,
  fullWidth = false,
  borderColor
}: ButtonProps) {
  const variants = {
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    neutral: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
    secondary: 'transparent',
    'secondary-light': 'transparent',
    outline: 'white'
  };

  const textColors = {
    primary: 'text-white',
    success: 'text-white',
    danger: 'text-white',
    neutral: 'text-gray-800',
    secondary: 'text-purple-600',
    'secondary-light': 'text-white',
    outline: 'text-gray-800'
  };

  const getBorderStyle = () => {
    if (borderColor) return `2px solid ${borderColor}`;
    if (variant === 'secondary') return '2px solid #8B5CF6';
    if (variant === 'secondary-light') return '2px solid rgba(255, 255, 255, 0.4)';
    if (variant === 'outline') return '2px solid rgba(0,0,0,0.2)';
    return 'none';
  };

  const getBoxShadow = () => {
    if (variant === 'secondary' || variant === 'secondary-light' || variant === 'outline') return 'none';
    return '0 8px 24px rgba(0,0,0,0.2)';
  };

  return (
    <motion.button
      className={`px-8 py-4 rounded-2xl flex items-center justify-center gap-3 ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${textColors[variant]}`}
      style={{
        background: variants[variant],
        boxShadow: getBoxShadow(),
        border: getBorderStyle()
      }}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}