export function assetUrl(path) {
  if (!path) return undefined
  const p = String(path)
  if (/^https?:\/\//i.test(p)) return p
  const prefix = import.meta.env.VITE_ASSETS_PATH_PREFIX
  const withPrefix =
    prefix && !p.startsWith(`${prefix}/`) ? `${prefix.replace(/\/$/, '')}/${p.replace(/^\//, '')}` : p
  const assetsBase = import.meta.env.VITE_ASSETS_BASE_URL
  if (assetsBase) {
    try {
      const u = new URL(assetsBase)
      return `${u.origin}/${withPrefix.replace(/^\//, '')}`
    } catch {
      return `${assetsBase}/${withPrefix.replace(/^\//, '')}`
    }
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/'
  try {
    const u = new URL(apiBase)
    return `${u.origin}/${withPrefix.replace(/^\//, '')}`
  } catch {
    return `/${withPrefix.replace(/^\//, '')}`
  }
}
