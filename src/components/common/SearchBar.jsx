import { useState } from 'react'
import Button from '../ui/Button.jsx'

export default function SearchBar({ initial = '', onSearch, placeholder = 'Search books…' }) {
  const [q, setQ] = useState(initial)
  return (
    <div className="flex items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch(q)
        }}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        placeholder={placeholder}
      />
      <Button onClick={() => onSearch(q)}>Search</Button>
    </div>
  )
}

