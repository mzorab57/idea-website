import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBooks, getCategories } from '../services/public'
import BookCard from '../components/books/BookCard.jsx'
import Seo from '../seo/Seo.jsx'

export default function Category() {
  const { id } = useParams()
  const categories = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const books = useQuery({
    queryKey: ['books', { category_id: id }],
    queryFn: () => getBooks({ category_id: id, per_page: 24 }),
    enabled: !!id,
  })

  if (!id) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Seo title="Categories • Idea Foundation" />
        <h1 className="font-serif text-2xl text-slate-900 mb-4">Categories</h1>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {(categories.data || []).map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} className="rounded border border-slate-200 bg-white p-4 hover:bg-slate-50">
              <div className="text-slate-900">{c.name}</div>
              {c.count ? <div className="text-sm text-slate-600">{c.count} books</div> : null}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const title = categories.data?.find?.((c) => String(c.id) === String(id))?.name || 'Category'

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
