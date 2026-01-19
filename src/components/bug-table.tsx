'use client'

import type { MouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { BugState } from '@/types/bug-state'
import { createBug } from '@/utils/create-bug'
import { randomInRange } from '@/utils/random-in-range'
import { Bug } from './bug'
import { MouseCursor } from './mouse-cursor'
import { StartModal } from './start-modal'
import { TableGrid } from './table-grid'

const INITIAL_BUG_ID = 1
const MAX_BUGS = 6
const BUG_SPAWN_INTERVAL_MS = 1500

const BUG_MOVE_X_MIN = 8
const BUG_MOVE_X_MAX = 92
const BUG_MOVE_Y_MIN = 8
const BUG_MOVE_Y_MAX = 92
const BUG_MOVE_ROTATION_MIN = -25
const BUG_MOVE_ROTATION_MAX = 25

const HOP_ANIMATION_DURATION_MS = 600
const SLAP_DELAY_MS = 500
const HIT_REACTION_DURATION_MS = 500
const MOUSE_MOVE_COOLDOWN_MS = 450

const DELAY_THRESHOLD_MOVES = 3
const DELAY_PROBABILITY = 0.6
const DELAY_BASE_MS = 350
const DELAY_RANDOM_MIN_MS = 200
const DELAY_RANDOM_MAX_MS = 400

const BOTTOM_Y_PERCENT = 97

const AUTO_MOVE_INTERVAL_MIN_MS = 500
const AUTO_MOVE_INTERVAL_MAX_MS = 1200
const AUTO_MOVE_PAUSE_MIN_MS = 200
const AUTO_MOVE_PAUSE_MAX_MS = 600

interface BugTableProps {
  onStart?: () => void
  onSmashedCountChange?: (count: number) => void
}

export function BugTable({ onStart, onSmashedCountChange }: Readonly<BugTableProps>) {
  const [bugs, setBugs] = useState<BugState[]>([])

  const [caughtAtLeastOne, setCaughtAtLeastOne] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHoveringBug, setIsHoveringBug] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [recentlyHitBugIds, setRecentlyHitBugIds] = useState<number[]>([])

  const bugMoveCountRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastMoveTimeRef = useRef(0)
  const tableSurfaceRef = useRef<HTMLDivElement>(null)
  const touchDeviceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const desktopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleStart = () => {
    setBugs([createBug(INITIAL_BUG_ID)])
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
          x: randomInRange(BUG_MOVE_X_MIN, BUG_MOVE_X_MAX),
          y: randomInRange(BUG_MOVE_Y_MIN, BUG_MOVE_Y_MAX),
          rotation: randomInRange(BUG_MOVE_ROTATION_MIN, BUG_MOVE_ROTATION_MAX),
        }
      }),
    )

    setTimeout(() => setBugs((prev) => prev.map((bug) => ({ ...bug, hopping: false }))), HOP_ANIMATION_DURATION_MS)
  }, [])

  const maybeMoveBugs = () => {
    const now = Date.now()

    if (now - lastMoveTimeRef.current < MOUSE_MOVE_COOLDOWN_MS) return

    lastMoveTimeRef.current = now

    bugMoveCountRef.current += 1
    const moveNumber = bugMoveCountRef.current

    const shouldDelay = moveNumber > DELAY_THRESHOLD_MOVES && Math.random() < DELAY_PROBABILITY

    if (!shouldDelay) {
      triggerBugMove()
      return
    }

    const delay = DELAY_BASE_MS + randomInRange(DELAY_RANDOM_MIN_MS, DELAY_RANDOM_MAX_MS)
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
    setBugs((prev) =>
      prev.map((bug) => {
        if (bug.id !== id || bug.hopping || bug.swipedAway) return bug
        return { ...bug, caught: true }
      }),
    )

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

      if (!audioRef.current) {
        const audio = new Audio('/slap.mp3')
        audioRef.current = audio
      }

      audioRef.current?.play().catch(() => {})
    }, SLAP_DELAY_MS)
  }

  const handleBugEnter = (id: number) => {
    setRecentlyHitBugIds((prev) => [...prev, id])
    setTimeout(() => setRecentlyHitBugIds((prev) => prev.filter((bugId) => bugId !== id)), HIT_REACTION_DURATION_MS)

    setIsHoveringBug(true)
    handleBugCatch(id)
  }

  const handleBugLeave = () => setIsHoveringBug(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const nav = navigator as Navigator & {
      maxTouchPoints?: number
      msMaxTouchPoints?: number
    }

    const hasTouch = 'ontouchstart' in window || (nav.maxTouchPoints ?? 0) > 0 || (nav.msMaxTouchPoints ?? 0) > 0
    setIsTouchDevice(hasTouch)
  }, [])

  useEffect(() => {
    if (!isTouchDevice || !hasStarted) return

    const scheduleNextMove = () => {
      const pauseTime = randomInRange(AUTO_MOVE_PAUSE_MIN_MS, AUTO_MOVE_PAUSE_MAX_MS)

      touchDeviceTimeoutRef.current = setTimeout(() => {
        triggerBugMove()

        const nextMoveTime = randomInRange(AUTO_MOVE_INTERVAL_MIN_MS, AUTO_MOVE_INTERVAL_MAX_MS)

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
      const pauseTime = randomInRange(AUTO_MOVE_PAUSE_MIN_MS, AUTO_MOVE_PAUSE_MAX_MS)

      desktopTimeoutRef.current = setTimeout(() => {
        triggerBugMove()

        const nextMoveTime = randomInRange(AUTO_MOVE_INTERVAL_MIN_MS, AUTO_MOVE_INTERVAL_MAX_MS)

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
        if (alive.length >= MAX_BUGS) return prev

        const nextId = prev.reduce((m, b) => Math.max(m, b.id), 1) + 1
        return [...prev, createBug(nextId)]
      })
    }, BUG_SPAWN_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [caughtAtLeastOne, hasStarted])

  useEffect(() => {
    const smashedCount = bugs.filter((bug) => bug.swipedAway).length
    onSmashedCountChange?.(smashedCount)
  }, [bugs, onSmashedCountChange])

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-neutral-100">
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

      {!hasStarted && <StartModal onStart={handleStart} />}
    </div>
  )
}
