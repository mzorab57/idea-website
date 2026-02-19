import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

function cn(...i) {
  return twMerge(clsx(i))
}

export default function Button({ className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border border-slate-300 text-slate-900 hover:bg-slate-50',
    ghost: 'text-slate-900 hover:bg-slate-100',
  }
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm transition-colors disabled:opacity-60'
  return <button className={cn(base, variants[variant], className)} {...props} />
}
