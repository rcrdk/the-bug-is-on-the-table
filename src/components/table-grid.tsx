import { TABLE } from '@/constants/table-grid'
import { useColumnCount } from '@/hooks/use-column-count'

export function TableGrid() {
  const columnCount = useColumnCount()

  return (
    <table className="absolute inset-0 h-full w-full border-collapse">
      <tbody className="divide-y divide-black">
        {Array.from({ length: TABLE.ROWS }).map((_, row) => (
          <tr key={row} className="divide-x divide-black">
            {Array.from({ length: columnCount }).map((_, col) => (
              <td key={col} className="p-0" />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
