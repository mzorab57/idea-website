import { useQuery } from '@tanstack/react-query'
import { getBooks } from '../services/public'
import BookCard from '../components/books/BookCard.jsx'
import SearchBar from '../components/common/SearchBar.jsx'
import useQueryParam from '../hooks/useQueryParam'
import Seo from '../seo/Seo.jsx'

export default function Search() {
  const [q, setQ] = useQueryParam('search', '')
  const books = useQuery({
    queryKey: ['books', { search: q }],
    queryFn: () => getBooks({ search: q, per_page: 24 }),
    enabled: q.length > 0,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="Search • Idea Foundation" />
      <h1 className="font-serif text-2xl text-slate-900 mb-4">Search</h1>
      <SearchBar initial={q} onSearch={(v) => setQ(v)} />
      <div className="mt-6">
        {!q ? (
          <p className="text-slate-600">Type a query to search books.</p>
        ) : books.isLoading ? (
          <p className="text-slate-600">Searching…</p>
        ) : (Array.isArray(books.data) ? books.data : books.data?.data || []).length === 0 ? (
          <p className="text-slate-600">No results for “{q}”.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {(Array.isArray(books.data) ? books.data : books.data?.data || []).map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
