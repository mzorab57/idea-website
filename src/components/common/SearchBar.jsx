import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ initial = '', onSearch, placeholder = 'گەڕان...' }) {
  const [value, setValue] = useState(initial)

  useEffect(() => {
    setValue(initial)
  }, [initial])

  const submit = () => {
    if (typeof onSearch === 'function') onSearch(value.trim())
  }

  return (
    <div dir="rtl" className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        dir="ltr"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-300 bg-white px-9 py-2 text-sm text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
      />
      <button
        onClick={submit}
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-orange-600 text-white px-3 py-1 text-xs hover:bg-orange-500"
      >
        گەڕان
      </button>
    </div>
  )
}
