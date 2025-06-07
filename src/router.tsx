import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './layouts/Layout'

const WelcomeSection = lazy(() => import('./views/WelcomeSection'))
const Services = lazy(() => import('./views/Services'))
const Contact = lazy(() => import('./views/Contact'))

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen font-medium text-gray-500 text-xl">
                    Cargando...
                  </div>
                }
              >
                <WelcomeSection />
              </Suspense>
            }
            index
          />
          <Route
            path="/services"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen font-medium text-gray-500 text-xl">
                    Cargando...
                  </div>
                }
              >
                <Services />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen font-medium text-gray-500 text-xl">
                    Cargando...
                  </div>
                }
              >
                <Contact />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
