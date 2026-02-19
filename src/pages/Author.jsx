import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBooks, getAuthors } from '../services/public'
import BookCard from '../components/books/BookCard.jsx'
import Seo from '../seo/Seo.jsx'

export default function Author() {
  const { id } = useParams()
  const authors = useQuery({ queryKey: ['authors'], queryFn: getAuthors })
  const books = useQuery({
    queryKey: ['books', { author_id: id }],
    queryFn: () => getBooks({ author_id: id, per_page: 24 }),
    enabled: !!id,
  })

  if (!id) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Seo title="Authors • Idea Foundation" />
        <h1 className="font-serif text-2xl text-slate-900 mb-4">Authors</h1>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {(authors.data || []).map((a) => (
            <Link key={a.id} to={`/author/${a.id}`} className="rounded border border-slate-200 bg-white p-4 hover:bg-slate-50">
              <div className="text-slate-900">{a.name}</div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const title = authors.data?.find?.((a) => String(a.id) === String(id))?.name || 'Author'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title={`${title} • Idea Foundation`} />
      <h1 className="font-serif text-2xl text-slate-900 mb-4">{title}</h1>
      {books.isLoading ? (
        <p className="text-slate-600">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(Array.isArray(books.data) ? books.data : books.data?.data || []).map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  )
}
