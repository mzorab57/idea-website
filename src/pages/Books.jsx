import { useQuery } from '@tanstack/react-query'
import { getBooks, getCategories, getAuthors } from '../services/public'
import BookCard from '../components/books/BookCard.jsx'
import SearchBar from '../components/common/SearchBar.jsx'
import Pagination from '../components/common/Pagination.jsx'
import useQueryParam, { useQueryParams } from '../hooks/useQueryParam'
import Seo from '../seo/Seo.jsx'

export default function Books() {
  const [params, setParams] = useQueryParams()
  const [search, setSearch] = useQueryParam('search', '')
  const [subcategory] = useQueryParam('subcategory', '')
  const [category] = useQueryParam('category', '')
  const page = Number(params.page || 1)
  const per_page = Number(params.per_page || 12)
  const category_id = params.category_id || ''
  const author_id = params.author_id || ''

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: authors } = useQuery({ queryKey: ['authors'], queryFn: getAuthors })
  const books = useQuery({
    queryKey: ['books', { page, per_page, category_id, author_id, search, subcategory, category }],
    queryFn: () => getBooks({ page, per_page, category_id, author_id, search, subcategory, category }),
  })

  const totalPages = Number(books.data?.meta?.total_pages || 10)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="Books • Idea Foundation" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <div className="space-y-4">
            <SearchBar
              initial={search}
              onSearch={(q) => {
                setSearch(q)
                setParams({ page: 1 })
              }}
            />
            <div>
              <label className="block text-sm text-slate-700 mb-1">Category</label>
              <select
                value={category_id}
                onChange={(e) => setParams({ category_id: e.target.value, page: 1 })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">All</option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Author</label>
              <select
                value={author_id}
                onChange={(e) => setParams({ author_id: e.target.value, page: 1 })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">All</option>
                {(authors || []).map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>
        <section className="md:col-span-3">
          {books.isLoading ? (
            <p className="text-slate-600">Loading…</p>
          ) : books.isError ? (
            <p className="text-red-600">Failed to load</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(books.data?.data || []).map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPage={(p) => setParams({ page: p })}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
