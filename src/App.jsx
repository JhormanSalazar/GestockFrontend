import React from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import GestockRoutes from './routes/GestockRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <GestockRoutes />
    </BrowserRouter>
  )
}
