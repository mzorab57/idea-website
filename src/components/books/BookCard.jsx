import { Link } from 'react-router-dom'
import { getPopupImageUrl, placeholder } from '../../utils/image'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { BookOpen, User, Layers } from 'lucide-react'

function cn(...i) {
  return twMerge(clsx(i))
}

export default function BookCard({ book, className, categoryLabel }) {
  const title = book?.title || 'Untitled'
  const author =
    book?.author_names ||
    book?.author?.name ||
    (Array.isArray(book?.authors)
      ? book.authors
          .map((a) => (typeof a === 'string' ? a : a?.name))
          .filter(Boolean)
          .join('، ')
      : book?.author) ||
    ''
  const primaryAuthorObj =
    Array.isArray(book?.authors) &&
    book.authors.find((a) => typeof a === 'object' && (String(a?.role || '').toLowerCase() === 'author' || !a?.role) && a?.id)
  const authorId = book?.author?.id || primaryAuthorObj?.id
  const coverPath = book?.thumbnail || book?.image || book?.cover || book?.cover_url
  const cover = getPopupImageUrl(coverPath)
  const category = categoryLabel || book?.category_name || book?.category?.name
  const href = `/books/${book?.id}`

  return (
    <div
      dir="rtl"
      className={cn(
        'group relative bg-white border border-stone-100 flex flex-col h-full', // flex flex-col h-full زیادکراوە بۆ یەک قەبارەیی
        'transition-all duration-300',
        'hover:border-stone-200',
        'hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]',
        className
      )}
    >
      <Link onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} to={href} className="block">
        {/* ── Cover ── */}
        {/* aspect-[2/3] و p-2 زیادکراوە بۆ ئەوەی جێگەی وێنەکە دیاریکراو بێت */}
        <div className="relative overflow-hidden bg-stone-50 aspect-[2/3] flex items-center justify-center p-2">
          
          {/* image */}
          {/* object-contain زیادکراوە لەبری object-cover بۆ ئەوەی نەقرتێت */}
          <img
            src={cover}
            alt={title}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = placeholder()
            }}
            className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* overlay gradient — appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t
                          from-black/50 via-black/0 to-black/0
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-300" />

          {/* category badge — top right */}
          {category && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-x-1 rounded-full
                               bg-white/90 backdrop-blur-sm
                               border border-white/60
                               px-2.5 py-1 text-[10px] text-stone-700
                               shadow-sm">
                <Layers size={9} className="text-orange-400" />
                {category}
              </span>
            </div>
          )}

          {/* read button — appears on hover */}
          <div className="absolute bottom-3 right-3 left-3 z-10
                          opacity-0 translate-y-2
                          group-hover:opacity-100 group-hover:translate-y-0
                          transition-all duration-300">
            <span className="flex items-center justify-center gap-x-2
                             rounded-xl bg-white/95 backdrop-blur-sm
                             py-2.5 text-[12px] text-stone-800
                             shadow-lg">
              <BookOpen size={14} className="text-orange-500" />
              خوێندنەوە
            </span>
          </div>
        </div>
      </Link>

      {/* ── Info ── */}
      {/* flex-grow زیادکراوە بۆ ئەوەی بۆشاییە بەتاڵەکان پڕبکاتەوە و درێژی کارتەکان یەکسان بن */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* title */}
        <h3 className="text-[14px] leading-snug text-stone-800
                       line-clamp-2 group-hover:text-stone-900
                       transition-colors duration-200">
          {title}
        </h3>

        {/* author */}
        {author && (
          <div className="mt-2 flex items-center gap-x-1.5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center
                            rounded-full bg-stone-100
                            group-hover:bg-orange-50
                            transition-colors duration-200">
              <User size={10} className="text-stone-400
                                         group-hover:text-orange-500
                                         transition-colors duration-200" />
            </div>
            <Link
              to={authorId ? `/author/${authorId}` : author ? `/author?search=${encodeURIComponent(author)}` : '/author'}
              className="text-[12px] text-stone-400 line-clamp-1
                         group-hover:text-stone-500
                         transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {author}
            </Link>
          </div>
        )}

       
        {/* mt-auto زیادکراوە بۆ ئەوەی ئەم بەشە هەمیشە بچێتە خوارەوەی کارتەکە */}
        {/* <div className="mt-auto pt-3 group-hover:border-stone-100 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-300
                             group-hover:text-orange-400
                             transition-colors duration-300">
              {category ? `● ${category}` : ' '}
            </span>
            <span className="text-[10px] text-stone-300
                             opacity-0 -translate-x-2
                             group-hover:opacity-100 group-hover:translate-x-0
                             transition-all duration-300">
               بینین → 
            </span>
          </div>
        </div> */}
      </div>

      {/* bottom accent bar — grows on hover */}
      <span className="absolute bottom-0 right-4 left-4 h-[2px] rounded-full
                       bg-gradient-to-l from-orange-400 to-amber-300
                       scale-x-0 origin-center
                       group-hover:scale-x-100
                       transition-transform duration-300" />
    </div>
  )
}