import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Send, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const navLinks = [
    { to: '/', label: 'سەرەکی' },
    { to: '/author', label: 'نووسەرەکان' },
    { to: '/about', label: 'دەربارە' },
  ]
  const socialLinks = [
    { href: 'https://www.facebook.com/share/14Y7dNWgcMY/', label: 'Facebook', icon: Facebook },
    { href: 'https://www.instagram.com/idea__foundation?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', label: 'Instagram', icon: Instagram },
    { href: 'https://youtube.com/@ideamagazine2147?si=i0z3doZRK8Fmawqd', label: 'YouTube', icon: Youtube },
    { href: 'https://t.me/idea2004', label: 'Telegram', icon: Send },
  ]
  return (
    <footer dir="rtl" className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.jpeg" alt="Idea Foundation" className="size-24  " />
              <div className="flex flex-col">
                <span className="text-base font-semibold text-stone-900"><span className="text-orange-400">IDEA</span> FOUNDATION</span>
                <span className="text-sm text-orange-500">دەزگای ئایدیا</span>
              </div>
            </Link>
            <p className="text-sm leading-7 text-stone-500">
              دەزگای ئایدیا بۆ فیکر و لێکۆڵینەوە
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-600">بەشەکان</h3>
            <div className="flex flex-col gap-3 text-sm">
              {navLinks.map((item) => (
                <Link
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  key={item.to}
                  to={item.to}
                  className=" transition-colors text-orange-400 hover:text-orange-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-600">پەیوەندی و سۆشیال</h3>
            <div className="flex items-center gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5 border-orange-300 bg-orange-50 text-orange-400"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
            <div className="space-y-2 text-sm text-stone-600">
              <a
                href="https://wa.me/9647709556990"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors "
              >
                <Phone size={16} />
                
                <span className='text-orange-400 hover:text-orange-600'> 07709556990</span>
              </a>
              <a
                href="mailto:a.bazgr@gmail.com"
                className="flex items-center gap-2 transition-colors hover:text-orange-600"
              >
                <Mail size={16} />
                <span className='text-orange-400 hover:text-orange-600'>a.bazgr@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-100 pt-5 text-center text-sm text-stone-500">
        <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Idea Foundation All rights reserved. Developed by{' '}
            <a 
              href="https://wa.me/9647701411893" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-600 transition-colors"

            >
              Al-Code
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
