import type { BugState } from '@/types/bug-state'
import { cv } from '@/utils/cv'

interface BugProps {
  bug: BugState
  isTouchDevice: boolean
  isRecentlyHit: boolean
  onBugEnter: (id: number) => void
  onBugLeave: () => void
}

export function Bug({ bug, isTouchDevice, isRecentlyHit, onBugEnter, onBugLeave }: BugProps) {
  const isInactive = bug.swipedAway
  const eventHandlers = isTouchDevice
    ? {
        onClick: isInactive ? undefined : () => onBugEnter(bug.id),
      }
    : {
        onMouseEnter: isInactive ? undefined : () => onBugEnter(bug.id),
        onMouseLeave: isInactive ? undefined : onBugLeave,
      }

  return (
    <div
      className={cv(
        'absolute origin-center cursor-pointer text-[64px] leading-none transition-[left,top,transform] duration-700',
        bug.hopping && 'animate-bug-hop',
        bug.caught && 'animate-bug-slap',
        bug.swipedAway && 'pointer-events-none transition-[left,top,transform] duration-1000',
      )}
      style={{
        left: `${bug.x}%`,
        top: `${bug.y}%`,
        transform: `translate(-50%, -50%) rotate(${bug.rotation}deg)`,
      }}
      {...eventHandlers}
    >
      <span className={cv('inline-block', !bug.swipedAway && 'animate-bug-rotate')}>{bug.emoji}</span>
      {isRecentlyHit && !bug.swipedAway && (
        <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[72px]">
          💢
        </span>
      )}
    </div>
  )
}
