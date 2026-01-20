import { BREAKPOINTS, COLUMNS } from '@/constants/table-grid'

export const COLS_DESKTOP = COLUMNS.DESKTOP

export const getColumnCount = (width: number): number => {
  if (width < BREAKPOINTS.MOBILE_MAX) return COLUMNS.MOBILE
  if (width < BREAKPOINTS.TABLET_MAX) return COLUMNS.TABLET
  return COLUMNS.DESKTOP
}
