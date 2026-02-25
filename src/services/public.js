import client from '../api/client'

export function getBooks(params = {}) {
  const p = { ...(params || {}) }
  if (p.q == null && p.search != null) p.q = p.search
  delete p.search
  if (p.limit == null && p.per_page != null) p.limit = p.per_page
  delete p.per_page
  return client.get('/books', { params: p }).then((r) => {
    const res = r.data
    if (Array.isArray(res)) return { data: res, meta: {} }
    if (Array.isArray(res?.items)) {
      return { data: res.items, meta: { page: res.page, total_pages: res.total_pages ?? res.pages } }
    }
    if (Array.isArray(res?.data)) return { data: res.data, meta: res.meta || {} }
    return { data: [], meta: {} }
  })
}

export function getBook(id) {
  return client.get(`/books/${id}`).then((r) => r.data)
}

export async function downloadBook(id) {
  const response = await client.get(`/books/${id}/download`)
  const url = response.data?.url
  return { url }
}

export function getCategories() {
  return client.get('/categories').then((r) => r.data?.categories || r.data?.data || r.data || [])
}

export function getAuthors() {
  return client.get('/authors').then((r) => r.data)
}

export function getSettings() {
  return client.get('/settings').then((r) => {
    const d = r.data || {}
    return {
      site_name: d.site_name || d.siteName || d['site name'] || d.title,
      contact_email: d.contact_email || d.contactEmail || d['contact email'] || d.email,
      tagline: d.tagline || d.description,
      raw: d,
    }
  })
}

export function getCategoriesAll() {
  return client.get('/categories').then((r) => {
    const cats = r.data?.categories || r.data?.data || r.data || []
    const subs = r.data?.subcategories || []
    return { categories: cats, subcategories: subs }
  })
}
