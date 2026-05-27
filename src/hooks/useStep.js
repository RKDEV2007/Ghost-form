import { useState } from 'react'

export function useStep(max) {
  const [step, setStep] = useState(0)
  const next = () => setStep((value) => Math.min(max, value + 1))
  return { step, next }
}
