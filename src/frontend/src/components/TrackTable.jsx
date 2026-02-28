import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table'
import { useState } from 'react'
import "./TrackTable.css"

const columns = [
  { accessorKey: 'track_name', header: 'Track' },
  { accessorKey: 'bpm', header: 'BPM' },
  { accessorKey: 'key', header: 'Key' },
  { accessorKey: 'mode', header: 'Mode' },
  { accessorKey: 'camelot', header: 'Camelot' }
]

export default function TrackTable({ trackData }) {
  const [sorting, setSorting] = useState([])

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
            <tr key={row.id} className="track-table-row">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="track-table-cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
