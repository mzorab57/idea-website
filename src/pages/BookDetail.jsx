import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getBook, downloadBook } from '../services/public'
import Seo from '../seo/Seo.jsx'
import {
  Download,
  ChevronLeft,
  Share2,
  BookOpen,
  Eye,
  Hash,
  FileText,
  Clock,
  History,
  List,
} from 'lucide-react'
import Spinner from '../components/ui/Spinner.jsx'
import { getPopupImageUrl, placeholder } from '../utils/image'
import { authorNames, truncate } from '../utils/formatters'

export default function BookDetail() {
  const { id } = useParams()

  /* ─── Fetch book ─── */
  const { data: book, isLoading, isError, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id),
    enabled: !!id,
  })

  /* ─── Download mutation ─── */
  const download = useMutation({
    mutationFn: () => downloadBook(id),
    onSuccess: ({ url, blob, filename }) => {
      if (url) {
        window.open(url, '_blank')
        return
      }
      if (blob) {
        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = filename || 'idea-foundation-book.pdf'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(objectUrl)
      }
    },
  })

  /* ─── Derived data ─── */
  const title = book?.title || 'ناونیشانی کتێب'
  const cover = getPopupImageUrl(book?.thumbnail) || placeholder(400, 600)
  const categoryName = book?.category_name || 'گشتی'
  const subCategory = book?.subcategory_name
  const shortDesc = book?.short_description
  const longDesc = book?.long_description
  const description = longDesc || shortDesc || book?.description
  const metaTitle = book?.meta_title || title
  const metaDescription = book?.meta_description || truncate(description || '', 160)
  const viewCount = Number(book?.view_count || 0)
  const downloadCount = Number(book?.download_count || 0)
  const isFeatured = Number(book?.is_featured) === 1
  const createdAt = book?.created_at

  /* ─── Authors / Translators / Editors ─── */
  const authorsList = Array.isArray(book?.authors) ? book.authors : []

  const namesForRole = (role) =>
    authorsList
      .filter((a) => String(a?.role || '').toLowerCase() === role)
      .map((a) => (typeof a === 'string' ? a : a?.name))
      .filter(Boolean)
      .join('، ')

  const splitNames = (s) =>
    String(s || '')
      .split(/[،,]/)
      .map((x) => x.trim())
      .filter(Boolean)

  const fallbackNames = splitNames(book?.author_names)

  const authorText =
    namesForRole('author') || authorNames(book) || fallbackNames[0] || ''
  const translatorText =
    book?.translator_names ||
    namesForRole('translator') ||
    book?.translator ||
    fallbackNames[1] ||
    ''
  const editorText =
    book?.editor_names ||
    namesForRole('editor') ||
    book?.editor ||
    fallbackNames[2] ||
    ''

  /* ─── Specifications ─── */
  const rawSpecs = Array.isArray(book?.specifications)
    ? book.specifications
    : Array.isArray(book?.specs)
      ? book.specs
      : []

  const specGroups = rawSpecs
    .filter((s) => Number(s?.is_visible ?? 1) === 1)
    .reduce((acc, s) => {
      const g = String(s?.group ?? 'گشتی').trim() || 'گشتی'
      if (!acc[g]) acc[g] = []
      acc[g].push(s)
      return acc
    }, {})

  /* ─── People list ─── */
  const people = [
    { label: 'نووسەر', value: authorText },
    { label: 'وەرگێڕ', value: translatorText },
    { label: 'دەستکاریکەر', value: editorText },
  ].filter((p) => p.value)

  /* ─── File label ─── */
  const fileLabel = book?.file_key
    ? String(book.file_key).toLowerCase().includes('.pdf')
      ? 'PDF'
      : 'FILE'
    : null

  /* ─── Date formatter ─── */
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
      return new Date(dateStr).toLocaleDateString('ku', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  /* ─── Share handler ─── */
  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank',
        'width=600,height=400'
      )
    }
  }

  /* ─── Loading ─── */
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner size={40} />
      </div>
    )

  /* ─── Error ─── */
  if (isError)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white gap-4 px-6">
        <p className="text-base font-semibold text-stone-800">نەتوانرا کتێبەکە باربکرێت</p>
        <p className="text-sm text-stone-400">{error?.message}</p>
        <Link
          to="/books"
          className="mt-4 rounded-full bg-stone-900 px-6 py-2.5 text-sm text-white hover:bg-stone-800 transition-colors"
        >
          ← گەڕانەوە
        </Link>
      </div>
    )

  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans text-[#2d2d2d]">
      <Seo title={`${metaTitle} | دەزگای ئایدیا`} description={metaDescription} />

      {/* ═══ Breadcrumb ═══ */}
      <nav className="border-b border-stone-100 bg-stone-50/50">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="flex items-center gap-x-2 text-[13px] text-stone-400">
            <Link to="/" className="hover:text-stone-700 transition-colors">
              سەرەکی
            </Link>
            <ChevronLeft size={12} />
            <Link to="/books" className="hover:text-stone-700 transition-colors">
              کتێبەکان
            </Link>
            {categoryName && (
              <>
                <ChevronLeft size={12} />
                <span className="text-stone-500">{categoryName}</span>
              </>
            )}
            <ChevronLeft size={12} />
            <span className="text-stone-600 font-medium truncate max-w-[200px]">{title}</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* ═══ Header Section ═══ */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Cover Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Cover Image */}
              <div className="group relative overflow-hidden rounded-lg bg-white p-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={cover}
                  alt={title}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = placeholder(400, 600)
                  }}
                  className="w-full rounded-md object-cover shadow-sm"
                  style={{ aspectRatio: '3/4' }}
                />
                
                
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-stone-100 bg-stone-50 p-4 text-center">
                  <Eye size={18} className="mx-auto mb-2 text-stone-400" />
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-tight">بینین</p>
                  <p className="text-lg font-bold text-stone-800">{viewCount.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-stone-100 bg-stone-50 p-4 text-center">
                  <Download size={18} className="mx-auto mb-2 text-stone-400" />
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-tight">داونلۆد</p>
                  <p className="text-lg font-bold text-stone-800">{downloadCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:col-span-8">
            <div className="space-y-8">
            

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-3xl  leading-tight text-orange-400 lg:text-4xl">
                  {title}
                </h1>

                {/* People */}
                {people.length > 0 && (
                  <div className="flex flex-col gap-x-6 gap-y-2">
                    {people.map((p) => (
                      <div key={p.label} className="text-lg  text-stone-500">
                        <span className="text-stone-700">{p.label}:</span>{' '}
                        <span className="text-orange-400/90">{p.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Meta Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 border-y border-stone-100 py-4">
                {book?.id && (
                  <div className="flex items-center gap-2 text-stone-500 text-sm">
                    <Hash size={16} className="text-stone-300" />
                    <span>کۆدی کتێب: {book.id}</span>
                  </div>
                )}

                {fileLabel && (
                  <>
                    <div className="h-4 w-px bg-stone-200 hidden sm:block" />
                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                      <FileText size={16} className="text-stone-300" />
                      <span>جۆری فایل: {fileLabel}</span>
                    </div>
                  </>
                )}

                {createdAt && (
                  <>
                    <div className="h-4 w-px bg-stone-200 hidden sm:block" />
                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                      <Clock size={16} className="text-stone-300" />
                      <span>{formatDate(createdAt)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Short Description */}
              {shortDesc && (
                <div className="rounded-xl bg-stone-50 border border-stone-100 p-6">
                  <p className="text-lg leading-[2] text-stone-700">{shortDesc}</p>
                </div>
              )}

  {/* ═══ Specifications ═══ */}
        {Object.keys(specGroups).length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-3 border-r-4 border-[#7a814d] pr-4 mb-10">
              <List className="text-[#7a814d]" size={24} />
              <h2 className="text-2xl font-extrabold text-stone-800">تایبەتمەندیەکان</h2>
            </div>

            <div className="space-y-10 ">
              {Object.entries(specGroups).map(([groupName, items]) => (
                <div key={groupName} className=''>
                  {/* Group Name */}
                  <h3 className="text-lg  font-bold text-stone-700 mb-4 pb-2 border-b border-stone-100">
                    {groupName}
                  </h3>

                  {/* Spec Rows */}
                  <ul className="space-y-0">
                    {items.map((s, idx) => (
                      <li
                        key={`${groupName}-${idx}`}
                        className={[
                          'flex items-baseline gap-4 py-4 px-4 rounded-lg transition-colors',
                          idx % 2 === 0 ? 'bg-stone-50/50' : 'bg-white',
                          'hover:bg-[#7a814d]/5',
                        ].join(' ')}
                      >
                        <div className="h-2 w-2 rounded-full bg-stone-200 shrink-0 mt-1.5" />
                        <span className="w-40 shrink-0 text-sm font-bold text-stone-400">
                          {s?.spec_name || s?.name || '—'}
                        </span>
                        <span className="text-stone-700 font-medium whitespace-pre-line">
                          {s?.spec_value ?? s?.value ?? '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
          

              {/* Share */}
              <div className="pt-6">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-600 transition-all hover:bg-stone-50 hover:shadow-md active:scale-95"
                >
                  <Share2 size={18} className="text-blue-600" />
                  بڵاوکردنەوە
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Download CTA ═══ */}
        <section className="mt-24 rounded-3xl bg-orange-500/[0.02] border border-orange-500/10 p-12 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold text-stone-800 lg:text-3xl">
              داونلۆدکردنی کتێبی «{title}» بە شێوەی خۆڕایی
            </h2>
            <p className="text-stone-500">
              دەتوانیت لە ڕێگەی دوگمەی خوارەوە نووسخەی{' '}
              {fileLabel || 'PDF'} ی ئەم کتێبە بە کوالیتی بەرز داونلۆد بکەیت.
            </p>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => download.mutate()}
                disabled={download.isPending}
                className="group flex w-full max-w-md items-center justify-between rounded-full bg-orange-500 px-2 py-2 pr-8 text-white shadow-xl shadow-red-200 transition-all hover:bg-[#b03527] hover:shadow-2xl disabled:opacity-50"
              >
                <span className="text-lg font-bold">
                  داونلۆدکردنی {fileLabel || 'PDF'}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:rotate-12">
                  {download.isPending ? (
                    <Spinner size={20} className="text-white" />
                  ) : (
                    <Download size={24} />
                  )}
                </div>
              </button>
            </div>

            {download.isError && (
              <p className="text-sm text-red-500 mt-3">
                هەڵەیەک ڕویدا لە کاتی داونلۆدکردن. تکایە دووبارە هەوڵ بدەرەوە.
              </p>
            )}
          </div>
        </section>

          {/* Long Description */}
              {longDesc && (
                <div className="prose prose-stone max-w-none">
                  <p className="text-xl leading-[2] text-stone-700 whitespace-pre-line">
                    {longDesc}
                  </p>
                </div>
              )}

        {/* ═══ Author Section ═══ */}
        {authorText && (
          <section className="mt-24 overflow-hidden rounded-3xl border border-stone-100 bg-[#fcfcfc] p-10">
            <div className="flex flex-col gap-10 lg:flex-row">
              <div className="h-32 w-32 shrink-0 rounded-2xl bg-[#d4d9b3]/20 flex items-center justify-center text-[#7a814d]">
                <BookOpen size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-stone-800">
                  دەربارەی نووسەر: {authorText}
                </h2>
                <p className="text-lg leading-[1.8] text-stone-600">
                  {book?.author_bio ||
                    `دەزگای ئایدیا شانازی دەکات بە بڵاوکردنەوەی کارەکانی "${authorText}". بۆ بینینی هەموو کتێبەکانی ئەم نووسەرە سەردانی بەشی نووسەرەکان بکە.`}
                </p>
                <Link
                  to="/author"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:underline"
                >
                  بینینی هەموو نووسەرەکان
                  <ChevronLeft size={14} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}