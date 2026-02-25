import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getBook, downloadBook } from '../services/public'
import Seo from '../seo/Seo.jsx'
import {
  Download,
  Eye,
  ArrowLeft,
  Star,
  FileText,
  Layers,
  User,
  Calendar,
  Hash,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Bookmark,
  FolderOpen,
  Feather,
  Languages,
  PenLine,
  ScrollText,
  AlignRight,
} from 'lucide-react'
import Spinner from '../components/ui/Spinner.jsx'
import { getPopupImageUrl, placeholder } from '../utils/image'
import { authorNames, truncate } from '../utils/formatters'

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
  const authorText = namesForRole('author') || authorNames(book) || fallbackNames[0] || ''
  const translatorText =
    book?.translator_names || namesForRole('translator') || book?.translator || fallbackNames[1] || ''
  const editorText = book?.editor_names || namesForRole('editor') || book?.editor || fallbackNames[2] || ''
  const description = book?.long_description || book?.short_description || book?.description
  const metaTitle = book?.meta_title || title
  const metaDescription = book?.meta_description || truncate(description || '', 170)
  const cover = getPopupImageUrl(book?.thumbnail) || placeholder(400, 600)
  const isFeatured = Number(book?.is_featured) === 1
  const isActive = Number(book?.is_active) === 1
  const categoryName = book?.category_name
  const subcategoryName = book?.subcategory_name
  const fileLabel = book?.file_key
    ? String(book.file_key).toLowerCase().includes('.pdf')
      ? 'PDF'
      : 'FILE'
    : null

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
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

  const rawSpecs = Array.isArray(book?.specifications)
    ? book.specifications
    : Array.isArray(book?.specs)
      ? book.specs
      : []
  const specGroups = rawSpecs
    .filter((s) => Number(s?.is_visible ?? 1) === 1)
    .reduce((acc, s) => {
      const g = String(s?.group ?? s?.['group'] ?? 'گشتی').trim() || 'گشتی'
      if (!acc[g]) acc[g] = []
      acc[g].push(s)
      return acc
    }, {})

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#faf9f7]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-white border border-stone-200/60 p-5">
                <div className="aspect-[2/3] rounded-xl bg-stone-100" />
                <div className="mt-5 h-12 rounded-xl bg-stone-100" />
                <div className="mt-3 h-12 rounded-xl bg-stone-100" />
              </div>
            </div>
            <div className="lg:col-span-8 space-y-5">
              <div className="rounded-2xl bg-white border border-stone-200/60 p-6">
                <div className="h-8 w-2/3 rounded-lg bg-stone-100" />
                <div className="mt-4 h-5 w-1/3 rounded bg-stone-100" />
                <div className="mt-3 h-5 w-1/4 rounded bg-stone-100" />
              </div>
              <div className="rounded-2xl bg-white border border-stone-200/60 p-6">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 rounded bg-stone-100" style={{ width: `${90 - i * 8}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Error ─── */
  if (isError) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#faf9f7]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
          <div className="rounded-2xl bg-white border border-stone-200/60 p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <XCircle size={24} className="text-red-400" />
            </div>
            <div className="text-base font-semibold text-stone-800">نەتوانرا کتێبەکە باربکرێت</div>
            <div className="mt-2 text-sm text-stone-400">{error?.message}</div>
            <div className="mt-6">
              <Link
                to="/books"
                className="inline-flex items-center gap-x-2 rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <ArrowLeft size={16} className="text-amber-500" />
                گەڕانەوە بۆ کتێبەکان
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#faf9f7]">
      <Seo title={`${metaTitle} • Idea Foundation`} description={metaDescription} />

      {/* ═══ Breadcrumb Bar ═══ */}
      <div className="border-b border-stone-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2 text-[13px] text-stone-400">
              <Link to="/" className="hover:text-stone-700 transition-colors">سەرەکی</Link>
              <span className="text-stone-300">/</span>
              <Link to="/books" className="hover:text-stone-700 transition-colors">کتێبەکان</Link>
              {categoryName && (
                <>
                  <span className="text-stone-300">/</span>
                  <span className="text-stone-500">{categoryName}</span>
                </>
              )}
            </div>
            <Link
              to="/books"
              className="inline-flex items-center gap-x-1.5 text-[13px] text-stone-500 hover:text-stone-800 transition-colors"
            >
              <ArrowLeft size={14} className="text-amber-500" />
              گەڕانەوە
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Left: Cover + Actions ── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-[90px] space-y-5">
              {/* Cover Card */}
              <div className="rounded-2xl bg-white border border-stone-200/60 overflow-hidden">
                <div className="relative p-5 bg-gradient-to-b from-stone-50 to-white">
                  <img
                    src={cover}
                    alt={title}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = placeholder(400, 600)
                    }}
                    className="w-full rounded-xl object-cover shadow-lg ring-1 ring-black/5"
                    style={{ aspectRatio: '2 / 3' }}
                    loading="eager"
                  />
                  {isFeatured && (
                    <div className="absolute top-8 right-8">
                      <span className="inline-flex items-center gap-x-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                        <Star size={10} className="fill-white" />
                        دیاری کراو
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 space-y-2.5 border-t border-stone-100">
                  <button
                    onClick={() => download.mutate()}
                    disabled={download.isPending}
                    className="group w-full inline-flex items-center justify-center gap-x-2.5 rounded-xl bg-[#0f172a] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#1e293b] disabled:opacity-50 transition-colors duration-200"
                  >
                    {download.isPending ? (
                      <Spinner size={16} className="text-white" />
                    ) : (
                      <Download size={16} className="text-amber-400 group-hover:translate-y-0.5 transition-transform" />
                    )}
                    داونلۆدکردن
                  </button>
                  <Link
                    to="/books"
                    className="w-full inline-flex items-center justify-center gap-x-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    <ArrowLeft size={15} className="text-amber-500" />
                    گەڕانەوە بۆ لیست
                  </Link>
                </div>
              </div>

              {/* Quick Stats (mobile-friendly) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white border border-stone-200/60 p-4 text-center">
                  <Eye size={18} className="mx-auto text-sky-500 mb-1.5" />
                  <div className="text-lg font-bold text-stone-800">{Number(book?.view_count || 0).toLocaleString()}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">بینین</div>
                </div>
                <div className="rounded-xl bg-white border border-stone-200/60 p-4 text-center">
                  <Download size={18} className="mx-auto text-indigo-500 mb-1.5" />
                  <div className="text-lg font-bold text-stone-800">{Number(book?.download_count || 0).toLocaleString()}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">داونلۆد</div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Right: Book Info ── */}
          <section className="lg:col-span-8 space-y-6">

            {/* ─── 1. Book Name / Author / Translator ─── */}
            <div className="rounded-2xl bg-white border border-stone-200/60 overflow-hidden">
              {/* Header accent line */}
              <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {isFeatured && (
                    <span className="inline-flex items-center gap-x-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      دیاری کراو
                    </span>
                  )}
                  <span
                    className={[
                      'inline-flex items-center gap-x-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold',
                      isActive
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700',
                    ].join(' ')}
                  >
                    {isActive ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {isActive ? 'چالاک' : 'ناچالاک'}
                  </span>
                  {categoryName && (
                    <span className="inline-flex items-center gap-x-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <Layers size={11} />
                      {categoryName}
                    </span>
                  )}
                  {subcategoryName && (
                    <span className="inline-flex items-center gap-x-1 rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
                      <FolderOpen size={11} />
                      {subcategoryName}
                    </span>
                  )}
                  {fileLabel && (
                    <span className="inline-flex items-center gap-x-1 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
                      <FileText size={11} />
                      {fileLabel}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                  {title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-stone-400">
                  {book?.created_at ? (
                    <div className="inline-flex items-center gap-x-1.5">
                      <Calendar size={13} className="text-stone-300" />
                      <span>{formatDate(book.created_at)}</span>
                    </div>
                  ) : null}
                  {book?.id ? (
                    <div className="inline-flex items-center gap-x-1.5">
                      <Hash size={13} className="text-stone-300" />
                      <span>{book.id}</span>
                    </div>
                  ) : null}
                </div>

                {/* Author & Translator & editor */}
                <div className="mt-5 space-y-3">
                  {authorText && (
                    <div className="flex items-center gap-x-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 border border-violet-100">
                        <Feather size={16} className="text-violet-500" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">نووسەر</div>
                        <div className="text-sm font-semibold text-stone-800 mt-0.5">{authorText}</div>
                      </div>
                    </div>
                  )}

                  {translatorText && (
                    <div className="flex items-center gap-x-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                        <Languages size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">وەرگێڕ</div>
                        <div className="text-sm font-semibold text-stone-800 mt-0.5">{translatorText}</div>
                      </div>
                    </div>
                  )}

                  {editorText && (
                    <div className="flex items-center gap-x-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
                        <PenLine size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">دەستکاریکەر</div>
                        <div className="text-sm font-semibold text-stone-800 mt-0.5">{editorText}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ─── 2. Specifications ─── */}
            {/* <div className="rounded-2xl bg-white border border-stone-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                <div className="flex items-center gap-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 border border-amber-200">
                    <BarChart3 size={14} className="text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-stone-700">تایبەتمەندیەکان</h2>
                    <p className="text-[11px] text-stone-400 mt-0.5">Specifications</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-stone-100">
                {specifications.map((spec, idx) => {
                  const Icon = spec.icon
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-x-4 px-6 py-3.5 hover:bg-stone-50/60 transition-colors duration-150"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${spec.bg} border border-stone-100`}>
                        <Icon size={14} className={spec.color} />
                      </div>
                      <div className="w-28 shrink-0">
                        <span className="text-[12px] font-medium text-stone-400">{spec.label}</span>
                      </div>
                      <div className="flex-1">
                        {spec.boolean ? (
                          <span
                            className={`inline-flex items-center gap-x-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${
                              spec.boolValue
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}
                          >
                            {spec.boolValue ? <CheckCircle size={11} /> : <XCircle size={11} />}
                            {spec.value}
                          </span>
                        ) : (
                          <span className="text-[13px] font-medium text-stone-700">
                            {spec.value || '—'}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div> */}

            {/* ─── 3. Short Description ─── */}
            {book?.short_description && (
              <div className="rounded-2xl bg-white border border-stone-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                  <div className="flex items-center gap-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 border border-orange-200">
                      <ScrollText size={14} className="text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-stone-700">وەسفی کورت</h2>
                      {/* <p className="text-[11px] text-stone-400 mt-0.5">Short Description</p> */}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[13.5px] leading-8 text-stone-600 whitespace-pre-line">
                    {book.short_description}
                  </p>
                </div>
              </div>
            )}

            {/* ─── 4. Long Description ─── */}
            {book?.long_description && (
              <div className="rounded-2xl bg-white border border-stone-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                  <div className="flex items-center gap-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 border border-sky-200">
                      <AlignRight size={14} className="text-sky-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-stone-700">وەسفی تەواو</h2>
                      {/* <p className="text-[11px] text-stone-400 mt-0.5">Full Description</p> */}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[13.5px] leading-8 text-stone-700 whitespace-pre-line">
                    {book.long_description}
                  </div>
                </div>
              </div>
            )}

            {Object.keys(specGroups).length > 0 && (
              <div className="rounded-2xl bg-white border border-stone-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                  <div className="flex items-center gap-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 border border-amber-200">
                      <BarChart3 size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-stone-700">تایبەتمەندیەکان</h2>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-stone-100">
                  {Object.entries(specGroups).map(([groupName, items]) => (
                    <div key={groupName}>
                      <div className="px-6 py-3 bg-white">
                        <div className="text-[12px] font-semibold text-stone-500">{groupName}</div>
                      </div>
                      <div className="divide-y divide-stone-100">
                        {items.map((s, idx) => (
                          <div key={`${groupName}-${idx}`} className="px-6 py-3.5 flex items-start gap-x-4">
                            <div className="w-32 shrink-0 text-[12px] font-semibold text-stone-500">
                              {s?.spec_name || s?.name || '—'}
                            </div>
                            <div className="flex-1 text-[13px] text-stone-700 whitespace-pre-line">
                              {s?.spec_value ?? s?.value ?? '—'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </section>
        </div>
      </div>
    </div>
  )
}
