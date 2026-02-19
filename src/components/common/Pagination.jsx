import Button from '../ui/Button.jsx'

export default function Pagination({ page = 1, totalPages = 1, onPage }) {
  const p = Number(page) || 1
  const prev = Math.max(1, p - 1)
  const next = Math.min(totalPages, p + 1)
  return (
    <div className="mt-6 flex items-center gap-2">
      <Button variant="outline" onClick={() => onPage(prev)} disabled={p <= 1}>
        Previous
      </Button>
      <span className="text-sm text-slate-700">
        Page {p} of {totalPages}
      </span>
      <Button variant="outline" onClick={() => onPage(next)} disabled={p >= totalPages}>
        Next
      </Button>
    </div>
  )
}

