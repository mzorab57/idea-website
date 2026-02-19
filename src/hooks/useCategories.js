import { useQuery } from '@tanstack/react-query'
import { getCategoriesAll } from '../services/public'

export default function useCategories() {
  return useQuery({
    queryKey: ['categories-merged'],
    queryFn: async () => {
      const { categories = [], subcategories = [] } = await getCategoriesAll()
      const byId = {}
      categories.forEach((c) => {
        byId[c.id] = { ...c, subcategories: Array.isArray(c.subcategories) ? c.subcategories : [] }
      })
      subcategories.forEach((s) => {
        const cid = s.category_id
        if (byId[cid]) {
          byId[cid].subcategories = byId[cid].subcategories || []
          byId[cid].subcategories.push(s)
        }
      })
      return Object.values(byId)
    },
  })
}
