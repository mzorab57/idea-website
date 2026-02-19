import { useQuery } from '@tanstack/react-query'
import { getBooks, getSettings } from '../services/public'
import Seo from '../seo/Seo.jsx'
import BookCard from '../components/books/BookCard.jsx'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Newspaper,
  BarChart3,
  MessagesSquare,
} from 'lucide-react'

 
/* ─── slides — وێنەکانی دازگاکەت لێرە دابنێ ─── */
const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80",
    title: 'بەخێربێیت بۆ Idea Foundation',
    subtitle: 'کتێبخانەیەکی دیجیتاڵی ئازاد بۆ هەموو کەس',
  },
  {
    id: 2,
   image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80",
    title: 'زانست و زانیاری',
    subtitle: 'بە سەدان کتێب لە بوارە جیاوازەکاندا',
  },
  {
    id: 3,
     image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80",
      title: "کەشێکی ئارام",
    title: 'پێکەوە فێربین',
    subtitle: 'ئەرشیفێکی گشتی بۆ لێکۆڵینەوە و بیرۆکەکان',
  },
   {
    id: 4,
   image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80",
    title: 'زانست و زانیاری',
    subtitle: 'بە سەدان کتێب لە بوارە جیاوازەکاندا',
  },
]

/* ─── ٤ بەشەکە ─── */
const SECTIONS = [
  {
    key: 'books',
    name: 'کتێب',
    slug: 'kteb',            // ← سلاگی ڕاستەقینە لێرە دابنێ
    description: 'نوێترین کتێبەکان',
    icon: BookOpen,
    gradient: 'from-orange-500 to-amber-500',
    light: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    border: 'border-orange-200',
    hoverBorder: 'hover:border-orange-300',
    dot: 'bg-orange-400',
    linkColor: 'text-orange-600 hover:text-orange-700',
    sectionBg: 'bg-white',
  },
  {
    key: 'magazines',
    name: 'گۆڤارەکان',
    slug: 'govar',
    description: 'گۆڤاری نوێ و بڵاوکراوەکان',
    icon: Newspaper,
    gradient: 'from-sky-500 to-cyan-500',
    light: 'bg-sky-50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    border: 'border-sky-200',
    hoverBorder: 'hover:border-sky-300',
    dot: 'bg-sky-400',
    linkColor: 'text-sky-600 hover:text-sky-700',
    sectionBg: 'bg-[#fafaf9]',
  },
  {
    key: 'infographics',
    name: 'ئینفۆگرافیک',
    slug: 'infographic',
    description: 'زانیاری بە شێوەی وێنەیی',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-300',
    dot: 'bg-emerald-400',
    linkColor: 'text-emerald-600 hover:text-emerald-700',
    sectionBg: 'bg-white',
  },
  {
    key: 'forum',
    name: 'سەکۆی بازگر',
    slug: 'sekoy-bazgr',
    description: 'وتووێژ و گفتوگۆ',
    icon: MessagesSquare,
    gradient: 'from-violet-500 to-purple-500',
    light: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    border: 'border-violet-200',
    hoverBorder: 'hover:border-violet-300',
    dot: 'bg-violet-400',
    linkColor: 'text-violet-600 hover:text-violet-700',
    sectionBg: 'bg-[#fafaf9]',
  },
]

/* ═══════════════════════════════════════════════════
   CategoryRow — هەر بەشێک کتێبەکانی خۆی دەهێنێ
   ═══════════════════════════════════════════════════ */
function CategoryRow({ section }) {
  const scrollRef = useRef(null)
  const { data, isLoading } = useQuery({
    queryKey: ['books', section.slug],
    queryFn: () => getBooks({ category: section.slug, per_page: 6 }),
  })

  const books = Array.isArray(data) ? data : data?.data || []

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const amount = 300
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  const Icon = section.icon

  return (
    <section className={section.sectionBg}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-x-4">
            {/* icon with gradient */}
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl
                            bg-gradient-to-br ${section.gradient} shadow-lg shadow-${section.key}/20`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">{section.name}</h2>
              <p className="text-[12px] text-stone-400 mt-0.5">{section.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            {/* scroll arrows */}
            <button
              onClick={() => scroll('left')}
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full
                         border border-stone-200 text-stone-400
                         hover:border-stone-300 hover:text-stone-600
                         transition-all"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full
                         border border-stone-200 text-stone-400
                         hover:border-stone-300 hover:text-stone-600
                         transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {/* see all */}
            <Link
              to={`/books?category=${encodeURIComponent(section.slug)}`}
              className={`group flex items-center gap-x-1 text-[12px]
                         font-semibold ${section.linkColor} transition-colors mr-2`}
            >
              هەمووی ببینە
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ── Books Row ── */}
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[220px] animate-pulse">
                <div className="h-64 rounded-2xl bg-stone-100 mb-3" />
                <div className="h-4 w-3/4 rounded-full bg-stone-100 mb-2" />
                <div className="h-3 w-1/2 rounded-full bg-stone-50" />
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4
                       scroll-smooth snap-x snap-mandatory
                       scrollbar-thin scrollbar-thumb-stone-200
                       scrollbar-track-transparent"
          >
            {books.map((b) => (
              <div key={b.id} className="shrink-0 w-[220px] snap-start">
                <BookCard book={b} />
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-2xl border-2 border-dashed ${section.border}
                          ${section.light} py-12 text-center`}>
            <Icon size={28} className={`mx-auto mb-3 ${section.iconColor} opacity-40`} />
            <p className="text-[13px] text-stone-400">هێشتا ناوەڕۆک نییە</p>
          </div>
        )}
      </div>

      {/* divider */}
      <div className="h-px bg-gradient-to-l from-transparent via-stone-200/50 to-transparent" />
    </section>
  )
}

/* ═══════════════════════════════════════════════════
   HOME
   ═══════════════════════════════════════════════════ */
export default function Home() {
  const settings = useQuery({ queryKey: ['settings'], queryFn: getSettings })
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const siteName = settings.data?.site_name || 'Idea Foundation'
  const tagline = settings.data?.tagline || 'کتێبخانەیەکی دیجیتاڵی ئازاد'

  /* ── auto‑play ── */
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [paused])

  return (
    <div dir="rtl" className="min-h-screen ">
      <Seo title={siteName} description={tagline} />

      {/* ═════════════════════════════════════
          CAROUSEL — h-1/3
      ═════════════════════════════════════ */}
      <section
        className="relative max-w-7xl rounded-xl mx-auto h-[33vh] min-h-[400px] max-h-[420px] overflow-hidden bg-stone-900"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={[
              'absolute inset-0 transition-all duration-700 ease-in-out',
              i === current
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105',
            ].join(' ')}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t
                            from-black/70 via-black/30 to-transparent" />
          </div>
        ))}

        {/* content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-8">
            <div className="max-w-lg">
              {/* animated badge */}
              <div className="inline-flex items-center gap-x-2 rounded-full
                              bg-white/10 backdrop-blur-sm border border-white/20
                              px-3 py-1 mb-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping
                                   rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5
                                   rounded-full bg-orange-400" />
                </span>
                <span className="text-[11px] font-medium text-white/90">
                  {siteName}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight
                             transition-all duration-500">
                {SLIDES[current].title}
              </h2>
              <p className="mt-2 text-[14px] text-white/70 leading-relaxed">
                {SLIDES[current].subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* ── arrows ── */}
        <button
          onClick={() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                     flex h-10 w-10 items-center justify-center rounded-full
                     bg-white/10 backdrop-blur-sm border border-white/20
                     text-white/70 hover:bg-white/20 hover:text-white
                     transition-all"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={() => setCurrent((p) => (p + 1) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                     flex h-10 w-10 items-center justify-center rounded-full
                     bg-white/10 backdrop-blur-sm border border-white/20
                     text-white/70 hover:bg-white/20 hover:text-white
                     transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        {/* ── dots ── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20
                        flex items-center gap-x-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={[
                'rounded-full transition-all duration-300',
                i === current
                  ? 'h-2 w-6 bg-orange-400'
                  : 'h-2 w-2 bg-white/40 hover:bg-white/60',
              ].join(' ')}
            />
          ))}
        </div>

        {/* ── progress bar ── */}
        {!paused && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10">
            <div
              className="h-full bg-orange-400 transition-none"
              style={{
                animation: 'progress 5s linear infinite',
              }}
            />
          </div>
        )}

        <style>{`
          @keyframes progress {
            from { width: 0% }
            to   { width: 100% }
          }
        `}</style>
      </section>

      {/* ═════════════════════════════════════
          QUICK NAV — 4 tabs
      ═════════════════════════════════════ */}
      <section className="   sticky top-[74px] z-30">
        <div className="mx-auto max-w-[69rem] rounded-xl px-4 sm:px-6 bg-white">
          <div className="flex items-center gap-x-1 overflow-x-auto
                          scrollbar-thin scrollbar-thumb-stone-100
                          scrollbar-track-transparent -mb-px">
            {SECTIONS.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.key}
                  href={`#${s.key}`}
                  className="group flex items-center gap-x-2 whitespace-nowrap
                             pl-4 py-3.5 border-b-2 border-transparent
                             text-[13px] font-medium text-stone-400
                             hover:text-stone-700 hover:border-stone-300
                             transition-all duration-200"
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg
                                  ${s.iconBg} ${s.iconColor}
                                  group-hover:shadow-sm transition-all`}>
                    <Icon size={14} />
                  </div>
                  {s.name}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════
          4 SECTIONS
      ═════════════════════════════════════ */}
      {SECTIONS.map((section) => (
        <div key={section.key} id={section.key}>
          <CategoryRow section={section} />
        </div>
      ))}

      {/* ═════════════════════════════════════
          BOTTOM CTA
      ═════════════════════════════════════ */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center
                          rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500
                          shadow-lg shadow-orange-200/50">
            <BookOpen size={24} className="text-white" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            ئامادەیت بۆ خوێندنەوە؟
          </h2>
          <p className="mt-3 text-stone-400 max-w-md mx-auto text-[14px] leading-relaxed">
            بە سەدان کتێب و بڵاوکراوە لە بوارە جیاوازەکاندا ئامادەن
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/books"
              className="rounded-2xl bg-stone-900 px-8 py-3.5
                         text-[13px] font-semibold text-white
                         hover:bg-stone-800 active:scale-[0.98]
                         transition-all duration-200"
            >
              هەموو کتێبەکان
            </Link>
            <Link
              to="/about"
              className="rounded-2xl border-2 border-stone-200
                         px-8 py-3.5 text-[13px] font-semibold text-stone-600
                         hover:border-stone-300 hover:text-stone-900
                         transition-all duration-200"
            >
              دەربارەی ئێمە
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}