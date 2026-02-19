import { useEffect } from 'react'
import { X, ChevronDown, Home, Book, User, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCategories from '../../hooks/useCategories'

export default function MobileMenu({ open, onClose }) {
  const { data: categories = [] } = useCategories() || {}

  // ── Lock body scroll when menu is open ──
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="md:hidden fixed inset-0 z-[60]" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="absolute right-0 top-0 h-full w-[85%] max-w-[320px] shadow-2xl
                      transition-transform duration-300 animate-slideRight
                      flex flex-col">

        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-orange-500 to-orange-400
                        p-6 flex items-end shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/20
                       text-white hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="text-white">
            <h2 className="text-2xl font-bold font-serif">Idea Foundation</h2>
            <p className="text-orange-100 text-sm opacity-90">کتێبخانەی مۆدێرن</p>
          </div>
        </div>

        {/* Scrollable List — تەنها ئەم بەشە سکرۆڵ دەکات */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-red-50/50 p-4 space-y-2">

          <Link onClick={onClose} to="/"
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5
                       text-slate-700 shadow-sm border border-slate-100
                       hover:border-orange-200 hover:text-orange-600 transition-all">
            <Home size={18} className="text-orange-500" />
            <span className="font-medium">سەرەکی</span>
          </Link>

          <Link onClick={onClose} to="/books"
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5
                       text-slate-700 shadow-sm border border-slate-100
                       hover:border-orange-200 hover:text-orange-600 transition-all">
            <Book size={18} className="text-orange-500" />
            <span className="font-medium">کتێبەکان</span>
          </Link>

          {/* Categories */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100
                            text-xs font-bold text-slate-400 uppercase tracking-wider">
              پۆلەکان
            </div>
            <div className="divide-y divide-slate-50">
              {categories.map((c) => (
                <details key={c.id} className="group">
                  <summary className="flex cursor-pointer items-center justify-between
                                      px-4 py-3.5 text-slate-600 font-medium
                                      hover:bg-orange-50/50 hover:text-orange-600
                                      transition-colors">
                    <span className="text-sm">{c.name}</span>
                    <ChevronDown size={16}
                      className="text-slate-300 transition-transform
                                 group-open:rotate-180 group-open:text-orange-500" />
                  </summary>
                  <div className="bg-slate-50 px-4 py-2 space-y-1">
                    {(c.subcategories || []).map((s) => (
                      <Link
                        key={s.id}
                        to={`/books?subcategory=${encodeURIComponent(s.slug || s.name)}`}
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-lg px-3 py-2
                                   text-sm text-slate-500 hover:bg-white
                                   hover:text-orange-600 hover:shadow-sm transition-all">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-300" />
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <Link onClick={onClose} to="/author"
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5
                       text-slate-700 shadow-sm border border-slate-100
                       hover:border-orange-200 hover:text-orange-600 transition-all">
            <User size={18} className="text-orange-500" />
            <span className="font-medium">نووسەرەکان</span>
          </Link>

          <Link onClick={onClose} to="/about"
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5
                       text-slate-700 shadow-sm border border-slate-100
                       hover:border-orange-200 hover:text-orange-600 transition-all">
            <Info size={18} className="text-orange-500" />
            <span className="font-medium">دەربارە</span>
          </Link>

        </div>
      </div>
    </div>
  )
}