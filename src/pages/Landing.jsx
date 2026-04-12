import { useState } from 'react'
import Hero from './Hero'
import Features from './Features'
import Plans from './Plans'

export default function Landing() {
  const [selectedPlan, setSelectedPlan] = useState(null)

  return (
    <>
      <Hero />
      <Features />
      <Plans selectedPlan={selectedPlan} onSelect={setSelectedPlan} />
    </>
  )
}
