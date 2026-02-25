import { useQuery } from '@tanstack/react-query'
import { getBooks } from '../services/public'
import BookCard from '../components/books/BookCard.jsx'
import SearchBar from '../components/common/SearchBar.jsx'
import useQueryParam from '../hooks/useQueryParam'
import Seo from '../seo/Seo.jsx'

export default function Search() {
  const [q, setQ] = useQueryParam('q', '')
  const [legacySearch, setLegacySearch] = useQueryParam('search', '')
  const books = useQuery({
    queryKey: ['books', { q: q || legacySearch }],
    queryFn: () => getBooks({ q: q || legacySearch, per_page: 24 }),
    enabled: (q || legacySearch).length > 0,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="Search • Idea Foundation" />
      <h1 className="font-serif text-2xl text-slate-900 mb-4">Search</h1>
      <SearchBar
        initial={q || legacySearch}
        onSearch={(v) => {
          setQ(v)
          setLegacySearch('')
        }}
      />
      <div className="mt-6">
        {!(q || legacySearch) ? (
          <p className="text-slate-600">Type a query to search books.</p>
        ) : books.isLoading ? (
          <p className="text-slate-600">Searching…</p>
        ) : (books.data?.data || []).length === 0 ? (
          <p className="text-slate-600">No results for “{q || legacySearch}”.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {(books.data?.data || []).map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
