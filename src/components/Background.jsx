/**
 * Subtle static gradient background.
 * Adapts to light/dark theme via CSS custom properties.
 */
export default function Background() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 40%, var(--surface) 0%, var(--background) 100%)
        `,
      }}
    />
  )
}
