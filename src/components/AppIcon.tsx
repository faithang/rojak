export function AppIcon({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="60" fill="url(#gradient)" />

      {/* Bowl rim (back layer) */}
      <ellipse cx="60" cy="75" rx="42" ry="10" fill="#FFB84D" opacity="0.9" />
      
      {/* Bowl inner shadow/depth */}
      <ellipse cx="60" cy="75" rx="38" ry="8" fill="#FF9500" opacity="0.3" />

      {/* Card 1 - tilted left, sitting in bowl */}
      <rect
        x="28"
        y="43"
        width="32"
        height="42"
        rx="4"
        fill="#ED2939"
        opacity="0.9"
        transform="rotate(-18 44 64)"
      />

      {/* Card 2 - tilted right, sitting in bowl */}
      <rect
        x="60"
        y="43"
        width="32"
        height="42"
        rx="4"
        fill="white"
        opacity="0.95"
        transform="rotate(18 76 64)"
      />

      {/* Bowl body (front layer - covers bottom of cards) */}
      <path
        d="M 18 75 C 18 87 35 100 60 101 C 85 100 102 87 102 75"
        fill="#FFA826"
        opacity="0.9"
      />

      {/* Sparkle */}
      <path
        d="M60 20 L62 28 L70 30 L62 32 L60 40 L58 32 L50 30 L58 28 Z"
        fill="#FFD700"
      />
      <path
        d="M90 50 L91 54 L95 55 L91 56 L90 60 L89 56 L85 55 L89 54 Z"
        fill="#FFD700"
      />
      <path
        d="M30 70 L31 73 L34 74 L31 75 L30 78 L29 75 L26 74 L29 73 Z"
        fill="#FFD700"
      />

      <defs>
        <linearGradient
          id="gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}