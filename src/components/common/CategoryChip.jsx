import Badge from '../ui/Badge.jsx'

export default function CategoryChip({ category, onClick }) {
  const label = category?.name || category?.title || 'Category'
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center"
      aria-label={`Filter by ${label}`}
    >
      <Badge className="hover:bg-slate-200">{label}</Badge>
    </button>
  )
}

