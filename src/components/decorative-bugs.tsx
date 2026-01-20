'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

import { DECORATIVE_BUG_COUNT } from '@/constants/decorative-bugs'
import type { DecorativeBug } from '@/types/decorative-bug'
import { createDecorativeBug } from '@/utils/decorative-bugs'

export function DecorativeBugs() {
  const [bugs, setBugs] = useState<DecorativeBug[]>([])

  useEffect(() => {
    setBugs(Array.from({ length: DECORATIVE_BUG_COUNT }, (_, i) => createDecorativeBug(i)))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-[999] overflow-hidden">
      {bugs.map((bug) => (
        <div
          key={bug.id}
          className="absolute text-5xl leading-none"
          style={
            {
              left: `${bug.startX}%`,
              top: `${bug.startY}%`,
              transform: 'translate(-50%, -50%)',
              '--end-x': `${bug.endX}%`,
              '--end-y': `${bug.endY}%`,
              '--start-x': `${bug.startX}%`,
              '--start-y': `${bug.startY}%`,
              animation: `bugFlySimple ${bug.duration}s linear infinite`,
              animationDelay: `${bug.delay}s`,
            } as CSSProperties
          }
        >
          {bug.emoji}
        </div>
      ))}
    </div>
  )
}
