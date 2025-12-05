import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

export function Confetti() {
  const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#FFD700'];
  
  const particles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.3,
    rotation: Math.random() * 360,
    size: Math.random() * 10 + 6
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 100 }}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [1, 1, 0],
            rotate: particle.rotation + 720
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: particle.delay,
            ease: "easeIn"
          }}
        />
      ))}
      
      {/* Sparkles mixed in */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.5;
        return (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: '-20px'
            }}
            initial={{ y: 0, opacity: 1, scale: 0, rotate: 0 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 2.5,
              delay: delay,
              ease: "easeIn"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M10 0 L11 9 L20 10 L11 11 L10 20 L9 11 L0 10 L9 9 Z"
                fill="#FFD700"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
