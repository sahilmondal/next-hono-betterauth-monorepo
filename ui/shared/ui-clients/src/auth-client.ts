import { createAuthClient } from 'better-auth/react'

const getApiUrl = () => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL
  }
  return 'http://localhost:3007'
}

export const authClient = createAuthClient({
  baseURL: getApiUrl(),
  basePath: '/auth',
})

