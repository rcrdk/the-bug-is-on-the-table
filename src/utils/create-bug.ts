import type { BugState } from '../types/bug-state'
import { randomInRange } from './random-in-range'

const INITIAL_INNER_X_MIN = 10
const INITIAL_INNER_X_MAX = 90
const INITIAL_INNER_Y_MIN = 10
const INITIAL_INNER_Y_MAX = 90
const INITIAL_BUG_ROTATION_MIN = -25
const INITIAL_BUG_ROTATION_MAX = 25

const BUG_EMOJIS = ['🪳', '🦟', '🕷️', '🐜', '🐛', '🐞', '🐝', '🦗', '🍑', '🪰', '🦋']

export const createBug = (id: number): BugState => {
  const emoji = BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)]

  const side = Math.floor(Math.random() * 5)
  let x: number
  let y: number

  switch (side) {
    case 0:
      x = randomInRange(INITIAL_INNER_X_MIN, INITIAL_INNER_X_MAX)
      y = -5
      break
    case 1:
      x = -5
      y = randomInRange(INITIAL_INNER_Y_MIN, INITIAL_INNER_Y_MAX)
      break
    case 2:
      x = 105
      y = randomInRange(INITIAL_INNER_Y_MIN, INITIAL_INNER_Y_MAX)
      break
    case 3:
      x = -5
      y = -5
      break
    default:
      x = 105
      y = -5
      break
  }

  return {
    id,
    x,
    y,
    rotation: randomInRange(INITIAL_BUG_ROTATION_MIN, INITIAL_BUG_ROTATION_MAX),
    hopping: false,
    caught: false,
    swipedAway: false,
    emoji,
  }
}
