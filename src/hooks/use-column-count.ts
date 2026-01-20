import { useEffect, useState } from 'react'

import { COLS_DESKTOP, getColumnCount } from '@/utils/table-grid'

export const useColumnCount = () => {
  const [columnCount, setColumnCount] = useState<number>(COLS_DESKTOP)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setColumnCount(getColumnCount(window.innerWidth))
  }, [])

  return columnCount
}
