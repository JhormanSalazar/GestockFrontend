import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import WelcomeSection from './views/WelcomeSection'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route 
            path="/" 
            element={<WelcomeSection />} 
            index
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
