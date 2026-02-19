import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useCategories from '../../hooks/useCategories'
import { ChevronLeft, ArrowLeft, LayoutGrid, BookOpen, Star } from 'lucide-react'

export default function CategoryMenu({ open, onClose }) {
  const { data: categories = [] } = useCategories() || {}
  const [activeCatId, setActiveCatId] = useState(null)
  const panelRef = useRef(null)
  const navigate = useNavigate()

  if (!open) return null

  // Default to first category if none active, to make it look alive immediately
  const currentActiveId = activeCatId || (categories.length > 0 ? categories[0].id : null)
  const activeSubs = categories.find((c) => String(c.id) === String(currentActiveId))?.subcategories || []

  return (
    <div
      dir="rtl"
      onMouseLeave={() => {
        setActiveCatId(null)
        onClose?.()
      }}
      className="absolute top-full inset-x-0 z-50 pt-2" // Added padding-top for detached look
      ref={panelRef}
    >
      {/* The Menu Box */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/60 ring-1 ring-slate-100 flex h-[450px]">
          
          {/* Sidebar: Categories */}
          <div className="w-1/4 min-w-[280px] bg-slate-50/80 p-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar border-l border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
              <LayoutGrid size={14} />
              لیستی پۆلەکان
            </div>
            
            {categories.map((c) => {
              const isActive = currentActiveId === c.id
              return (
                <button
                  key={c.id}
                  onMouseEnter={() => setActiveCatId(c.id)}
                  onClick={() => navigate(`/books?category=${encodeURIComponent(c.slug || c.name)}`)}
                  className={`group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-right transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-orange-600 shadow-lg shadow-orange-500/10 scale-100 z-10'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                  }`}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute right-0 h-8 w-1 rounded-l-full bg-orange-500"></div>
                  )}
                  
                  <span className={`font-medium text-sm z-10 transition-transform ${isActive ? 'translate-x-[-8px]' : ''}`}>
                    {c.name}
                  </span>
                  
                  {isActive ? (
                     <ChevronLeft size={16} className="text-orange-500 animate-pulse" />
                  ) : (
                     <ChevronLeft size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Main Content: Subcategories */}
          <div className="flex-1 p-8 bg-gradient-to-br from-white via-white to-orange-50/30">
            {currentActiveId ? (
              <div className="h-full flex flex-col animate-fadeIn">
                
                {/* Header of Content Area */}
                <div className="flex items-end justify-between border-b border-slate-100 pb-5 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-orange-500 mb-1"></span>
                      {categories.find(c => c.id === currentActiveId)?.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 mr-4 font-light">
                      هەڵبژاردەیەک لە باشترین کتێبەکان
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/books?category=${encodeURIComponent(categories.find(c => c.id === currentActiveId)?.slug)}`)}
                    className="group flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-xl transition-colors"
                  >
                    <span>بینینی هەمووی</span>
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                  </button>
                </div>

                {/* Grid of Subcategories */}
                <div className="grid grid-cols-3 gap-4 content-start overflow-y-auto pr-2 pb-4">
                  {(activeSubs || []).map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => navigate(`/books?subcategory=${encodeURIComponent(s.slug || s.name)}`)}
                      className="group relative flex flex-col items-start p-4 rounded-2xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="mb-3 h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                        <BookOpen size={16} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-orange-700 transition-colors">{s.name}</span>
                      <span className="text-xs text-slate-400 mt-1 group-hover:text-orange-400/80">کلیک بکە بۆ بینین</span>
                    </button>
                  ))}
                  
                  {/* Decorative Empty State if needed */}
                  {activeSubs.length === 0 && (
                    <div className="col-span-3 flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                      <Star size={40} className="text-slate-300 mb-3" />
                      <p>هیچ ژێرپۆلێک بەردەست نییە</p>
                    </div>
                  )}
                </div>

              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )

}

 {/* The Menu Box */}
      // <div className="mx-auto max-w-7xl px-4 md:px-6">
      //   <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/60 ring-1 ring-slate-100 flex h-[450px]">
          
      //     {/* Sidebar: Categories */}
      //     <div className="w-1/4 min-w-[280px] bg-slate-50/80 p-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar border-l border-slate-100">
      //       <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
      //         <LayoutGrid size={14} />
      //         لیستی پۆلەکان
      //       </div>
            
      //       {categories.map((c) => {
      //         const isActive = currentActiveId === c.id
      //         return (
      //           <button
      //             key={c.id}
      //             onMouseEnter={() => setActiveCatId(c.id)}
      //             onClick={() => navigate(`/books?category=${encodeURIComponent(c.slug || c.name)}`)}
      //             className={`group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-right transition-all duration-300 ${
      //               isActive
      //                 ? 'bg-white text-orange-600 shadow-lg shadow-orange-500/10 scale-100 z-10'
      //                 : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
      //             }`}
      //           >
      //             {/* Active Indicator Line */}
      //             {isActive && (
      //               <div className="absolute right-0 h-8 w-1 rounded-l-full bg-orange-500"></div>
      //             )}
                  
      //             <span className={`font-medium text-sm z-10 transition-transform ${isActive ? 'translate-x-[-8px]' : ''}`}>
      //               {c.name}
      //             </span>
                  
      //             {isActive ? (
      //                <ChevronLeft size={16} className="text-orange-500 animate-pulse" />
      //             ) : (
      //                <ChevronLeft size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      //             )}
      //           </button>
      //         )
      //       })}
      //     </div>

      //     {/* Main Content: Subcategories left */}
      //     <div className="flex-1 p-8 bg-gradient-to-br from-white via-white to-orange-50/30">
      //       {currentActiveId ? (
      //         <div className="h-full flex flex-col animate-fadeIn">
                
      //           {/* Header of Content Area */}
      //           <div className="flex items-end justify-between border-b border-slate-100 pb-5 mb-6">
      //             <div>
      //               <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
      //                 <span className="inline-block h-2 w-2 rounded-full bg-orange-500 mb-1"></span>
      //                 {categories.find(c => c.id === currentActiveId)?.name}
      //               </h3>
      //               <p className="text-sm text-slate-400 mt-1 mr-4 font-light">
      //                 هەڵبژاردەیەک لە باشترین کتێبەکان
      //               </p>
      //             </div>
      //             <button 
      //               onClick={() => navigate(`/books?category=${encodeURIComponent(categories.find(c => c.id === currentActiveId)?.slug)}`)}
      //               className="group flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-xl transition-colors"
      //             >
      //               <span>بینینی هەمووی</span>
      //               <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
      //             </button>
      //           </div>

      //           {/* Grid of Subcategories */}
      //           <div className="grid grid-cols-3 gap-4 content-start overflow-y-auto pr-2 pb-4">
      //             {(activeSubs || []).map((s, idx) => (
      //               <button
      //                 key={s.id}
      //                 onClick={() => navigate(`/books?subcategory=${encodeURIComponent(s.slug || s.name)}`)}
      //                 className="group relative flex flex-col items-start p-4 rounded-2xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1"
      //                 style={{ animationDelay: `${idx * 50}ms` }}
      //               >
      //                 <div className="mb-3 h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
      //                   <BookOpen size={16} />
      //                 </div>
      //                 <span className="font-bold text-slate-700 group-hover:text-orange-700 transition-colors">{s.name}</span>
      //                 <span className="text-xs text-slate-400 mt-1 group-hover:text-orange-400/80">کلیک بکە بۆ بینین</span>
      //               </button>
      //             ))}
                  
      //             {/* Decorative Empty State if needed */}
      //             {activeSubs.length === 0 && (
      //               <div className="col-span-3 flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
      //                 <Star size={40} className="text-slate-300 mb-3" />
      //                 <p>هیچ ژێرپۆلێک بەردەست نییە</p>
      //               </div>
      //             )}
      //           </div>

      //         </div>
      //       ) : null}
      //     </div>
      //   </div>
      // </div>