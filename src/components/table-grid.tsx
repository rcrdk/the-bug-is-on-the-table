const TABLE_ROWS = 32
const TABLE_COLS = 14

export function TableGrid() {
  return (
    <table className="absolute inset-0 h-full w-full border-collapse">
      <tbody>
        {Array.from({ length: TABLE_ROWS }).map((_, row) => (
          <tr key={row}>
            {Array.from({ length: TABLE_COLS }).map((_, col) => (
              <td key={col} className="border border-black p-0" />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
