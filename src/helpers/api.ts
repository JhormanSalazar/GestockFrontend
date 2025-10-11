// This file is for setting up the base API url 

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function apiURL(path: string): string {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Ensure BASE_URL does not end with a slash
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  
  return `${baseUrl}/${cleanPath}`;
}