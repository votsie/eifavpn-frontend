import { useMemo, useState, useEffect } from 'react'

/**
 * Rich animated background with gradient orbs, grid and stars.
 * Adapts to light/dark theme.
 */
export default function Background() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.getAttribute('data-theme') !== 'light'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

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

  // Theme-dependent colors
  const orbColors = isDark
    ? {
        bg1: 'oklch(0.14 0.028 190 / 60%)',
        bg2: 'oklch(0.12 0.022 200 / 30%)',
        bg3: 'oklch(0.10 0.020 185 / 25%)',
        orb1: 'radial-gradient(circle, oklch(0.50 0.16 180 / 25%) 0%, oklch(0.35 0.12 195 / 10%) 50%, transparent 70%)',
        orb2: 'radial-gradient(circle, oklch(0.45 0.14 195 / 20%) 0%, oklch(0.30 0.10 210 / 8%) 50%, transparent 70%)',
        orb3: 'radial-gradient(circle, oklch(0.55 0.18 175 / 18%) 0%, oklch(0.40 0.12 185 / 6%) 50%, transparent 70%)',
        orb4: 'radial-gradient(circle, oklch(0.70 0.155 180 / 15%) 0%, transparent 70%)',
        gridColor: 'oklch(0.78 0.17 180)',
        gridOpacity: '0.03',
        streak1: 'oklch(0.78 0.17 180 / 40%)',
        streak2: 'oklch(0.60 0.12 195 / 30%)',
        streakOp1: '0.04',
        streakOp2: '0.03',
        starColor: 'oklch(0.78 0.17 180)',
        starNeutral: 'oklch(0.80 0.01 190)',
        starGlow: '0 0 4px oklch(0.78 0.17 180 / 50%)',
        vignette: 'oklch(0.05 0.010 195 / 60%)',
      }
    : {
        bg1: 'oklch(0.92 0.015 190 / 30%)',
        bg2: 'oklch(0.94 0.012 200 / 20%)',
        bg3: 'oklch(0.93 0.010 185 / 15%)',
        orb1: 'radial-gradient(circle, oklch(0.85 0.08 180 / 15%) 0%, oklch(0.90 0.05 195 / 6%) 50%, transparent 70%)',
        orb2: 'radial-gradient(circle, oklch(0.88 0.06 195 / 12%) 0%, oklch(0.92 0.04 210 / 5%) 50%, transparent 70%)',
        orb3: 'radial-gradient(circle, oklch(0.86 0.08 175 / 10%) 0%, oklch(0.90 0.05 185 / 4%) 50%, transparent 70%)',
        orb4: 'radial-gradient(circle, oklch(0.90 0.06 180 / 8%) 0%, transparent 70%)',
        gridColor: 'oklch(0.42 0.18 180)',
        gridOpacity: '0.04',
        streak1: 'oklch(0.42 0.18 180 / 20%)',
        streak2: 'oklch(0.50 0.12 195 / 15%)',
        streakOp1: '0.06',
        streakOp2: '0.04',
        starColor: 'oklch(0.42 0.18 180)',
        starNeutral: 'oklch(0.70 0.01 190)',
        starGlow: '0 0 3px oklch(0.42 0.18 180 / 30%)',
        vignette: 'oklch(0.98 0.003 200 / 40%)',
      }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, ${orbColors.bg1} 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 100% 100%, ${orbColors.bg2} 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 0% 60%, ${orbColors.bg3} 0%, transparent 50%)
          `,
        }}
      />

      {/* Animated gradient orbs */}
      <div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: '500px',
          height: '500px',
          top: '10%',
          left: '15%',
          background: orbColors.orb1,
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
          background: orbColors.orb2,
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
          background: orbColors.orb3,
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
          background: orbColors.orb4,
          animation: 'orb-drift-1 15s ease-in-out infinite reverse',
        }}
      />

      {/* Subtle dot grid */}
      <svg className="absolute inset-0 h-full w-full" style={{ opacity: orbColors.gridOpacity }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill={orbColors.gridColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Horizontal light streaks */}
      <div
        className="absolute h-[1px]"
        style={{
          top: '25%',
          left: '0',
          right: '0',
          opacity: orbColors.streakOp1,
          background: `linear-gradient(90deg, transparent, ${orbColors.streak1}, transparent)`,
        }}
      />
      <div
        className="absolute h-[1px]"
        style={{
          top: '65%',
          left: '10%',
          right: '10%',
          opacity: orbColors.streakOp2,
          background: `linear-gradient(90deg, transparent, ${orbColors.streak2}, transparent)`,
        }}
      />

      {/* Stars — fewer and subtler in light mode */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.cyan ? orbColors.starColor : orbColors.starNeutral,
            opacity: isDark ? star.opacity : star.opacity * 0.4,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            boxShadow: star.cyan && star.size > 1.5
              ? orbColors.starGlow
              : 'none',
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${orbColors.vignette} 100%)`,
        }}
      />
    </div>
  )
}
