import { useQuery } from '@tanstack/react-query'
import { getBooks, getCategories, getSettings } from '../services/public'
import Seo from '../seo/Seo.jsx'
import BookCard from '../components/books/BookCard.jsx'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import bg1 from '../assets/images/bg1.jpeg'
import bg2 from '../assets/images/bg2.jpeg'
import bg3 from '../assets/images/bg3.jpeg'
import bg4 from '../assets/images/bg4.jpeg'
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
    image: bg1,
    title: 'بەخێربێیت بۆ Idea Foundation',
    subtitle: 'کتێبخانەیەکی دیجیتاڵی ئازاد بۆ هەموو کەس',
  },
  {
    id: 2,
    image: bg2,
    title: 'زانست و زانیاری',
    subtitle: 'بە سەدان کتێب لە بوارە جیاوازەکاندا',
  },
  {
    id: 3,
    image: bg3,
    title: 'پێکەوە فێربین',
    subtitle: 'ئەرشیفێکی گشتی بۆ لێکۆڵینەوە و بیرۆکەکان',
  },
  {
    id: 4,
    image: bg4,
    title: 'زانست و زانیاری',
    subtitle: 'بە سەدان کتێب لە بوارە جیاوازەکاندا',
  },
]

/* ─── ٤ بەشەکە ─── */
const SECTIONS = [
  {
    key: 'books',
    name: 'کتێب',
    slug: 'book',
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
    key: 'Terms',
    name: 'چەمکەکان',
    slug: 'Terms',
    description: 'نوێترین چەمکەکان',
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
    key: 'literature booklet',
    name: 'نامیلکەی ئەدەبی',
    slug: 'literature booklet',
    description: 'نوێترین نامیلکەی ئەدەبی',        
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
    key: 'Philosophical Boklets',
    name: 'نامیلکەی فەلسەفی ',
    slug: 'Philosophical Boklets',
    description: 'نوێترین نامیلکەی فەلسەفی',        
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
    key: 'magazines',
    name: 'گۆڤارەکان',
    slug: 'magazine',
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
    key: 'forum',
    name: 'سەکۆی بازگر',
    slug: 'bazgr-platform',
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
  const query = useQuery({
    queryKey: ['home-featured-by-category', { category_id: section.category_id }],
    queryFn: async () => {
      const categoryId = section.category_id
      if (!categoryId) return []
      const featured = []
      for (let page = 1; page <= 5 && featured.length < 6; page += 1) {
        const res = await getBooks({ category_id: categoryId, page })
        const items = res?.data || []
        featured.push(...items.filter((b) => Number(b?.is_featured) === 1))
        if (items.length < 20) break
      }
      return featured.slice(0, 6)
    },
    enabled: !!section.category_id,
  })
  const books = query.data || []
  const loading = query.isLoading

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
      <div className="mx-auto max-w-7xl px-4  py-14">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-x-4">
            {/* icon with gradient */}
            {/* <div className={`flex h-11 w-11 items-center justify-center rounded-2xl
                            bg-gradient-to-br ${section.gradient} shadow-lg shadow-${section.key}/20`}>
              <Icon size={20} className="text-white" />
            </div> */}
            <div>
              <h2 className="text-2xl text-center font-bold text-stone-900">{section.name}</h2>
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
              to={section.category_id ? `/books?category_id=${encodeURIComponent(section.category_id)}` : '/books'}
              className={`group flex items-center gap-x-1 text-[12px]
                         font-semibold ${section.linkColor} transition-colors mr-2`}
            >
              هەمووی ببینە
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ── Books Row ── */}
        {loading ? (
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
                <BookCard book={b} categoryLabel={section.name} />
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
  const categories = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const siteName = settings.data?.site_name || 'Idea Foundation'
  const tagline = settings.data?.tagline || 'کتێبخانەیەکی دیجیتاڵی ئازاد'
  const cats = categories.data || []

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
        className="relative max-w-7xl lg:rounded-xl  mx-auto  min-h-[160px] md:min-h-[242px] lg:min-h-[400px] overflow-hidden "
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
              className=" w-full  lg:rounded-bl-2xl lg:rounded-br-2xl lg:rounded-2xl lg:rounded-t-none  object-cover size-full    h-[10rem] sm:h-[15] md:h-[15rem] lg:h-[25rem] overflow-hidden cursor-pointer"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            
          </div>
        ))}

        {/* content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-8">
            <div className="max-w-lg">
             

              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight
                             transition-all duration-500">
                {/* {SLIDES[current].title} */}
              </h2>
              <p className="mt-2 text-[14px] text-white/70 leading-relaxed">
                {/* {SLIDES[current].subtitle} */}
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
            {SECTIONS.filter((s) => s.key !== 'literature booklet' && s.key !== 'Philosophical Boklets' && s.key !== 'Terms').map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.key}
                  href={`#${s.key}`}
                  scrollIntoView={{
                    block: 'start',
                    behavior: 'smooth',
                  }}
                  className="group flex items-center gap-x-2 whitespace-nowrap
                             pl-4 py-3.5 border-b-2 border-transparent
                             text-[13px] font-medium text-stone-500
                             hover:text-stone-900 hover:border-orange-400
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
      {SECTIONS.map((section) => {
        const match =
          cats.find((c) => String(c?.name || '').trim() === section.name) ||
          cats.find((c) => String(c?.slug || '').toLowerCase() === String(section.slug || '').toLowerCase())
        const withId = { ...section, category_id: match?.id || null }
        return (
        <div key={section.key} id={section.key}>
          <CategoryRow section={withId} />
        </div>
        )
      })}

    
    </div>
  )
}
