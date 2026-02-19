import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function useQueryParam(key, defaultValue = '') {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const value = searchParams.get(key) ?? defaultValue

  const setValue = useCallback(
    (next, options = {}) => {
      const params = new URLSearchParams(searchParams)
      const v = typeof next === 'function' ? next(value) : next
      if (v === undefined || v === null || v === '') {
        params.delete(key)
      } else {
        params.set(key, String(v))
      }
      const pathname = window.location.pathname
      navigate({ pathname, search: params.toString() }, { replace: !!options.replace })
    },
    [key, navigate, searchParams, value]
  )

  return [value, setValue]
}

export function useQueryParams() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setParams = useCallback(
    (updates, options = {}) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates || {}).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') {
          params.delete(k)
        } else {
          params.set(k, String(v))
        }
      })
      const pathname = window.location.pathname
      navigate({ pathname, search: params.toString() }, { replace: !!options.replace })
    },
    [navigate, searchParams]
  )
  const obj = Object.fromEntries(searchParams.entries())
  return [obj, setParams]
}

