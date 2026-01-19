interface MouseCursorProps {
  x: number
  y: number
  isHoveringBug: boolean
}

export function MouseCursor({ x, y, isHoveringBug }: Readonly<MouseCursorProps>) {
  return (
    <div
      className="pointer-events-none absolute z-1000 -translate-x-1/2 -translate-y-1/2 text-[96px] leading-none transition-transform duration-100"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {isHoveringBug ? '👊' : '✋'}
    </div>
  )
}
