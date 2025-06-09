import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './layouts/Layout'
import { motion } from 'framer-motion'
import AdminLayout from './layouts/AdminLayout'
import AdminDasboard from './views/admin/AdminDasboard'

const WelcomeSection = lazy(() => import('./views/WelcomeSection'))
const Services = lazy(() => import('./views/Services'))
const Contact = lazy(() => import('./views/Contact'))
const Login = lazy(() => import('./views/login/Login'))

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen font-medium text-gray-500 text-xl">
    Cargando...
  </div>
)

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Login />
              </motion.div>
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <WelcomeSection />
              </Suspense>
            }
            index
          />
          <Route
            path="/services"
            element={
              <Suspense fallback={<PageLoader />}>
                <Services />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<PageLoader />}>
                <Contact />
              </Suspense>
            }
          />
        </Route>
        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" 
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminDasboard />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
