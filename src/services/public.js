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
      return {
        data: res.items,
        meta: {
          page: res.page,
          total: res.total,
          total_pages: res.total_pages ?? res.pages,
          per_page: res.per_page ?? res.limit,
        },
      }
    }
    if (Array.isArray(res?.data)) return { data: res.data, meta: res.meta || {} }
    return { data: [], meta: {} }
  })
}

export function getBook(id) {
  return client.get(`/books/${id}`).then((r) => {
    const data = r.data || {}
    const youtubeUrl = String(
      data.youtube_url ||
      data.youtubeUrl ||
      data.video_url ||
      data.videoUrl ||
      data.youtube ||
      data.video ||
      ''
    ).trim()

    return {
      ...data,
      youtube_url: youtubeUrl,
    }
  })
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

export function getAuthor(id) {
  return client.get(`/authors/${id}`).then((r) => r.data)
}

export async function getAuthorCategories(id) {
  try {
    const r = await client.get(`/authors/${id}/categories`)
    const list = Array.isArray(r.data) ? r.data : r.data?.categories || []
    return list
  } catch {
    const detail = await getAuthor(id).catch(() => null)
    const books = Array.isArray(detail?.books) ? detail.books : []
    const detailed = await Promise.all(
      books.map((b) =>
        client
          .get(`/books/${b.id}`)
          .then((res) => res.data)
          .catch(() => null)
      )
    )
    const byId = {}
    detailed
      .filter(Boolean)
      .forEach((d) => {
        const cid = d?.category_id
        const name = d?.category_name
        if (cid && name) {
          byId[cid] = byId[cid] || { id: cid, name, slug: d?.category_slug, total: 0 }
          byId[cid].total += 1
        }
      })
    return Object.values(byId)
  }
}

export async function getAuthorBooks(id, params = {}) {
  const p = { ...(params || {}) }
  try {
    const r = await client.get(`/authors/${id}/books`, { params: p })
    const items = Array.isArray(r.data?.items) ? r.data.items : Array.isArray(r.data) ? r.data : []
    return items
  } catch {
    const detail = await getAuthor(id).catch(() => null)
    let books = Array.isArray(detail?.books) ? detail.books : []
    if (p.category_id) {
      const detailed = await Promise.all(
        books.map((b) =>
          client
            .get(`/books/${b.id}`)
            .then((res) => res.data)
            .catch(() => null)
        )
      )
      books = detailed
        .filter((d) => d && String(d?.category_id) === String(p.category_id))
        .map((d) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          thumbnail: d.thumbnail,
          category_id: d.category_id,
          category_name: d.category_name,
        }))
    }
    return books
  }
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
