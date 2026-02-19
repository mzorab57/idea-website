export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-serif text-lg text-slate-900">Idea Foundation</p>
          <p className="text-sm text-slate-600">
            © {year} Idea Foundation. All rights reserved.
          </p>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          <p>Contact: info@ideafoundation.org</p>
        </div>
      </div>
    </footer>
  )
}

