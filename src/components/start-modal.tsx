interface StartModalProps {
  onStart: () => void
}

export function StartModal({ onStart }: StartModalProps) {
  return (
    <div className="absolute inset-0 z-1000 flex items-center justify-center">
      <div className="shadow-modal relative z-1001 max-w-[91vw] rounded-2xl border-5 border-black bg-white p-8 transition-all duration-300">
        <h2 className="mb-6 max-w-[20rem] text-center text-4xl font-black text-balance">
          the <span className="line-through">book</span> bug is on the table
        </h2>

        <button
          type="button"
          onClick={onStart}
          className="mx-auto block cursor-pointer rounded-2xl border-[3px] border-black/30 bg-gradient-to-b from-red-500 via-red-600 to-red-700 px-8 py-4 text-lg font-bold text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_0_0_rgb(153,27,27),0_8px_12px_rgba(0,0,0,0.3)] transition-all duration-200 hover:translate-y-[1px] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_0_0_rgb(153,27,27),0_6px_10px_rgba(0,0,0,0.3)] active:translate-y-[3px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_0_0_rgb(153,27,27),0_3px_6px_rgba(0,0,0,0.2)]"
        >
          Let's <span className="line-through">read</span> hunt!
        </button>
      </div>
    </div>
  )
}
