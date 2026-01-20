import { BUG_EMOJIS } from '@/constants/create-bug'
import type { DecorativeBug } from '@/types/decorative-bug'

const getRandomStartPosition = () => {
  const side = Math.floor(Math.random() * 4)
  if (side === 0) return { x: Math.random() * 100, y: -10 }
  if (side === 1) return { x: 110, y: Math.random() * 100 }
  if (side === 2) return { x: Math.random() * 100, y: 110 }
  return { x: -10, y: Math.random() * 100 }
}

const getRandomEndPosition = () => {
  const side = Math.floor(Math.random() * 4)
  if (side === 0) return { x: Math.random() * 100, y: -10 }
  if (side === 1) return { x: 110, y: Math.random() * 100 }
  if (side === 2) return { x: Math.random() * 100, y: 110 }
  return { x: -10, y: Math.random() * 100 }
}

export const createDecorativeBug = (id: number): DecorativeBug => {
  const start = getRandomStartPosition()
  const end = getRandomEndPosition()
  const animations = ['bugFly1', 'bugFly2', 'bugFly3', 'bugFly4'] as const

  return {
    id,
    emoji: BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)] ?? '🐛',
    startX: start.x,
    startY: start.y,
    endX: end.x,
    endY: end.y,
    rotation: Math.random() * 360,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 10,
    animationName: animations[Math.floor(Math.random() * animations.length)] ?? 'bugFly1',
  }
}
