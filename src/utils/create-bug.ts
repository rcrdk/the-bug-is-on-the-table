import { BUG_EMOJIS, INITIAL_POSITION } from '@/constants/create-bug'
import type { BugState } from '../types/bug-state'
import { randomInRange } from './random-in-range'

const getPositionForSide = (side: number): { x: number; y: number } => {
  if (side === 0) {
    return {
      x: randomInRange(INITIAL_POSITION.INNER_X_MIN, INITIAL_POSITION.INNER_X_MAX),
      y: INITIAL_POSITION.OFFSET,
    }
  }

  if (side === 1) {
    return {
      x: INITIAL_POSITION.OFFSET,
      y: randomInRange(INITIAL_POSITION.INNER_Y_MIN, INITIAL_POSITION.INNER_Y_MAX),
    }
  }

  if (side === 2) {
    return {
      x: INITIAL_POSITION.OFFSET_RIGHT,
      y: randomInRange(INITIAL_POSITION.INNER_Y_MIN, INITIAL_POSITION.INNER_Y_MAX),
    }
  }

  if (side === 3) {
    return {
      x: INITIAL_POSITION.OFFSET,
      y: INITIAL_POSITION.OFFSET,
    }
  }

  return {
    x: INITIAL_POSITION.OFFSET_RIGHT,
    y: INITIAL_POSITION.OFFSET,
  }
}

export const createBug = (id: number): BugState => {
  const emoji = BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)]
  const side = Math.floor(Math.random() * 5)
  const { x, y } = getPositionForSide(side)

  return {
    id,
    x,
    y,
    rotation: randomInRange(INITIAL_POSITION.ROTATION_MIN, INITIAL_POSITION.ROTATION_MAX),
    hopping: false,
    caught: false,
    swipedAway: false,
    emoji,
  }
}
