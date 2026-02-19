import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/'

const client = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  },
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const resp = error?.response
    const data = resp?.data
    const isBlob = data instanceof Blob
    const message =
      (!isBlob && (data?.message || data?.error)) ||
      error.message ||
      'Request failed'
    return Promise.reject({ ...error, message })
  }
)

export default client

