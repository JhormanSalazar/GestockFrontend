// This file is for setting up the base API url 

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function apiUrl (path: string) {
  return `${BASE_URL}/${path}`
}