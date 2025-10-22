import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import HomePage from '../pages/HomePage'

export default function GestockRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/home" element={<HomePage />} />
			{/* root goes to login */}
			<Route path="/" element={<Navigate to="/login" replace />} />
			{/* default redirect to login */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	)
}
