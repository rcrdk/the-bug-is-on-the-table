'use client'

import { useEffect, useState } from 'react'

import { COLS_DESKTOP, getColumnCount } from '@/utils/table-grid'

const TABLE_ROWS = 32

export function TableGrid() {
  const [columnCount, setColumnCount] = useState(COLS_DESKTOP)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setColumnCount(getColumnCount(window.innerWidth))
  }, [])

  return (
    <table className="absolute inset-0 h-full w-full border-collapse">
      <tbody className="divide-y divide-black">
        {Array.from({ length: TABLE_ROWS }).map((_, row) => (
          <tr key={row} className="divide-x divide-black">
            {Array.from({ length: columnCount }).map((_, col) => (
              <td key={col} className="p-0" />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
