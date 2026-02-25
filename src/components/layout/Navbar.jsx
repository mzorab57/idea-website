import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getCategoriesAll } from '../../services/public'

function DesktopNavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'px-4 py-2 text-sm font-serif tracking-wide transition-colors',
          isActive ? 'text-white' : 'text-slate-200 hover:text-white',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [activeCatId, setActiveCatId] = useState(null)
  const megaRef = useRef(null)
  const navigate = useNavigate()

  const { data: catsData } = useQuery({
    queryKey: ['categories-all'],
    queryFn: getCategoriesAll,
  })

  useEffect(() => {
    function onEsc(e) {
      if (e.key === 'Escape') setMegaOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  const categories = catsData?.categories || []
  const subsAll = catsData?.subcategories || []
  const subsByCat = subsAll.reduce((acc, s) => {
    if (!acc[s.category_id]) acc[s.category_id] = []
    acc[s.category_id].push(s)
    return acc
  }, {})

  return (
    <header  className="sticky top-0 z-40 border-b border-[#d97706] bg-[#0f172a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="font-serif text-2xl tracking-tight text-white">
            Idea Foundation
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <DesktopNavItem to="/">Home</DesktopNavItem>
            <DesktopNavItem to="/books">Books</DesktopNavItem>
            <button
              onMouseEnter={() => setMegaOpen(true)}
              className="relative px-4 py-2 text-sm font-serif tracking-wide text-slate-200 hover:text-white"
              aria-haspopup="true"
              aria-expanded={megaOpen ? 'true' : 'false'}
            >
              Categories
            </button>
            <DesktopNavItem to="/author">Authors</DesktopNavItem>
            <DesktopNavItem to="/about">About</DesktopNavItem>
          </nav>
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-slate-800"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {megaOpen ? (
        <div
          ref={megaRef}
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => {
            setMegaOpen(false)
            setActiveCatId(null)
          }}
          className="hidden md:block border-t border-[#d97706]/40 bg-[#0f172a] shadow-lg"
        >
          <div className="mx-auto max-w-7xl px-6 py-4 grid grid-cols-12 gap-6">
            <div className="col-span-5">
              <div className="text-xs uppercase tracking-wider text-[#d97706] mb-2">Categories</div>
              <ul className="max-h-72 overflow-auto pr-2">
                {(categories).map((c) => (
                  <li key={c.id}>
                    <button
                      onMouseEnter={() => setActiveCatId(c.id)}
                      onClick={() => navigate('/category/' + c.id)}
                      className={[
                        'group flex w-full items-center justify-between rounded-md px-3 py-2 text-left',
                        activeCatId === c.id ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white',
                      ].join(' ')}
                    >
                      <span className="font-serif">{c.name}</span>
                      <ChevronRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-7">
              <div className="text-xs uppercase tracking-wider text-[#d97706] mb-2">Subcategories</div>
              <div className="grid grid-cols-2 gap-2">
                {(subsByCat[activeCatId] || []).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/books?subcategory=${encodeURIComponent(s.slug || s.name)}`)}
                    className="rounded-md border border-[#d97706]/40 px-3 py-2 text-left text-slate-100 hover:bg-slate-800"
                  >
                    <div className="font-serif">{s.name}</div>
                    {s.count ? <div className="text-xs text-slate-400">{s.count} books</div> : null}
                  </button>
                ))}
                {!activeCatId || (subsByCat[activeCatId] || []).length === 0 ? (
                  <div className="col-span-2 rounded-md border border-slate-700 px-3 py-6 text-slate-400">
                    Select a category to see its subcategories.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-[#0f172a] shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#d97706]/40">
              <div className="font-serif text-white text-lg">Menu</div>
              <button onClick={() => setMobileOpen(false)} className="text-white">
                <X />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <Link onClick={() => setMobileOpen(false)} to="/" className="block rounded-md px-3 py-2 text-slate-100 hover:bg-slate-800">Home</Link>
              <Link onClick={() => setMobileOpen(false)} to="/books" className="block rounded-md px-3 py-2 text-slate-100 hover:bg-slate-800">Books</Link>
              <details className="group rounded-md">
                <summary className="cursor-pointer rounded-md px-3 py-2 text-slate-100 hover:bg-slate-800">Categories</summary>
                <div className="mt-1 pl-3">
                  {(categories).map((c) => (
                    <details key={c.id} className="group">
                      <summary className="cursor-pointer rounded-md px-3 py-2 text-slate-100 hover:bg-slate-800">{c.name}</summary>
                      <div className="pl-3">
                        {(subsByCat[c.id] || []).map((s) => (
                          <Link
                            key={s.id}
                            to={`/books?subcategory=${encodeURIComponent(s.slug || s.name)}`}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md px-3 py-2 text-slate-100 hover:bg-slate-800"
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </details>
              <Link onClick={() => setMobileOpen(false)} to="/author" className="block rounded-md px-3 py-2 text-slate-100 hover:bg-slate-800">Authors</Link>
              <Link onClick={() => setMobileOpen(false)} to="/about" className="block rounded-md px-3 py-2 text-slate-100 hover:bg-slate-800">About</Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}