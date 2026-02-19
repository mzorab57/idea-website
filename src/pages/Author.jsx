import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBooks, getAuthors } from '../services/public'
import BookCard from '../components/books/BookCard.jsx'
import Seo from '../seo/Seo.jsx'
import Skeleton from '../components/ui/Skeleton.jsx'
import { User, Search, BookOpen, ArrowRight, PenTool } from 'lucide-react'

export default function Author() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // State for searching authors locally
  const [searchTerm, setSearchTerm] = useState('')

  // Queries
  const authorsQuery = useQuery({ queryKey: ['authors'], queryFn: getAuthors })
  
  const booksQuery = useQuery({
    queryKey: ['books', { author_id: id }],
    queryFn: () => getBooks({ author_id: id, per_page: 24 }),
    enabled: !!id,
  })

  // --- VIEW 1: SINGLE AUTHOR PROFILE (If ID exists) ---
  if (id) {
    const authorName = authorsQuery.data?.find?.((a) => String(a.id) === String(id))?.name || 'نووسەر'
    const booksList = Array.isArray(booksQuery.data) ? booksQuery.data : booksQuery.data?.data || []
    const bookCount = booksQuery.data?.meta?.total || booksList.length

    return (
      <div className="min-h-screen bg-slate-50 pb-16">
        <Seo title={`${authorName} • Idea Foundation`} />
        
        {/* Author Header / Hero */}
        <div className="bg-white border-b border-slate-200">
           <div className="mx-auto max-w-6xl px-4 py-12">
              
              <button 
                onClick={() => navigate('/author')} 
                className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors"
              >
                 <ArrowRight size={16} />
                 گەڕانەوە بۆ لیستی نووسەران
              </button>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                 {/* Author Avatar / Placeholder */}
                 <div className="h-32 w-32 shrink-0 rounded-full bg-gradient-to-tr from-orange-100 to-white border-4 border-white shadow-xl flex items-center justify-center text-4xl font-serif font-bold text-orange-500">
                    {authorName.charAt(0)}
                 </div>
                 
                 <div className="text-center md:text-right flex-1">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3 flex items-center justify-center md:justify-start gap-3">
                       {authorName}
                       <span className="p-1.5 rounded-full bg-blue-50 text-blue-500"><PenTool size={18}/></span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
                       {/* Placeholder bio since API might not have it yet */}
                       تەواوی کتێب و بەرهەمەکانی {authorName} لەم بەشەدا دەست دەکەوێت.
                    </p>
                    
                    <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
                       <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                          <BookOpen size={16} />
                          {booksQuery.isLoading ? '...' : `${bookCount} کتێب بەردەستە`}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Books Grid */}
        <div className="mx-auto max-w-6xl px-4 py-12">
           <h2 className="text-xl font-bold text-slate-800 mb-6 border-r-4 border-orange-500 pr-3">
              بەرهەمەکانی نووسەر
           </h2>
           
           {booksQuery.isLoading ? (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-96 rounded-2xl" />)}
             </div>
           ) : booksList.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400">هیچ کتێبێک بۆ ئەم نووسەرە زیاد نەکراوە.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
               {booksList.map((b) => (
                 <BookCard key={b.id} book={b} />
               ))}
             </div>
           )}
        </div>
      </div>
    )
  }

  // --- VIEW 2: AUTHORS LIST (No ID) ---
  
  // Filter authors locally
  const filteredAuthors = (authorsQuery.data || []).filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Seo title="نووسەران • دەزگای ئایدیا" />
      
      {/* Header & Search */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
         <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                  <h1 className="text-3xl font-serif font-bold text-slate-900">نووسەران</h1>
                  <p className="text-slate-500 mt-2">لیستی هەموو نووسەرە بەردەستەکان</p>
               </div>
               
               {/* Search Bar */}
               <div className="relative w-full md:w-96">
                  <input 
                    type="text" 
                    placeholder="گەڕان بۆ نووسەر..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               </div>
            </div>
         </div>
      </div>

      {/* Authors Grid */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {authorsQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
             {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <Skeleton key={i} className="h-24 rounded-xl" />
             ))}
          </div>
        ) : filteredAuthors.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                 <User size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">هیچ نووسەرێک نەدۆزرایەوە</h3>
              <p className="text-slate-400 mt-1">تکایە دڵنیابەرەوە لە ڕاستنووسی ناوەکە.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredAuthors.map((a) => (
              <Link 
                key={a.id} 
                to={`/author/${a.id}`} 
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1"
              >
                {/* Avatar */}
                <div className="h-12 w-12 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
                   {a.name.charAt(0)}
                </div>
                
                {/* Name */}
                <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-slate-700 truncate group-hover:text-orange-700 transition-colors">
                      {a.name}
                   </h3>
                   <span className="text-xs text-slate-400 group-hover:text-orange-400 transition-colors">
                      بینینی پرۆفایل
                   </span>
                </div>

                <div className="text-slate-300 group-hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                   <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}