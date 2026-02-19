import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { assetUrl } from '../../utils/url'
import { placeholder } from '../../utils/image'

function cn(...inputs) {
  return twMerge(clsx(inputs))
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
  const rawCover = book?.thumbnail || book?.cover || book?.cover_url || book?.image
  const cover = assetUrl(rawCover)
  const href = `/books/${book?.id}`

  return (
    <div className={cn('group overflow-hidden rounded-lg border border-slate-200 bg-white', className)}>
      <Link to={href} className="block">
        {cover ? (
          <img
            src={cover}
            alt={title}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = placeholder(400, 300)
            }}
            className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-slate-400">
            <span className="text-sm">No cover</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-serif text-lg text-slate-900">{title}</h3>
          {author ? <p className="mt-1 text-sm text-slate-600">{author}</p> : null}
        </div>
      </Link>
    </div>
  )
}
