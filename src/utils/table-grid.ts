const COLS_MOBILE = 4
const COLS_TABLET = 9

export const COLS_DESKTOP = 14

const BREAKPOINT_MOBILE_MAX = 576
const BREAKPOINT_TABLET_MAX = 1024

export const getColumnCount = (width: number): number => {
  if (width < BREAKPOINT_MOBILE_MAX) return COLS_MOBILE
  if (width < BREAKPOINT_TABLET_MAX) return COLS_TABLET
  return COLS_DESKTOP
}
