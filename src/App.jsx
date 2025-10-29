import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PERMISSIONS } from "./utils/rbac";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Almacenes from "./pages/Almacenes";
import AlmacenProductos from "./pages/AlmacenProductos";
import Productos from "./pages/Productos";
import Negocios from "./pages/Negocios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/almacenes"
            element={
              <ProtectedRoute>
                <Almacenes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/almacenes/:id/productos"
            element={
              <ProtectedRoute>
                <AlmacenProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/negocios"
            element={
              <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_ALL_BUSINESSES]}>
                <Negocios />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
