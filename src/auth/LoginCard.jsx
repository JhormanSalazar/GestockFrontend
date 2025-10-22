import React, { useState } from 'react'
import { Card } from 'flowbite-react'
import Banner from '../features/auth/components/Banner'
import LoginForm from '../features/auth/components/LoginForm'

export default function LoginCard() {
  // registro eliminado: ya no hay estado para mostrar info de registro

  const backgroundUrl = 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735'

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image blurred */}
      <div
        aria-hidden
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url('${backgroundUrl}')`,
          filter: 'blur(6px) brightness(0.6)',
          transform: 'scale(1.03)'
        }}
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/25" aria-hidden />

      <div className="relative z-10 w-full max-w-2xl px-4">
  <Card className="login-card mx-auto max-w-md w-full p-6 shadow-2xl rounded-2xl border-t-8 border-blue-600 bg-white/90 dark:bg-gray-800/80">
          <Banner />
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Inicia Sesión en tu Inventario</h2>
          <LoginForm />
        </Card>
        {/* registro UI removida */}
      </div>
    </div>
  )
}
// ahora la validación y la lógica del formulario está dentro de LoginForm.jsx
