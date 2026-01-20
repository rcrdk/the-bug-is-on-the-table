import { TITLES } from '@/constants/header-title'

export const getHeaderTitle = (smashedCount: number): string => {
  if (smashedCount === 0) return TITLES.DEFAULT
  if (smashedCount === 1) return TITLES.SINGLE_SMASHED
  return TITLES.MULTIPLE_SMASHED(smashedCount)
}
