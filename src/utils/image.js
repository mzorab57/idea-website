export function placeholder() {
  return '/logo.jpeg'
}

export function getPopupImageUrl(dbPath) {
  if (!dbPath) return placeholder(400, 600)
  const p = String(dbPath).trim()
  if (/^https?:\/\//i.test(p)) return p
  const base = (import.meta.env.VITE_R2_PUBLIC_DOMAIN || '').replace(/\/$/, '')
  const cleaned = p.replace(/^\/+/, '').replace(/^idea-foundation-vault\//, '')
  if (!base) return placeholder(400, 600)
  return `${base}/${cleaned}`
}
