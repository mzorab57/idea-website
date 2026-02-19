import { useQuery } from '@tanstack/react-query'
import { getBooks, getCategories, getAuthors } from '../services/public'
import BookCard from '../components/books/BookCard.jsx'
import Pagination from '../components/common/Pagination.jsx'
import useQueryParam, { useQueryParams } from '../hooks/useQueryParam'
import Seo from '../seo/Seo.jsx'
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  X,
  ChevronDown,
  ChevronLeft,
  Layers,
  User,
  Filter,
  Grid3X3,
  LayoutGrid,
  List,
} from 'lucide-react'
import { useState, useMemo } from 'react'

export default function Books() {
  const [params, setParams] = useQueryParams()
  const [search, setSearch] = useQueryParam('search', '')
  const [subcategory, setSubcategory] = useQueryParam('subcategory', '')
  const [category, setCategory] = useQueryParam('category', '')

  const page = Number(params.page || 1)
  const per_page = Number(params.per_page || 12)
  const category_id = params.category_id || ''
  const author_id = params.author_id || ''

  const [searchInput, setSearchInput] = useState(search)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedCat, setExpandedCat] = useState(null)

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: getAuthors,
  })
  const books = useQuery({
    queryKey: ['books', { page, per_page, category_id, author_id, search, subcategory, category }],
    queryFn: () =>
      getBooks({ page, per_page, category_id, author_id, search, subcategory, category }),
  })

  const totalPages = Number(books.data?.meta?.total_pages || 10)
  const bookList = books.data?.data || []
  const totalBooks = books.data?.meta?.total || bookList.length

  /* active filters count */
  const activeFilters = useMemo(() => {
    let count = 0
    if (search) count++
    if (category) count++
    if (subcategory) count++
    if (category_id) count++
    if (author_id) count++
    return count
  }, [search, category, subcategory, category_id, author_id])

  const clearAll = () => {
    setSearch('')
    setSearchInput('')
    setSubcategory('')
    setCategory('')
    setParams({ page: 1, category_id: '', author_id: '' })
    setExpandedCat(null)
  }

  /* find active category name */
  const activeCatName = useMemo(() => {
    if (category) {
      const c = categories.find(
        (cat) => cat.slug === category || cat.name === category
      )
      return c?.name || category
    }
    if (category_id) {
      const c = categories.find((cat) => String(cat.id) === String(category_id))
      return c?.name || ''
    }
    return ''
  }, [category, category_id, categories])

  const activeSubName = useMemo(() => {
    if (!subcategory) return ''
    for (const c of categories) {
      const sub = (c.subcategories || []).find(
        (s) => s.slug === subcategory || s.name === subcategory
      )
      if (sub) return sub.name
    }
    return subcategory
  }, [subcategory, categories])

  return (
    <div dir="rtl" className="min-h-screen bg-[#fafaf9]">
      <Seo title="کتێبەکان • Idea Foundation" />

      {/* ═══════════════════════════════════
          PAGE HEADER
      ═══════════════════════════════════ */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-x-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl
                                bg-gradient-to-br from-orange-400 to-amber-500
                                shadow-lg shadow-orange-200/40">
                  <BookOpen size={18} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-stone-900">کتێبەکان</h1>
              </div>
              <p className="text-[13px] text-stone-400">
                {books.isLoading
                  ? 'چاوەڕوان بە...'
                  : `${totalBooks} کتێب دۆزرایەوە`}
                {activeCatName && (
                  <span className="text-stone-500">
                    {' '}لە <span className="font-semibold text-orange-600">{activeCatName}</span>
                  </span>
                )}
                {activeSubName && (
                  <span className="text-stone-500">
                    {' '}› <span className="font-semibold text-orange-600">{activeSubName}</span>
                  </span>
                )}
              </p>
            </div>

            {/* search bar — desktop */}
            <div className="hidden sm:block relative w-72">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2
                                 h-4 w-4 text-stone-300" />
              <input
                dir="rtl"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearch(searchInput)
                    setParams({ page: 1 })
                  }
                }}
                placeholder="گەڕان بۆ کتێب..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50
                           py-2.5 pr-10 pl-3 text-[13px] text-stone-700
                           placeholder:text-stone-300 outline-none
                           focus:border-orange-300 focus:bg-white
                           focus:shadow-[0_0_0_3px_rgba(251,146,60,0.06)]
                           transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('')
                    setSearch('')
                    setParams({ page: 1 })
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2
                             text-stone-300 hover:text-stone-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* active filter tags */}
          {activeFilters > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-[11px] text-stone-400">فلتەرەکان:</span>

              {search && (
                <span className="inline-flex items-center gap-x-1.5 rounded-full
                                 bg-orange-50 border border-orange-200
                                 px-3 py-1 text-[11px] font-medium text-orange-700">
                  "{search}"
                  <button onClick={() => { setSearch(''); setSearchInput(''); setParams({ page: 1 }) }}>
                    <X size={11} />
                  </button>
                </span>
              )}

              {activeCatName && (
                <span className="inline-flex items-center gap-x-1.5 rounded-full
                                 bg-stone-100 border border-stone-200
                                 px-3 py-1 text-[11px] font-medium text-stone-600">
                  <Layers size={10} />
                  {activeCatName}
                  <button onClick={() => {
                    setCategory('')
                    setSubcategory('')
                    setParams({ category_id: '', page: 1 })
                    setExpandedCat(null)
                  }}>
                    <X size={11} />
                  </button>
                </span>
              )}

              {activeSubName && (
                <span className="inline-flex items-center gap-x-1.5 rounded-full
                                 bg-amber-50 border border-amber-200
                                 px-3 py-1 text-[11px] font-medium text-amber-700">
                  <Grid3X3 size={10} />
                  {activeSubName}
                  <button onClick={() => { setSubcategory(''); setParams({ page: 1 }) }}>
                    <X size={11} />
                  </button>
                </span>
              )}

              {author_id && (
                <span className="inline-flex items-center gap-x-1.5 rounded-full
                                 bg-sky-50 border border-sky-200
                                 px-3 py-1 text-[11px] font-medium text-sky-700">
                  <User size={10} />
                  {(authors || []).find((a) => String(a.id) === String(author_id))?.name || 'نووسەر'}
                  <button onClick={() => setParams({ author_id: '', page: 1 })}>
                    <X size={11} />
                  </button>
                </span>
              )}

              <button
                onClick={clearAll}
                className="text-[11px] text-stone-400 hover:text-red-500
                           underline underline-offset-2 transition-colors mr-2"
              >
                پاککردنەوەی هەمووی
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════
          MOBILE: search + filter toggle
      ═══════════════════════════════════ */}
      <div className="sm:hidden bg-white border-b border-stone-100 px-4 py-3
                      flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2
                             h-4 w-4 text-stone-300" />
          <input
            dir="rtl"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearch(searchInput)
                setParams({ page: 1 })
              }
            }}
            placeholder="گەڕان..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50
                       py-2.5 pr-10 pl-3 text-[13px] outline-none
                       focus:border-orange-300 transition-all"
          />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative flex h-10 w-10 items-center justify-center
                     rounded-xl border border-stone-200
                     text-stone-500 hover:bg-stone-50 transition-colors"
        >
          <SlidersHorizontal size={16} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -left-1 flex h-4 w-4
                             items-center justify-center rounded-full
                             bg-orange-500 text-[9px] font-bold text-white">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* ── SIDEBAR ── */}
          <aside className={[
            'lg:col-span-1',
            sidebarOpen ? 'block' : 'hidden lg:block',
          ].join(' ')}>
            <div className="sticky top-[140px] space-y-5">

              {/* Categories + Subcategories */}
              <div className="rounded-2xl bg-white border border-stone-100 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5
                                border-b border-stone-100">
                  <div className="flex items-center gap-x-2">
                    <Layers size={14} className="text-orange-400" />
                    <span className="text-[13px] font-semibold text-stone-800">
                      پۆل و ژێرپۆل
                    </span>
                  </div>
                  {(category || category_id || subcategory) && (
                    <button
                      onClick={() => {
                        setCategory('')
                        setSubcategory('')
                        setParams({ category_id: '', page: 1 })
                        setExpandedCat(null)
                      }}
                      className="text-[10px] text-stone-400 hover:text-red-500
                                 transition-colors"
                    >
                      پاککردنەوە
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto
                                scrollbar-thin scrollbar-thumb-stone-100
                                scrollbar-track-transparent">
                  {(categories || []).map((c) => {
                    const isExpanded = expandedCat === c.id
                    const isActive =
                      category === (c.slug || c.name) ||
                      String(category_id) === String(c.id)
                    const subs = c.subcategories || []

                    return (
                      <div key={c.id} className="border-b border-stone-50 last:border-0">
                        {/* category row */}
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              setCategory(c.slug || c.name)
                              setSubcategory('')
                              setParams({ category_id: '', page: 1 })
                              setExpandedCat(isExpanded ? null : c.id)
                            }}
                            className={[
                              'flex-1 flex items-center gap-x-2.5 px-4 py-3',
                              'text-right transition-all duration-150',
                              isActive
                                ? 'bg-orange-50/60 text-orange-700'
                                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800',
                            ].join(' ')}
                          >
                            {/* dot */}
                            <span className={[
                              'h-1.5 w-1.5 rounded-full shrink-0 transition-colors',
                              isActive ? 'bg-orange-400' : 'bg-stone-200',
                            ].join(' ')} />

                            <span className="text-[13px] font-medium flex-1">{c.name}</span>

                            {subs.length > 0 && (
                              <span className={[
                                'text-[10px] rounded-full px-1.5 py-0.5',
                                isActive
                                  ? 'bg-orange-100 text-orange-600'
                                  : 'bg-stone-100 text-stone-400',
                              ].join(' ')}>
                                {subs.length}
                              </span>
                            )}
                          </button>

                          {subs.length > 0 && (
                            <button
                              onClick={() => setExpandedCat(isExpanded ? null : c.id)}
                              className="px-3 py-3 text-stone-300 hover:text-stone-500
                                         transition-colors"
                            >
                              <ChevronDown
                                size={13}
                                className={[
                                  'transition-transform duration-200',
                                  isExpanded ? 'rotate-180' : '',
                                ].join(' ')}
                              />
                            </button>
                          )}
                        </div>

                        {/* subcategories */}
                        {isExpanded && subs.length > 0 && (
                          <div className="bg-stone-50/50 border-t border-stone-100
                                          px-4 py-2 space-y-0.5">
                            {subs.map((s) => {
                              const isSubActive =
                                subcategory === (s.slug || s.name)
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => {
                                    setSubcategory(s.slug || s.name)
                                    setParams({ page: 1 })
                                  }}
                                  className={[
                                    'flex items-center gap-x-2 w-full rounded-lg',
                                    'px-3 py-2 text-right transition-all duration-150',
                                    isSubActive
                                      ? 'bg-white text-orange-700 shadow-sm border border-orange-200'
                                      : 'text-stone-500 hover:bg-white hover:text-stone-700',
                                  ].join(' ')}
                                >
                                  <span className={[
                                    'h-1 w-1 rounded-full shrink-0',
                                    isSubActive ? 'bg-orange-400' : 'bg-stone-300',
                                  ].join(' ')} />
                                  <span className="text-[12px] font-medium">
                                    {s.name}
                                  </span>
                                  {isSubActive && (
                                    <ChevronLeft size={11}
                                      className="text-orange-400 mr-auto" />
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Authors */}
              <div className="rounded-2xl bg-white border border-stone-100 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5
                                border-b border-stone-100">
                  <div className="flex items-center gap-x-2">
                    <User size={14} className="text-sky-400" />
                    <span className="text-[13px] font-semibold text-stone-800">
                      نووسەرەکان
                    </span>
                  </div>
                  {author_id && (
                    <button
                      onClick={() => setParams({ author_id: '', page: 1 })}
                      className="text-[10px] text-stone-400 hover:text-red-500
                                 transition-colors"
                    >
                      پاککردنەوە
                    </button>
                  )}
                </div>

                <div className="max-h-[250px] overflow-y-auto
                                scrollbar-thin scrollbar-thumb-stone-100
                                scrollbar-track-transparent">
                  {(authors || []).map((a) => {
                    const isActive = String(author_id) === String(a.id)
                    return (
                      <button
                        key={a.id}
                        onClick={() => setParams({ author_id: a.id, page: 1 })}
                        className={[
                          'flex items-center gap-x-2.5 w-full px-4 py-2.5',
                          'text-right border-b border-stone-50 last:border-0',
                          'transition-all duration-150',
                          isActive
                            ? 'bg-sky-50/60 text-sky-700'
                            : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700',
                        ].join(' ')}
                      >
                        {/* avatar */}
                        <div className={[
                          'flex h-7 w-7 shrink-0 items-center justify-center',
                          'rounded-full text-[10px] font-bold',
                          isActive
                            ? 'bg-sky-100 text-sky-600'
                            : 'bg-stone-100 text-stone-400',
                        ].join(' ')}>
                          {a.name?.charAt(0)}
                        </div>
                        <span className="text-[12px] font-medium flex-1">
                          {a.name}
                        </span>
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* ── BOOKS GRID ── */}
          <section className="lg:col-span-3">

            {/* results bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[12px] text-stone-400">
                {books.isLoading ? (
                  <span className="animate-pulse">چاوەڕوان بە...</span>
                ) : (
                  <>
                    پەڕە <span className="font-semibold text-stone-600">{page}</span>
                    {' '}لە{' '}
                    <span className="font-semibold text-stone-600">{totalPages}</span>
                  </>
                )}
              </p>
            </div>

            {/* loading */}
            {books.isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-white
                                          border border-stone-100 overflow-hidden">
                    <div className="h-52 bg-stone-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 rounded-full bg-stone-100" />
                      <div className="h-3 w-1/2 rounded-full bg-stone-50" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* error */}
            {books.isError && (
              <div className="rounded-2xl bg-red-50 border border-red-200
                              px-6 py-12 text-center">
                <p className="text-red-500 text-[14px] font-medium">
                  هەڵەیەک ڕوویدا لە بارکردنی کتێبەکان
                </p>
                <button
                  onClick={() => books.refetch()}
                  className="mt-3 text-[12px] text-red-400 underline
                             hover:text-red-600 transition-colors"
                >
                  دووبارە هەوڵبدەرەوە
                </button>
              </div>
            )}

            {/* books */}
            {!books.isLoading && !books.isError && (
              <>
                {bookList.length === 0 ? (
                  <div className="rounded-2xl bg-white border-2 border-dashed
                                  border-stone-200 px-6 py-20 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center
                                    rounded-2xl bg-stone-50">
                      <BookOpen size={22} className="text-stone-300" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-stone-700 mb-1">
                      کتێب نەدۆزرایەوە
                    </h3>
                    <p className="text-[12px] text-stone-400 mb-4">
                      فلتەرەکان بگۆڕە یان گەڕانەکە بگۆڕە
                    </p>
                    {activeFilters > 0 && (
                      <button
                        onClick={clearAll}
                        className="rounded-full bg-stone-900 px-5 py-2
                                   text-[12px] font-semibold text-white
                                   hover:bg-stone-800 transition-colors"
                      >
                        پاککردنەوەی فلتەرەکان
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {bookList.map((b) => (
                      <BookCard key={b.id} book={b} />
                    ))}
                  </div>
                )}

                {/* pagination */}
                {bookList.length > 0 && totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <div className="inline-flex items-center gap-x-1 rounded-2xl
                                    bg-white border border-stone-100 p-1.5 shadow-sm">
                      <button
                        disabled={page <= 1}
                        onClick={() => setParams({ page: page - 1 })}
                        className="flex h-9 w-9 items-center justify-center rounded-xl
                                   text-stone-400 hover:bg-stone-50 hover:text-stone-700
                                   disabled:opacity-30 disabled:cursor-not-allowed
                                   transition-all"
                      >
                        <ChevronLeft size={16} className="rotate-180" />
                      </button>

                      {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                        let p
                        if (totalPages <= 7) {
                          p = i + 1
                        } else if (page <= 4) {
                          p = i + 1
                        } else if (page >= totalPages - 3) {
                          p = totalPages - 6 + i
                        } else {
                          p = page - 3 + i
                        }

                        return (
                          <button
                            key={p}
                            onClick={() => setParams({ page: p })}
                            className={[
                              'flex h-9 w-9 items-center justify-center rounded-xl',
                              'text-[13px] font-medium transition-all',
                              p === page
                                ? 'bg-stone-900 text-white shadow-sm'
                                : 'text-stone-500 hover:bg-stone-50',
                            ].join(' ')}
                          >
                            {p}
                          </button>
                        )
                      })}

                      <button
                        disabled={page >= totalPages}
                        onClick={() => setParams({ page: page + 1 })}
                        className="flex h-9 w-9 items-center justify-center rounded-xl
                                   text-stone-400 hover:bg-stone-50 hover:text-stone-700
                                   disabled:opacity-30 disabled:cursor-not-allowed
                                   transition-all"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}