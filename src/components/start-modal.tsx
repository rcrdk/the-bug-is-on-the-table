interface StartModalProps {
  onStart: () => void
}

export function StartModal({ onStart }: Readonly<StartModalProps>) {
  return (
    <div className="absolute inset-0 z-1000 flex items-center justify-center">
      <div className="shadow-modal relative z-1001 max-w-[91vw] rounded-2xl border border-black bg-white p-8 transition-all duration-300">
        <h2 className="mb-4 text-center text-2xl font-semibold text-balance">
          the <span className="line-through">book</span> bug is on the table
        </h2>
        <button
          type="button"
          onClick={onStart}
          className="mx-auto block rounded-full bg-black px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-800 hover:shadow-lg"
        >
          Let's <span className="line-through">read</span> hunt!
        </button>
      </div>
    </div>
  )
}
