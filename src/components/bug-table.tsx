'use client'

import type { MouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  AUTO_MOVE_DESKTOP,
  AUTO_MOVE_TOUCH,
  BOTTOM_Y_PERCENT,
  DELAY,
  MOVE_BOUNDS,
  SPAWN,
  TIMING,
} from '@/constants/bug-game'
import { useTouchDevice } from '@/hooks/use-touch-device'
import type { BugState } from '@/types/bug-state'
import { getAudioFileForBug } from '@/utils/audio'
import { createBug } from '@/utils/create-bug'
import { randomInRange } from '@/utils/random-in-range'
import { Bug } from './bug'
import { DecorativeBugs } from './decorative-bugs'
import { MouseCursor } from './mouse-cursor'
import { StartModal } from './start-modal'
import { TableGrid } from './table-grid'

interface BugTableProps {
  onStart?: () => void
  onSmashedCountChange?: (count: number) => void
}

export function BugTable({ onStart, onSmashedCountChange }: BugTableProps) {
  const [bugs, setBugs] = useState<BugState[]>([])

  const [caughtAtLeastOne, setCaughtAtLeastOne] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHoveringBug, setIsHoveringBug] = useState(false)
  const [recentlyHitBugIds, setRecentlyHitBugIds] = useState<number[]>([])

  const isTouchDevice = useTouchDevice()

  const bugMoveCountRef = useRef(0)
  const lastMoveTimeRef = useRef(0)
  const tableSurfaceRef = useRef<HTMLDivElement>(null)
  const touchDeviceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const desktopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleStart = () => {
    setBugs([createBug(SPAWN.INITIAL_BUG_ID)])
    setHasStarted(true)
    onStart?.()
  }

  const triggerBugMove = useCallback(() => {
    setBugs((prev) =>
      prev.map((bug) => {
        if (bug.caught || bug.swipedAway) return bug

        return {
          ...bug,
          hopping: true,
          x: randomInRange(MOVE_BOUNDS.X_MIN, MOVE_BOUNDS.X_MAX),
          y: randomInRange(MOVE_BOUNDS.Y_MIN, MOVE_BOUNDS.Y_MAX),
          rotation: randomInRange(MOVE_BOUNDS.ROTATION_MIN, MOVE_BOUNDS.ROTATION_MAX),
        }
      }),
    )

    setTimeout(
      () => setBugs((prev) => prev.map((bug) => ({ ...bug, hopping: false }))),
      TIMING.HOP_ANIMATION_DURATION_MS,
    )
  }, [])

  const maybeMoveBugs = () => {
    const now = Date.now()

    if (now - lastMoveTimeRef.current < TIMING.MOUSE_MOVE_COOLDOWN_MS) return

    lastMoveTimeRef.current = now

    bugMoveCountRef.current += 1
    const moveNumber = bugMoveCountRef.current

    const shouldDelay = moveNumber > DELAY.THRESHOLD_MOVES && Math.random() < DELAY.PROBABILITY

    if (!shouldDelay) {
      triggerBugMove()
      return
    }

    const delay = DELAY.BASE_MS + randomInRange(DELAY.RANDOM_MIN_MS, DELAY.RANDOM_MAX_MS)
    setTimeout(() => triggerBugMove(), delay)
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isTouchDevice && tableSurfaceRef.current) {
      const rect = tableSurfaceRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })

      maybeMoveBugs()
      return
    }

    if (!isTouchDevice) maybeMoveBugs()
  }

  const handleBugCatch = (id: number) => {
    let caughtBugEmoji: string | undefined

    setBugs((prev) => {
      const bug = prev.find((b) => b.id === id)
      caughtBugEmoji = bug?.emoji
      return prev.map((bug) => {
        if (bug.id !== id || bug.hopping || bug.swipedAway) return bug
        return { ...bug, caught: true }
      })
    })

    setCaughtAtLeastOne(true)

    setTimeout(() => {
      setBugs((prev) =>
        prev.map((bug) => {
          if (bug.id !== id || bug.swipedAway === true) return bug
          return {
            ...bug,
            x: bug.x,
            y: BOTTOM_Y_PERCENT,
            rotation: randomInRange(0, 360),
            swipedAway: true,
          }
        }),
      )

      const audioFile = getAudioFileForBug(caughtBugEmoji)
      const audio = new Audio(audioFile)
      audio.play().catch(() => {})
    }, TIMING.SLAP_DELAY_MS)
  }

  const handleBugEnter = (id: number) => {
    setRecentlyHitBugIds((prev) => [...prev, id])
    setTimeout(
      () => setRecentlyHitBugIds((prev) => prev.filter((bugId) => bugId !== id)),
      TIMING.HIT_REACTION_DURATION_MS,
    )

    setIsHoveringBug(true)
    handleBugCatch(id)
  }

  const handleBugLeave = () => setIsHoveringBug(false)

  useEffect(() => {
    if (!isTouchDevice || !hasStarted) return

    const scheduleNextMove = () => {
      const pauseTime = randomInRange(AUTO_MOVE_TOUCH.PAUSE_MIN_MS, AUTO_MOVE_TOUCH.PAUSE_MAX_MS)

      touchDeviceTimeoutRef.current = setTimeout(() => {
        triggerBugMove()

        const nextMoveTime = randomInRange(AUTO_MOVE_TOUCH.INTERVAL_MIN_MS, AUTO_MOVE_TOUCH.INTERVAL_MAX_MS)

        touchDeviceTimeoutRef.current = setTimeout(() => scheduleNextMove(), nextMoveTime)
      }, pauseTime)
    }

    scheduleNextMove()

    return () => {
      if (touchDeviceTimeoutRef.current) clearTimeout(touchDeviceTimeoutRef.current)
    }
  }, [isTouchDevice, hasStarted, triggerBugMove])

  useEffect(() => {
    if (isTouchDevice || !hasStarted) return

    const scheduleNextMove = () => {
      const pauseTime = randomInRange(AUTO_MOVE_DESKTOP.PAUSE_MIN_MS, AUTO_MOVE_DESKTOP.PAUSE_MAX_MS)

      desktopTimeoutRef.current = setTimeout(() => {
        triggerBugMove()

        const nextMoveTime = randomInRange(AUTO_MOVE_DESKTOP.INTERVAL_MIN_MS, AUTO_MOVE_DESKTOP.INTERVAL_MAX_MS)

        desktopTimeoutRef.current = setTimeout(() => {
          scheduleNextMove()
        }, nextMoveTime)
      }, pauseTime)
    }

    scheduleNextMove()

    return () => {
      if (desktopTimeoutRef.current) clearTimeout(desktopTimeoutRef.current)
    }
  }, [isTouchDevice, hasStarted, triggerBugMove])

  useEffect(() => {
    if (!caughtAtLeastOne || !hasStarted) return

    const interval = setInterval(() => {
      setBugs((prev) => {
        const alive = prev.filter((b) => !b.swipedAway)
        if (alive.length >= SPAWN.MAX_BUGS) return prev

        const nextId = prev.reduce((m, b) => Math.max(m, b.id), 1) + 1
        return [...prev, createBug(nextId)]
      })
    }, SPAWN.INTERVAL_MS)

    return () => clearInterval(interval)
  }, [caughtAtLeastOne, hasStarted])

  useEffect(() => {
    const smashedCount = bugs.filter((bug) => bug.swipedAway).length
    onSmashedCountChange?.(smashedCount)
  }, [bugs, onSmashedCountChange])

  return (
    <div className="fixed inset-0 h-[100dvh] w-[100dvw] overflow-hidden bg-neutral-100">
      <div
        ref={tableSurfaceRef}
        className="absolute inset-0 h-full w-full cursor-none overflow-hidden bg-white"
        onMouseMove={hasStarted ? handleMouseMove : undefined}
      >
        <TableGrid />

        {bugs.map((bug) => (
          <Bug
            key={bug.id}
            bug={bug}
            isTouchDevice={isTouchDevice}
            isRecentlyHit={recentlyHitBugIds.includes(bug.id)}
            onBugEnter={handleBugEnter}
            onBugLeave={handleBugLeave}
          />
        ))}

        {!isTouchDevice && hasStarted && (
          <MouseCursor x={mousePosition.x} y={mousePosition.y} isHoveringBug={isHoveringBug} />
        )}
      </div>

      {!hasStarted && (
        <>
          <DecorativeBugs />
          <StartModal onStart={handleStart} />
        </>
      )}
    </div>
  )
}
