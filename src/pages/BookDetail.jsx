import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getBook, downloadBook } from '../services/public'
import Seo from '../seo/Seo.jsx'
import { useMemo } from 'react'

export default function BookDetail() {
  const { id } = useParams()

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id),
    enabled: !!id,
  })

  const download = useMutation({
    mutationFn: () => downloadBook(id),
    onSuccess: ({ url, blob, filename }) => {
      if (url) {
        const a = document.createElement('a')
        a.href = url
        a.rel = 'noopener'
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        a.remove()
        return
      }
      if (blob) {
        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = filename || 'download'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(objectUrl)
      }
    },
  })

  const title = book?.title || 'Book'
  const authorText = useMemo(() => {
    if (!book) return ''
    if (book.author_names) return book.author_names
    return [book.author?.name, Array.isArray(book.authors) ? book.authors.map(a => (typeof a === 'string' ? a : a?.name)).filter(Boolean).join(', ') : typeof book.author === 'string' ? book.author : ''].filter(Boolean).join(', ')
  }, [book])
  const description = book?.long_description || book?.short_description || book?.description

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-24 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-200 rounded w-40" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600 font-medium">Failed to load book</p>
        <p className="text-sm text-slate-600">{error?.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Seo title={`${title} • Idea Foundation`} description={description} />
      <h1 className="text-3xl font-serif tracking-tight text-slate-900">{title}</h1>
      {authorText ? (
        <p className="mt-2 text-slate-700">By {authorText}</p>
      ) : null}
      {description ? (
        <p className="mt-6 text-slate-800 leading-7">{description}</p>
      ) : (
        <p className="mt-6 text-slate-600">No description available.</p>
      )}
      <div className="mt-8">
        <button
          onClick={() => download.mutate()}
          disabled={download.isPending}
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {download.isPending ? 'Downloading…' : 'Download'}
        </button>
      </div>
    </div>
  )
}
