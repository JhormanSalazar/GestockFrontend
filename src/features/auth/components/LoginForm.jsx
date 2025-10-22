import React, { useState, useEffect } from 'react'
import { Label, Button, Checkbox } from 'flowbite-react'
import tokenService from '../../../features/api/tokenService'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const saved = localStorage.getItem('remember_email')
      if (saved) {
        setEmail(saved)
        setRememberMe(true)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const validate = () => {
    const err = {}
    if (!email) err.email = 'El email es obligatorio'
    else if (!/^\S+@\S+\.\S+$/.test(email)) err.email = 'Email inválido'
    if (!password) err.password = 'La contraseña es obligatoria'
    else if (password.length < 6) err.password = 'La contraseña debe tener al menos 6 caracteres'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const isFormValid = () => {
    return /^\S+@\S+\.\S+$/.test(email) && password && password.length >= 6
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFormError('')
    setErrors({})
    if (!validate()) {
      setLoading(false)
      return
    }
    try {
      const resp = await tokenService.login({ email, password })
      // resp should contain jwt/token and user info (AuthResponse)
      const token = resp?.accessToken || resp?.token || resp?.jwt
      const user = {
        id: resp?.id,
        email: resp?.email,
        businessId: resp?.businessId,
        role: resp?.role,
      }
      try {
        useAuthStore.getState().setAuth(token, user)
      } catch (e) {}
      try {
        if (rememberMe) localStorage.setItem('remember_email', email)
        else localStorage.removeItem('remember_email')
      } catch (e) {
        // ignore
      }
      navigate('/home')
    } catch (err) {
      console.error('Login error', err)
      setFormError('Error de inicio de sesión: ' + (err?.message || 'revise la consola'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {formError ? (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{formError}</div>
      ) : null}

  <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off" spellCheck={false}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Tu correo electrónico" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nombre@empresa.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Tu contraseña" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <Label htmlFor="remember" className="ml-2 text-sm text-gray-900 dark:text-white">Recordarme</Label>
          </div>

          <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-500">¿Olvidaste tu contraseña?</a>
        </div>

        <Button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          disabled={loading || !isFormValid()}
        >
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </Button>

        {/* Registro eliminado: la aplicación no permite auto-registro */}
      </form>
    </>
  )
}
