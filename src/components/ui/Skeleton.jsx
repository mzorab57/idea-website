import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

function cn(...i) {
  return twMerge(clsx(i))
}

export default function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded bg-slate-200', className)} />
}

