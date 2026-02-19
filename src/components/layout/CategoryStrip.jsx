import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCategories from '../../hooks/useCategories'
import { Sparkles, CornerDownLeft, ArrowLeft } from 'lucide-react'

export default function CategoryStrip() {
  const { data: categories = [] } = useCategories() || {}
  const [activeId, setActiveId] = useState(null)
  const navigate = useNavigate()

  const activeCategory = categories.find((c) => String(c.id) === String(activeId))
  const activeSubs = activeCategory?.subcategories || []

  return (
    <div className="relative hidden md:block z-30 my-6" dir="rtl">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* 1. Main Floating Bar */}
        <div className="relative flex items-center justify-center">
            {/* Background Blur Bar */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-full shadow-sm border border-orange-300/50 "></div>
            
            {/* Scrollable Categories */}
            <div className="relative flex items-center gap-x-2 overflow-x-auto py-3 px-12 scrollbar-hide mask-fade-edges max-w-full">
                
                {/* Decorative Icon */}
                <div className="pl-3 ml-2 border-l border-orange-100/50 flex items-center gap-2 text-orange-400">
                    <Sparkles size={18} className="animate-pulse" />
                </div>

                {categories.map((c) => {
                    const isActive = activeId === c.id
                    return (
                        <button
                            key={c.id}
                            onMouseEnter={() => setActiveId(c.id)}
                            onFocus={() => setActiveId(c.id)}
                            onClick={() => navigate(`/books?category=${encodeURIComponent(c.slug || c.name)}`)}
                            className={`
                                group relative whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-500 ease-out
                                ${isActive 
                                    ? 'bg-gradient-to-tr from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/30 -translate-y-1' 
                                    : 'bg-transparent text-slate-500 hover:bg-white hover:text-orange-600 hover:shadow-md'
                                }
                            `}
                        >
                            <span className="relative z-10">{c.name}</span>
                            {/* Glow Effect behind active item */}
                            {isActive && (
                                <span className="absolute inset-0 -z-10 rounded-full bg-orange-400 blur-md opacity-40"></span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>

        {/* 2. The Floating Cloud Panel (Subcategories) */}
        <div 
            className={`
                absolute left-0 right-0 top-full mt-4 transition-all duration-500 ease-in-out
                ${activeId ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}
            `}
            onMouseLeave={() => setActiveId(null)}
        >
            <div className="mx-auto px-4 max-w-7xl">
                <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(249,115,22,0.15)] border border-white ring-1 ring-orange-50">
                    
                    {/* Decorative Top Gradient Line */}
                    <div className="absolute top-0 border-b border-orange-300/50 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-60"></div>

                    <div className="p-8">
                        {/* Header of Panel */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-dashed border-orange-100/60">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                <span className="p-2 rounded-xl bg-orange-50 text-orange-500">
                                    <CornerDownLeft size={20} />
                                </span>
                                بەشەکانی <span className="text-orange-500">{activeCategory?.name}</span>
                            </h3>
                            <button 
                                onClick={() => navigate(`/books?category=${encodeURIComponent(activeCategory?.slug)}`)}
                                className="text-xs font-medium text-slate-400 hover:text-orange-500 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm"
                            >
                                بینینی هەموو کتێبەکان
                            </button>
                        </div>

                        {/* Grid of Subcategories */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(activeSubs || []).map((s, idx) => (
                                <button
                                    key={s.id}
                                    onClick={() => navigate(`/books?subcategory=${encodeURIComponent(s.slug || s.name)}`)}
                                    style={{ transitionDelay: `${idx * 40}ms` }}
                                    className={`
                                        group flex items-center justify-between p-3 rounded-2xl border border-transparent 
                                        bg-slate-50/50 hover:bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 
                                        transition-all duration-300 transform hover:-translate-y-1
                                        ${activeId ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                                    `}
                                >
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-orange-600 transition-colors">
                                        {s.name}
                                    </span>
                                    <span className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-orange-300 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <ArrowLeft size={12} />
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Empty State */}
                        {activeSubs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/30 rounded-2xl border border-slate-100 border-dashed">
                                <p className="text-slate-400 text-sm italic">هیچ بەشێک بۆ ئەم پۆلە زیاد نەکراوە</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}