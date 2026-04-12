import { useEffect, useRef } from 'react'

/**
 * Calls `callback` immediately on mount and then every `intervalMs` milliseconds.
 * Cleans up on unmount. Skips if callback is already running.
 */
export function usePolling(callback, intervalMs = 30000) {
  const running = useRef(false)
  const savedCb = useRef(callback)

  useEffect(() => {
    savedCb.current = callback
  }, [callback])

  useEffect(() => {
    let timer

    async function tick() {
      if (running.current) return
      running.current = true
      try {
        await savedCb.current()
      } catch {
        // swallow — caller handles errors via store
      } finally {
        running.current = false
      }
    }

    tick()
    timer = setInterval(tick, intervalMs)

    return () => clearInterval(timer)
  }, [intervalMs])
}
