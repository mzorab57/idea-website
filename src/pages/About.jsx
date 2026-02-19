import { useQuery } from '@tanstack/react-query'
import { getSettings } from '../services/public'
import Seo from '../seo/Seo.jsx'

export default function About() {
  const { data } = useQuery({ queryKey: ['settings'], queryFn: getSettings })
  const title = data?.site_name || 'Idea Foundation'
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Seo title={`About • ${title}`} />
      <h1 className="font-serif text-2xl text-slate-900">About</h1>
      <p className="mt-4 text-slate-700 leading-7">
        {title} is a public-facing archive and research platform dedicated to preserving and sharing ideas.
      </p>
      {data?.contact_email ? (
        <p className="mt-4 text-slate-700">Contact: {data.contact_email}</p>
      ) : null}
    </div>
  )
}

