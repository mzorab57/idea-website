import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CategoryMenu from './CategoryMenu.jsx'
import MobileMenu from './MobileMenu.jsx'
import { Facebook, Instagram, Twitter, Search as SearchIcon, Menu, ShoppingBag } from 'lucide-react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      dir="rtl"
      className={[
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-orange-100 py-2' 
          : 'bg-white border-b border-gray-100 py-4',
      ].join(' ')}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-x-4">
          
          {/* Logo & Mobile Button section */}
          <div className="flex items-center gap-x-4">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center gap-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform duration-300">
                <span className="font-bold text-xl">IF</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-slate-800 tracking-wide">Idea Foundation</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider">EST. 2023</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-1 font-medium text-slate-600">
            {[
              { to: '/', label: 'سەرەکی' },
              { type: 'button', label: 'پۆلەکان', action: () => setMegaOpen(true) },
              { to: '/books', label: 'کتێبەکان' },
              { to: '/author', label: 'نووسەرەکان' },
              { to: '/about', label: 'دەربارە' },
            ].map((item, idx) => (
              item.type === 'button' ? (
                <button
                  key={idx}
                  onMouseEnter={item.action}
                  className="px-4 py-2 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 text-sm"
                >
                  {item.label}
                </button>
              ) : (
                <Link 
                  key={idx}
                  to={item.to} 
                  className="px-4 py-2 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 text-sm"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Search & Socials */}
          <div className="hidden md:flex items-center gap-x-4">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                dir="ltr"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(`/search?search=${encodeURIComponent(q)}`)
                }}
                placeholder="گەڕان..."
                className="w-64 rounded-full border border-slate-200 bg-slate-50 px-10 py-2.5 text-sm text-slate-700 outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all duration-300 placeholder:text-slate-400"
              />
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-x-2 text-slate-500">
              {[
                { Icon: Facebook, href: 'https://facebook.com' },
                { Icon: Instagram, href: 'https://instagram.com' },
                { Icon: Twitter, href: 'https://twitter.com' }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  className="p-2 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CategoryMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}