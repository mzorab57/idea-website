import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate,  } from 'react-router-dom'
import CategoryMenu from './CategoryMenu.jsx'
import MobileMenu from './MobileMenu.jsx'
import { Facebook, Instagram, Twitter, Search as SearchIcon, Menu, ShoppingBag, X } from 'lucide-react'
import CategoryStrip from './CategoryStrip.jsx'

export default function Header({setActiveId}) {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
   const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        if (!q) setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [q]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQ('');
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
     <header
     onMouseMove={() => setActiveId(null)}
      dir="rtl"
      className={[
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-orange-100 py-2'
          : 'bg-white border-b border-gray-100 py-4',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl w-full px-4 md:px-6">
        <div className="flex items-center justify-between gap-x-4 w-full">

          {/* Logo & Mobile Button */}
          <div onMouseEnter={() => setMegaOpen(false)} className="flex justify-between items-center w-full md:w-fit gap-x-4">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

            <Link dir="ltr" to="/" className="flex items-center gap-x-2 group">
              <div className="flex items-center justify-center rounded-xl text-white shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform duration-300">
                <img src="/logo.jpeg" alt="Idea Foundation" className="size-14 rounded-full" />
              </div>
              <div className="flex flex-col place-self-end">
                <span className="text-sm font-bold text-slate-800 pb-1 tracking-wide">IDEA</span>
                <span className="text-sm font-bold text-slate-800 pb-1 tracking-wide">FOUNDATION</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-1  text-slate-600">
            {[
              { to: '/', label: 'سەرەکی' },
              { to: '/author', label: 'نووسەرەکان' },
              { to: '/about', label: 'دەربارە' },
              { type: 'button', label: 'پۆلەکان', action: () => setMegaOpen(true) },
            ].map((item, idx) =>
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
                  onMouseEnter={() => setMegaOpen(false)}
                  onMouseOut={() => setMegaOpen(false)}
                  className="px-4 py-2 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 text-sm"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Search & Socials */}
          <div className="hidden md:flex items-center gap-x-4">

            {/* ✨ Animated Search */}
            <div ref={searchRef} className="relative flex items-center">
              {/* Search Container */}
              <div
                className={[
                  'relative flex items-center transition-all duration-500 ease-in-out rounded-full',
                  searchOpen
                    ? 'w-72 bg-white border-2 border-orange-300 shadow-lg shadow-orange-100/50'
                    : 'w-11 bg-transparent border-2 border-transparent',
                ].join(' ')}
              >
                {/* Search Icon Button */}
                <button
                  onClick={() => {
                    if (!searchOpen) {
                      setSearchOpen(true);
                    } else if (q) {
                      navigate(`/search?q=${encodeURIComponent(q)}`);
                    }
                  }}
                  className={[
                    'relative z-10 flex items-center justify-center rounded-full transition-all duration-500',
                    searchOpen
                      ? 'h-7 p-2 py-4 mr-0.5  bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:scale-105'
                      : ' h-7 p-2 py-4  text-slate-500 hover:from-orange-50 hover:to-orange-100 hover:text-orange-600 hover:shadow-md hover:shadow-orange-100 hover:scale-110 border border-orange-300 hover:border-orange-200',
                  ].join(' ')}
                  aria-label="Search"
                >
                  <SearchIcon
                    size={searchOpen ? 16 : 20}
                    className={[
                      'transition-all duration-300 scale-110 text-orange-300',
                      searchOpen ? 'rotate-0' : 'rotate-0 group-hover:rotate-12',
                    ].join(' ')}
                  />
                </button>

                {/* Input Field */}
                <input
                  ref={inputRef}
                  dir="rtl"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && q) {
                      navigate(`/search?q=${encodeURIComponent(q)}`);
                      setSearchOpen(false);
                    }
                  }}
                  placeholder="گەڕان بکە..."
                  className={[
                    'bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-500 pr-3',
                    searchOpen
                      ? 'w-full opacity-100 py-2.5'
                      : 'w-0 opacity-0 py-0 pointer-events-none',
                  ].join(' ')}
                />

                {/* Clear / Close Button */}
                {searchOpen && (
                  <button
                    onClick={() => {
                      setQ('');
                      if (!q) {
                        setSearchOpen(false);
                      } else {
                        inputRef.current?.focus();
                      }
                    }}
                    className="flex items-center justify-center h-7 w-7 ml-1 rounded-full text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Glowing ring animation when open */}
              {searchOpen && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-200/20 via-orange-300/10 to-orange-200/20 blur-md -z-10 animate-pulse" />
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-x-2 text-slate-500">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/share/14Y7dNWgcMY/' },
                { icon: Instagram, href: 'https://www.instagram.com/idea__foundation?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
                // { icon: Twitter, href: 'https://twitter.com' },
              ].map((item, i) => {
                const IconComp = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    className="p-2 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <IconComp size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

       
      </div>

      <CategoryMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}

