import { getHeaderTitle } from '@/utils/header-title'
import { GithubIcon } from './github-icon'

interface HeaderProps {
  hidden?: boolean
  smashedCount?: number
}

export function Header({ hidden = false, smashedCount = 0 }: Readonly<HeaderProps>) {
  if (hidden) return null

  const title = getHeaderTitle(smashedCount)

  return (
    <header className="pointer-events-none fixed top-6 left-0 z-2000 w-full text-center">
      <div className="pointer-events-auto inline-flex max-w-[91vw] items-center justify-center gap-3 rounded-lg border border-black bg-white px-6 py-4 text-black shadow-md">
        <h1 className="inline-block font-sans text-2xl font-bold text-balance">{title}</h1>

        <a
          href="https://github.com/rcrdk/the-bug-is-on-the-table"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black bg-white text-black no-underline transition-all duration-200 hover:scale-105 hover:bg-neutral-50 hover:shadow-sm"
          aria-label="Visit rcrdk on GitHub"
        >
          <GithubIcon className="block stroke-[1.5]" size={20} aria-hidden />
        </a>
      </div>
    </header>
  )
}
