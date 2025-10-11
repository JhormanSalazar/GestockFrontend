// This file is for setting up the base API url 

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function apiURL(path: string): string {
  // Remove leading slash from path if present to avoid double slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Ensure BASE_URL always ends with a slash
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  
  return `${baseUrl}${cleanPath}`;
}