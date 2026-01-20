export const TITLES = {
  DEFAULT: 'the bug is on the table',
  SINGLE_SMASHED: "there's 1 smashed bug on the table",
  MULTIPLE_SMASHED: (count: number) => `there are ${count} smashed bugs on the table`,
} as const
