import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

function cn(...i) {
  return twMerge(clsx(i))
}

export default function Badge({ className, children, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-slate-100 text-slate-800',
    slate: 'bg-slate-900 text-white',
    outline: 'border border-slate-300 text-slate-900',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs', variants[variant], className)} {...props}>
      {children}
    </span>
  )
}

