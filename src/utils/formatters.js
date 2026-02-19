export function authorNames(book) {
  if (!book) return ''
  if (book.author?.name) return book.author.name
  if (typeof book.author === 'string') return book.author
  if (Array.isArray(book.authors)) {
    return book.authors
      .map((a) => (typeof a === 'string' ? a : a?.name))
      .filter(Boolean)
      .join(', ')
  }
  return ''
}

export function truncate(text, len = 140) {
  if (!text) return ''
  if (text.length <= len) return text
  return `${text.slice(0, len - 1)}…`
}

