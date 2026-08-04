import { hc } from 'hono/client'
import type { AppType } from 'hono-api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3007'

export const api = hc<AppType>(API_URL)
