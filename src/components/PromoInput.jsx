import { useState, useEffect, useRef, useCallback } from 'react'
import { Input, Button } from '@heroui/react'
import { validatePromo } from '../api/subscriptions'

export default function PromoInput({ plan, period, onPromoApplied, initialCode = '' }) {
  const [code, setCode] = useState(initialCode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [applied, setApplied] = useState(false)
  const initialApplied = useRef(false)

  const handleApply = useCallback(async (promoCode) => {
    const trimmed = (promoCode || code).trim().toUpperCase()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    try {
      const data = await validatePromo({ code: trimmed, plan, period })
      setApplied(true)
      onPromoApplied({ ...data, code: trimmed })
    } catch (err) {
      setError(err.message || 'Промокод недействителен')
      setApplied(false)
      onPromoApplied(null)
    } finally {
      setLoading(false)
    }
  }, [code, plan, period, onPromoApplied])

  // Auto-validate initial code once
  useEffect(() => {
    if (initialCode && !initialApplied.current) {
      initialApplied.current = true
      handleApply(initialCode)
    }
  }, [initialCode, handleApply])

  function handleClear() {
    setCode('')
    setApplied(false)
    setError(null)
    onPromoApplied(null)
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="PROMO2025"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase())
          if (applied) {
            setApplied(false)
            onPromoApplied(null)
          }
          setError(null)
        }}
        isInvalid={!!error}
        errorMessage={error}
        isDisabled={loading}
        classNames={{ input: 'uppercase' }}
      />
      {applied ? (
        <Button variant="outline" onPress={handleClear} className="shrink-0">
          Убрать
        </Button>
      ) : (
        <Button
          onPress={() => handleApply()}
          isPending={loading}
          isDisabled={!code.trim()}
          className="shrink-0"
        >
          Применить
        </Button>
      )}
    </div>
  )
}
