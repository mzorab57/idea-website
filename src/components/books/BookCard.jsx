import { Link } from 'react-router-dom'
import { getPopupImageUrl, placeholder } from '../../utils/image'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

function cn(...i) {
  return twMerge(clsx(i))
}

export default function BookCard({ book, className }) {
  const title = book?.title || 'Untitled'
  const author =
    book?.author_names ||
    book?.author?.name ||
    (Array.isArray(book?.authors)
      ? book.authors.map((a) => (typeof a === 'string' ? a : a?.name)).filter(Boolean).join(', ')
      : book?.author) ||
    ''
  const coverPath = book?.thumbnail || book?.image || book?.cover || book?.cover_url
  const cover = getPopupImageUrl(coverPath)
  const category = book?.category_name || book?.category?.name
  const href = `/books/${book?.id}`

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-xl border border-slate-200 bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl',
        className
      )}
    >
      <Link to={href} className="block">
        <div className="overflow-hidden bg-slate-100">
          <img
            src={cover}
            alt={title}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = placeholder(400, 600)
            }}
            style={{ aspectRatio: '2 / 3' }}
            className="w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="font-serif text-sm font-light text-slate-900">{title}</h3>
          {author ? <p className="mt-1 text-sm text-slate-600">{author}</p> : null}
          {category ? (
            <div className="mt-3 inline-flex items-center rounded-full border border-[#d97706] px-3 py-0.5 text-xs text-[#a16207]">
              {category}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  )
}

