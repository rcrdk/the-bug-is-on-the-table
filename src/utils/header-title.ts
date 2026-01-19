const DEFAULT_TITLE = 'the bug is on the table'
const SINGLE_SMASHED_TITLE = "there's 1 smashed bug on the table"

const getMultipleSmashedTitle = (count: number) => `there are ${count} smashed bugs on the table`

export const getHeaderTitle = (smashedCount: number): string => {
  if (smashedCount === 0) return DEFAULT_TITLE
  if (smashedCount === 1) return SINGLE_SMASHED_TITLE
  return getMultipleSmashedTitle(smashedCount)
}
