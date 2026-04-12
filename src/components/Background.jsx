import { useMemo } from 'react'

/**
 * Rich animated background with gradient orbs, grid and stars.
 * Gives LiquidGlass components real content to refract.
 * Color palette: cyan/teal hues (175-200) matching EIFAVPN logo.
 */
export default function Background() {
  const stars = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 3,
      opacity: Math.random() * 0.5 + 0.15,
      cyan: Math.random() > 0.7,
    })),
  [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.14 0.028 190 / 60%) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 100% 100%, oklch(0.12 0.022 200 / 30%) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 0% 60%, oklch(0.10 0.020 185 / 25%) 0%, transparent 50%)
          `,
        }}
      />

      {/* Animated gradient orbs — these are what LiquidGlass refracts */}
      <div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: '500px',
          height: '500px',
          top: '10%',
          left: '15%',
          background: 'radial-gradient(circle, oklch(0.50 0.16 180 / 25%) 0%, oklch(0.35 0.12 195 / 10%) 50%, transparent 70%)',
          animation: 'orb-drift-1 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: '600px',
          height: '600px',
          top: '50%',
          right: '10%',
          background: 'radial-gradient(circle, oklch(0.45 0.14 195 / 20%) 0%, oklch(0.30 0.10 210 / 8%) 50%, transparent 70%)',
          animation: 'orb-drift-2 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-[70px]"
        style={{
          width: '400px',
          height: '400px',
          bottom: '15%',
          left: '40%',
          background: 'radial-gradient(circle, oklch(0.55 0.18 175 / 18%) 0%, oklch(0.40 0.12 185 / 6%) 50%, transparent 70%)',
          animation: 'orb-drift-3 18s ease-in-out infinite',
        }}
      />
      {/* Small bright accent orb */}
      <div
        className="absolute rounded-full blur-[50px]"
        style={{
          width: '200px',
          height: '200px',
          top: '30%',
          right: '30%',
          background: 'radial-gradient(circle, oklch(0.70 0.155 180 / 15%) 0%, transparent 70%)',
          animation: 'orb-drift-1 15s ease-in-out infinite reverse',
        }}
      />

      {/* Subtle dot grid — adds texture for glass refraction */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="oklch(0.80 0.155 180)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Horizontal light streaks */}
      <div
        className="absolute h-[1px] opacity-[0.04]"
        style={{
          top: '25%',
          left: '0',
          right: '0',
          background: 'linear-gradient(90deg, transparent, oklch(0.80 0.155 180 / 40%), transparent)',
        }}
      />
      <div
        className="absolute h-[1px] opacity-[0.03]"
        style={{
          top: '65%',
          left: '10%',
          right: '10%',
          background: 'linear-gradient(90deg, transparent, oklch(0.60 0.12 195 / 30%), transparent)',
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.cyan ? 'oklch(0.80 0.155 180)' : 'oklch(0.80 0.01 190)',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            boxShadow: star.cyan && star.size > 1.5
              ? '0 0 4px oklch(0.80 0.155 180 / 50%)'
              : 'none',
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, oklch(0.05 0.010 195 / 60%) 100%)',
        }}
      />
    </div>
  )
}
