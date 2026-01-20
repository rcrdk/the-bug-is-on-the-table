export const getAudioFileForBug = (emoji: string | undefined): string => {
  if (emoji === '🦋') return '/girl-scream.mp3'
  if (emoji === '🍑') return '/doh.mp3'
  return '/slap.mp3'
}
