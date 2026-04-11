import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAuthors, getAuthor, getAuthorBooks, getAuthorCategories } from '../services/public'
import BookCard from '../components/books/BookCard.jsx'
import Seo from '../seo/Seo.jsx'
import Skeleton from '../components/ui/Skeleton.jsx'
import { Search, ArrowRight } from 'lucide-react'
import useQueryParam from '../hooks/useQueryParam'
import { getPopupImageUrl, placeholder } from '../utils/image'

export default function Author() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useQueryParam('search', '')
  const [selectedCategoryId, setSelectedCategoryId] = useQueryParam('category_id', '')

  const authorsQuery = useQuery({ queryKey: ['authors'], queryFn: getAuthors })
  const authorQuery = useQuery({ queryKey: ['author', id], queryFn: () => getAuthor(id), enabled: !!id })
  const booksQuery = useQuery({ queryKey: ['author-books', { id, category_id: selectedCategoryId }], queryFn: () => getAuthorBooks(id, { category_id: selectedCategoryId || undefined }), enabled: !!id })
  const catsQuery = useQuery({ queryKey: ['author-categories', id], queryFn: () => getAuthorCategories(id), enabled: !!id })

  // --- VIEW 1: SINGLE AUTHOR ---
  if (id) {
    const authorName = authorQuery.data?.name || authorsQuery.data?.find?.((a) => String(a.id) === String(id))?.name || 'نووسەر'
    const authorImage = getPopupImageUrl(authorQuery.data?.image || authorQuery.data?.photo || authorQuery.data?.avatar || '') || ''
    const authorBio = authorQuery.data?.bio || authorQuery.data?.biography || authorQuery.data?.description || ''
    const booksList = Array.isArray(booksQuery.data) ? booksQuery.data : booksQuery.data?.data || []
    /* const bookCount = Number(booksQuery.data?.meta?.total || booksList.length) */
    const cats = Array.isArray(catsQuery.data) ? catsQuery.data : []

    return (
      <div dir="rtl" className="min-h-screen bg-white">
        <Seo title={`${authorName} • Idea Foundation`} />
        
        {/* Header */}
        <div className="relative border-y border-stone-100/80 bg-[#fcfcfa]">
          <div aria-hidden className="absolute inset-0 opacity-[0.6]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23EAEAE8' stroke-width='1'%3E%3Cpath d='M0 0l40 20L0 40zM40 20L80 0v40L40 60zM0 40l40 20L0 80zM40 60l40-20V80L40 100z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '120px' }} />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
            <button onClick={() => navigate('/author')} className="absolute top-5 right-4 sm:right-6 inline-flex items-center gap-1.5 text-[13px] text-stone-500 hover:text-orange-600">
              <ArrowRight size={16} /> گەڕانەوە
            </button>
            <h1 className="text-center text-[26px] font-[500] text-stone-800">{authorName}</h1>
            {/* <p className="mt-2 text-center text-[13px] text-stone-500">{booksQuery.isLoading ? '...' : `${bookCount} بەرهەم`}</p> */}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1000px] px-6 md:px-8 py-12">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Bio */}
            <div className="lg:col-span-8">
              {authorQuery.isLoading ? (
                <div className="space-y-3 animate-pulse"><div className="h-4 bg-stone-100 rounded w-full"/><div className="h-4 bg-stone-100 rounded w-5/6"/><div className="h-4 bg-stone-100 rounded w-4/6"/></div>
              ) : authorBio ? (
                <div className="text-[16.5px] leading-[2.15] text-[#333] text-justify" dangerouslySetInnerHTML={{__html: authorBio}} />
              ) : (
                <p className="text-[16.5px] leading-[2.1] text-stone-600">تەواوی کتێب و بەرهەمەکانی <strong className="text-stone-900">{authorName}</strong> لە خوارەوە ببینە.</p>
              )}
            </div>
            {/* Image */}
            <div className="lg:col-span-4">
              <div className="mx-auto w-fit">
                {authorImage ? (
                  <img src={authorImage} alt={authorName} onError={(e)=>{e.currentTarget.src=placeholder(300,300)}} className="size-80  object-cover border border-stone-200" />
                ) : (
                  <div className="h-48 w-48 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-5xl font-serif text-stone-400">{authorName.charAt(0)}</div>
                )}
              </div>
            </div>
          </div>

          {/* Books */}
          <div className="mt-16 pt-10 border-t border-stone-100">
            <h2 className="text-[19px] font-bold text-stone-900 mb-5">بەرهەمەکان</h2>
            
            {cats.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <button onClick={()=>setSelectedCategoryId('')} className={`px-4 py-1.5 text-[13px] rounded-full border transition ${!selectedCategoryId ? 'bg-orange-50 border-orange-300 text-orange-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>هەموو</button>
                {cats.map(c=> (
                  <button key={c.id} onClick={()=>setSelectedCategoryId(String(c.id))} className={`px-4 py-1.5 text-[13px] rounded-full border transition ${String(selectedCategoryId)===String(c.id) ? 'bg-orange-50 border-orange-300 text-orange-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>{c.name}</button>
                ))}
              </div>
            )}

            {booksQuery.isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[1,2,3,4].map(i=> <Skeleton key={i} className="h-80 rounded-2xl"/>)}</div>
            ) : booksList.length === 0 ? (
              <div className="py-16 text-center text-stone-500 border border-dashed rounded-2xl">هیچ کتێبێک نییە</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {booksList.map(b => <BookCard key={b.id} book={b} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // --- VIEW 2: AUTHORS LIST ---
  const filteredAuthors = (authorsQuery.data || []).filter(a => String(a?.name || '').toLowerCase().includes(String(searchTerm || '').toLowerCase()))

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <Seo title="نووسەران • دەزگای ئایدیا" />
      
      {/* Header */}
      <div className="relative border-y border-stone-100/80 bg-[#fcfcfa]">
        <div aria-hidden className="absolute inset-0 opacity-[0.6]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23EAEAE8' stroke-width='1'%3E%3Cpath d='M0 0l40 20L0 40zM40 20L80 0v40L40 60zM0 40l40 20L0 80zM40 60l40-20V80L40 100z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '120px' }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h1 className="text-center text-4xl  text-stone-800 tracking-wide">نووسەران</h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 -mt-8 pb-20 relative z-10">
        {/* Search */}
        <div className="relative mb-10">
          <input type="text" placeholder="گەڕان بۆ نووسەر..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full h-[48px] rounded-2xl border border-stone-200 bg-white pr-11 pl-4 text-[15px] shadow-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition" />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        </div>

        {authorsQuery.isLoading ? (
          <div className="divide-y divide-stone-100 border-y">{Array.from({length:8}).map((_,i)=><div key={i} className="py-4 flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full"/><Skeleton className="h-4 w-40"/></div>)}</div>
        ) : filteredAuthors.length === 0 ? (
          <div className="text-center py-20 text-stone-500">هیچ نووسەرێک نەدۆزرایەوە</div>
        ) : (
          <div className="bg-white rounded-2xl grid grid-cols-2 md:grid-cols-4 border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {filteredAuthors.map(a => (
              <Link key={a.id} to={`/author/${a.id}`} className="group flex items-center justify-between px-5 py-4 hover:bg-stone-50/70 transition">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-stone-100 flex items-center justify-center font-semibold text-stone-600 group-hover:bg-orange-100 group-hover:text-orange-700 transition">
                    {a.name?.charAt(0) || 'ن'}
                  </div>
                  <span className="text-[15.5px] text-stone-800 truncate group-hover:text-orange-700">{a.name}</span>
                </div>
                <ArrowRight size={18} className="text-stone-300 group-hover:text-orange-500 transition -scale-x-100" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
