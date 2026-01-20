import { useEffect, useState } from 'react'

export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const nav = navigator as Navigator & {
      maxTouchPoints?: number
      msMaxTouchPoints?: number
    }

    const hasTouch = 'ontouchstart' in window || (nav.maxTouchPoints ?? 0) > 0 || (nav.msMaxTouchPoints ?? 0) > 0
    setIsTouchDevice(hasTouch)
  }, [])

  return isTouchDevice
}
