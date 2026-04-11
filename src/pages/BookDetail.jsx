import { useState, useEffect } from 'react'
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
  List,
  X,
  Youtube,
  Send,
  MessageCircle,
} from 'lucide-react'
import Spinner from '../components/ui/Spinner.jsx'
import { getPopupImageUrl, placeholder } from '../utils/image'
import { authorNames, truncate } from '../utils/formatters'

export default function BookDetail() {
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

  /* ─── Fetch book ─── */
  const { data: book, isLoading, isError, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id),
    enabled: !!id,
  })

  /* ─── Prevent Scroll when Modal is Open ─── */
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isModalOpen])

  /* ─── Close modal on Escape key ─── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

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
  const categoryId = book?.category_id
  const shortDesc = book?.short_description
  const longDesc = book?.long_description
  const description = longDesc || shortDesc || book?.description
  const metaTitle = book?.meta_title || title
  const metaDescription = book?.meta_description || truncate(description || '', 160)
  const viewCount = Number(book?.view_count || 0)
  const downloadCount = Number(book?.download_count || 0)
  const isInfographics = Number(categoryId) === 14
  const isAudioBooks = Number(categoryId) === 16
  const disableBookUI = isInfographics || isAudioBooks

  console.log(book);
  console.log("book");
  /* ─── Authors / Translators / Editors ─── */
  const authorsList = Array.isArray(book?.authors) ? book.authors : []
  const namesForRole = (role) =>
    authorsList
      .filter((a) => String(a?.role || '').toLowerCase() === role)
      .map((a) => (typeof a === 'string' ? a : a?.name))
      .filter(Boolean)
      .join('، ')

  const firstAuthorObj =
    Array.isArray(authorsList) &&
    authorsList.find((a) => typeof a === 'object' && (String(a?.role || '').toLowerCase() === 'author' || !a?.role) && a?.id)
  const firstAuthorId = firstAuthorObj?.id

  const splitNames = (s) =>
    String(s || '')
      .split(/[،,]/)
      .map((x) => x.trim())
      .filter(Boolean)

  const fallbackNames = splitNames(book?.author_names)

  const authorText = namesForRole('author') || authorNames(book) || fallbackNames[0] || ''
  const translatorText = book?.translator_names || namesForRole('translator') || book?.translator || fallbackNames[1] || ''
  const editorText = book?.editor_names || namesForRole('editor') || book?.editor || fallbackNames[2] || ''

  const normalizeRole = (r) => {
    const x = String(r || '').toLowerCase().trim()
    if (['author', 'writer', 'نووسەر'].includes(x)) return 'author'
    if (['translator', 'translation', 'وەرگێڕ', 'wargeyr'].includes(x)) return 'translator'
    if (['editor', 'edit', 'ئیدیتۆر', 'دەستکاریکەر'].includes(x)) return 'editor'
    return null
  }
  const roleMap = { author: [], translator: [], editor: [] }
  const unknown = []
  if (Array.isArray(authorsList)) {
    authorsList.forEach((a) => {
      const name = typeof a === 'string' ? a : a?.name
      if (!name) return
      const role = normalizeRole(typeof a === 'object' ? a?.role : null)
      const entry = { id: typeof a === 'object' ? a?.id : undefined, name: String(name).trim() }
      if (role && roleMap[role]) roleMap[role].push(entry)
      else unknown.push(entry)
    })
  }
  const splitToRole = (text, role) => {
    if (!text) return
    text
      .split(/[،,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((nm) => roleMap[role].push({ name: nm }))
  }
  if (roleMap.author.length === 0 && authorText) splitToRole(authorText, 'author')
  if (roleMap.translator.length === 0 && translatorText) splitToRole(translatorText, 'translator')
  if (roleMap.editor.length === 0 && editorText) splitToRole(editorText, 'editor')
  const namesEq = (a, b) => String(a || '').trim() === String(b || '').trim()
  const listFromText = (t) => String(t || '').split(/[،,]/).map((s) => s.trim()).filter(Boolean)
  const authList = listFromText(authorText)
  const transList = listFromText(translatorText)
  const editList = listFromText(editorText)
  unknown.forEach((u) => {
    if (transList.some((n) => namesEq(n, u.name))) roleMap.translator.push(u)
    else if (editList.some((n) => namesEq(n, u.name))) roleMap.editor.push(u)
    else if (authList.some((n) => namesEq(n, u.name))) roleMap.author.push(u)
  })
  const dedupeByName = (arr) => {
    const seen = new Set()
    return arr.filter((x) => {
      const k = String(x?.name || '').trim()
      if (!k || seen.has(k)) return false
      seen.add(k)
      return true
    })
  }
  roleMap.author = dedupeByName(roleMap.author)
  roleMap.translator = dedupeByName(roleMap.translator)
  roleMap.editor = dedupeByName(roleMap.editor)
  const hasName = (list, nm) => list.some((x) => String(x.name).trim() === String(nm).trim())
  roleMap.translator = roleMap.translator.filter((x) => !hasName(roleMap.author, x.name))
  roleMap.editor = roleMap.editor.filter((x) => !hasName(roleMap.author, x.name) && !hasName(roleMap.translator, x.name))
  const authorsArr = roleMap.author.map((x) => x.name)
  const translatorsArr = roleMap.translator.map((x) => x.name)
  const editorsArr = roleMap.editor.map((x) => x.name)
  

  /* ─── Specifications ─── */
  const rawSpecs = Array.isArray(book?.specifications) ? book.specifications : Array.isArray(book?.specs) ? book.specs : []
  const specGroups = rawSpecs
    .filter((s) => Number(s?.is_visible ?? 1) === 1)
    .reduce((acc, s) => {
      const g = String(s?.group ?? 'گشتی').trim() || 'گشتی'
      if (!acc[g]) acc[g] = []
      acc[g].push(s)
      return acc
    }, {})

  const people = [
    authorsArr.length ? { label: 'نووسەر', list: authorsArr } : null,
    translatorsArr.length ? { label: 'وەرگێڕ', list: translatorsArr } : null,
    editorsArr.length ? { label: 'ئیدیتۆر', list: editorsArr } : null,
  ].filter(Boolean)

  const fileLabel = book?.file_key ? (String(book.file_key).toLowerCase().includes('.pdf') ? 'PDF' : 'FILE') : null
  const youtubeUrl = String(book?.youtube_url || '').trim()
  const canDownload = Boolean(book?.file_key || book?.pdf_url || book?.download_url) && !disableBookUI
  const hasDirectResource = canDownload || Boolean(youtubeUrl)

 

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
    }
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-white"><Spinner size={40} /></div>
  if (isError) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white gap-4 px-6 text-center">
      <p className="text-base font-semibold text-stone-800">نەتوانرا کتێبەکە باربکرێت</p>
      <p className="text-sm text-stone-400">{error?.message}</p>
      <Link to="/books" className="mt-4 rounded-full bg-stone-900 px-6 py-2.5 text-sm text-white hover:bg-stone-800 transition-colors">← گەڕانەوە</Link>
    </div>
  )

  return (
    <div dir="rtl" className="min-h-screen bg-white font-sans text-[#2d2d2d]">
      <Seo title={`${metaTitle} | دەزگای ئایدیا`} description={metaDescription} />

      {/* ═══ Fullscreen Image Modal — Responsive ═══ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button — responsive size & position */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-all"
          >
            <X size={24} className="sm:hidden" />
            <X size={28} className="hidden sm:block" />
          </button>

          {/* Image Container — responsive sizing */}
          <div
            className="relative mx-4 sm:mx-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={cover}
              alt={title}
              className="max-h-[80vh] max-w-[90vw] sm:max-h-[85vh] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[45vw] xl:max-w-[35vw] rounded-lg object-contain shadow-2xl"
            />

            {/* Book Title Overlay — bottom */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
              <p className="text-center text-sm sm:text-base font-semibold text-white/90 line-clamp-2">
                {title}
              </p>
            </div>
          </div>

          {/* Hint text — hidden on very small screens */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:block text-xs text-white/40">
            کلیک بکە لە دەرەوە یان Esc دابگرە بۆ داخستن
          </p>
        </div>
      )}

      {/* ═══ Breadcrumb ═══ */}
      <nav className="border-b border-stone-100 bg-stone-50/50">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="flex items-center gap-x-2 text-[13px] text-stone-400">
            <Link to="/" className="hover:text-stone-700 transition-colors">سەرەکی</Link>
            <ChevronLeft size={12} />
            <Link to="/books" className="hover:text-stone-700 transition-colors">کتێبەکان</Link>
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

      <main className="mx-auto max-w-6xl px-6 lg:py-12 pt-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Cover Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div
                onClick={() => setIsModalOpen(true)}
                className="group relative cursor-zoom-in overflow-hidden   transition-all duration-500 hover:scale-[1.02]"
              >
                <img
                  src={cover}
                  alt={title}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = placeholder(400, 600)
                  }}
                  className="w-full  object-cover"
                  style={{ aspectRatio: '3/4' }}
                />
                <div className="absolute inset-0 flex items-center justify-center  opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="text-white " size={48} />
                </div>
              </div>
                {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className=" border border-stone-100 bg-stone-50 p-4 text-center">
                  <Eye size={18} className="mx-auto mb-2 text-stone-400" />
                  <p className="text-xs font-bold text-stone-400 uppercase">بینین</p>
                  <p className="text-lg font-bold text-stone-800">{viewCount.toLocaleString()}</p>
                </div>
                <div className=" border border-stone-100 bg-stone-50 p-4 text-center">
                  <Download size={18} className="mx-auto mb-2 text-stone-400" />
                  <p className="text-xs font-bold text-stone-400 uppercase">داونلۆد</p>
                  <p className="text-lg font-bold text-stone-800">{downloadCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Content Side */}
          <div className="lg:col-span-8 ">
            <div className="space-y-8">
              <div className="space-y-4 ">
                <h1 className="text-3xl  leading-tight text-orange-400 lg:text-4xl">{title}</h1>
                {people.length > 0 && (
                  <div className="flex flex-col gap-y-1 pt-4">
                    {people.map((p) => (
                      <div key={p.label} className=" text-orange-400 flex items-center flex-wrap">
                        <span className="text-stone-800 text-lg ">{p.label}:</span>
                        <span className="flex flex-wrap gap-1 ">
                          {(p.list || []).map((n, i) => (
                            <span key={i} className="flex items-center ">
                              <span className="inline-flex items-center   px-2 py-0.5">
                                {n}
                              </span>
                              {i < (p.list.length - 1) && (
                                <span className=" text-stone-700 text-sm">،</span>
                              )}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            

             
             {shortDesc && (
              
                     <div className="relative  ">
    {/* لێرەدا dangerouslySetInnerHTML بەکاردێنین */}
    <div 
      className="text-lg pt-3 leading-[2] text-stone-700 prose max-w-none"
      dangerouslySetInnerHTML={{ __html: shortDesc }} 
    />
                     </div>
                )}

              {Object.keys(specGroups).length > 0 && (
                <section className="mt-12">
                  <div className="flex items-center gap-3 border-r-4 border-[#7a814d] pr-4 mb-6">
                    <List className="text-[#7a814d]" size={24} />
                    <h2 className="text-2xl font-extrabold text-stone-800">تایبەتمەندیەکان</h2>
                  </div>
                  <div className="space-y-8">
                    {Object.entries(specGroups).map(([groupName, items]) => (
                      <div key={groupName}>
                        <h3 className="text-lg font-bold text-stone-700 mb-4 pb-2 border-b border-stone-100">{groupName}</h3>
                        <ul className="space-y-1">
                          {items.map((s, idx) => (
                            <li key={idx} className="flex items-baseline gap-4 py-3 px-4 rounded-lg bg-stone-50/50 hover:bg-[#7a814d]/5 transition-colors">
                              <span className="w-40 shrink-0 text-sm font-bold text-stone-400">{s?.spec_name || s?.name}</span>
                              <span className="text-stone-700 font-medium">{s?.spec_value ?? s?.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="pt-6">
                <button onClick={handleShare} className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-600 hover:shadow-md transition-all">
                  <Share2 size={18} className="text-blue-600" />
                  بڵاوکردنەوە
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24 rounded-3xl bg-orange-500/[0.02] border border-orange-500/10 p-12 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold text-stone-800 lg:text-3xl">
              دەستگەیشتن بە «{title}»
            </h2>
              {hasDirectResource ? (
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  {canDownload && (
                    <button
                      onClick={() => download.mutate()}
                      disabled={download.isPending}
                      className="group flex w-full sm:w-auto sm:min-w-[290px] items-center justify-between rounded-full bg-orange-500 px-2 py-2 pr-8 text-white shadow-xl hover:bg-orange-600 disabled:opacity-50"
                    >
                      <span className="text-lg font-bold">داونلۆدکردنی {fileLabel || 'PDF'}</span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                        {download.isPending ? <Spinner size={20} className="text-white" /> : <Download size={24} />}
                      </div>
                    </button>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex w-full sm:w-auto sm:min-w-[290px] items-center justify-between rounded-full border border-red-200 bg-white px-2 py-2 pr-8 text-red-600 shadow-sm hover:bg-red-50"
                    >
                      <span className="text-lg font-bold">بینینی بە ڤیدیۆ</span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Youtube size={24} />
                      </div>
                    </a>
                  )}
                </div>
              ) : (
                <div className="pt-4 space-y-4">
                  <p className="text-stone-600 leading-8">
                    بۆ دەستکەوتنی ئەم بەرهەمە پەیوەندی بە دەزگای Idea Foundation بکە لە ڕێگەی واتساپ یان تێلەگرام.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                      href="https://wa.me/9647709556990"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-white hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="https://t.me/idea2004"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-white hover:bg-sky-600 transition-colors"
                    >
                      <Send size={18} />
                      <span>Telegram</span>
                    </a>
                  </div>
                </div>
              )}
          </div>
        </section>

       {longDesc && (
  <div className="mt-12 prose prose-stone max-w-7xl jus">
    {/* لێرەدا dangerouslySetInnerHTML بەکاردێنین و whitespace-pre-line لادەبەین چونکە HTML خۆی سپەیس ڕێکدەخات */}
    <div 
      className="text-xl leading-[2] text-stone-700 text-justify"
      dangerouslySetInnerHTML={{ __html: longDesc }} 
    />
  </div>
)}

        {authorText && (
          <section className="mt-24 overflow-hidden rounded-3xl border border-stone-100 bg-[#fcfcfc] p-10">
            <div className="flex flex-col gap-10 lg:flex-row">
              <div className="h-32 w-32 shrink-0 rounded-2xl bg-[#d4d9b3]/20 flex items-center justify-center text-[#7a814d]">
                <BookOpen size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-stone-800">دەربارەی نووسەر: {authorText}</h2>
                <p className="text-lg leading-[1.8] text-stone-600">
                  {book?.author_bio || `دەزگای ئایدیا شانازی دەکات بە بڵاوکردنەوەی کارەکانی "${authorText}".`}
                </p>
                <Link to={firstAuthorId ? `/author/${firstAuthorId}` : "/author"} className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:underline">
                  بینینی پرۆفایلی نووسەر <ChevronLeft size={14} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
