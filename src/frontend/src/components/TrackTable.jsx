import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table'
import { useState, useEffect } from 'react'
import "./TrackTable.css"

const columns = [
  { accessorKey: 'track_name', header: 'Track' },
  { accessorKey: 'bpm', header: 'BPM' },
  { accessorKey: 'key', header: 'Key' },
  { accessorKey: 'mode', header: 'Mode' },
  { accessorKey: 'camelot', header: 'Camelot' }
]

export default function TrackTable({ trackData }) {
  // dropdown menu states
  const [openMenuIndex, setOpenMenuIndex] = useState(null)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  // table states
  const [sorting, setSorting] = useState([])

  const handleRowClick = (e, row) => {
    e.stopPropagation()
    const cellBottom = e.currentTarget.getBoundingClientRect().bottom
    setMenuPosition({ x: e.clientX, y: cellBottom })
    setOpenMenuIndex(openMenuIndex === row.index ? null : row.index)
  }

  // close dropdown menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuIndex(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const table = useReactTable({
    data: trackData,
    columns, // defined above the component
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div style={{ paddingBottom: "1.5rem" }}>
      <table className="track-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="track-table-header"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
            key={row.id}
            className="track-table-row"
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="track-table-cell"
                  style={{ position: undefined }}
                  onClick={(e) => handleRowClick(e, row)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  {openMenuIndex === row.index && (
                    <div className="track-dropdown" style={{ position: "fixed", top: menuPosition.y, left: menuPosition.x }}>
                      <button onClick={(e) => { e.stopPropagation(); console.log("DELETE TEST"); setOpenMenuIndex(null) }}>
                        Delete
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); console.log("UPDATE TEST"); setOpenMenuIndex(null) }}>
                        Update track data
                      </button>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
