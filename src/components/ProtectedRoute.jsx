import { Navigate } from 'react-router-dom';
import { authService } from '@/services';
import { hasAnyPermission } from '@/utils/rbac';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

/**
 * ProtectedRoute - Componente para proteger rutas basado en autenticación y permisos
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si tiene acceso
 * @param {string[]} props.requiredPermissions - Array de permisos requeridos (OR - necesita al menos uno)
 * @param {boolean} props.requireAuth - Si requiere autenticación (default: true)
 * @param {string} props.redirectTo - Ruta a redirigir si no tiene acceso (default: '/auth')
 */
export const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requireAuth = true,
  redirectTo = '/auth',
}) => {
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(null); // null = loading, true = access, false = no access

  useEffect(() => {
    const checkAccess = () => {
      // Verificar autenticación
      const isAuthenticated = authService.isAuthenticated();

      if (requireAuth && !isAuthenticated) {
        setHasAccess(false);
        toast({
          title: 'Acceso denegado',
          description: 'Debes iniciar sesión para acceder a esta página',
          variant: 'destructive',
        });
        return;
      }

      // Si no requiere permisos específicos, tiene acceso
      if (!requiredPermissions || requiredPermissions.length === 0) {
        setHasAccess(true);
        return;
      }

      // Verificar permisos
      const userRole = authService.getUserRole();

      if (!userRole) {
        setHasAccess(false);
        toast({
          title: 'Error de autenticación',
          description: 'No se pudo verificar tu rol de usuario',
          variant: 'destructive',
        });
        return;
      }

      const hasRequiredPermissions = hasAnyPermission(userRole, requiredPermissions);

      if (!hasRequiredPermissions) {
        setHasAccess(false);
        toast({
          title: 'Acceso denegado',
          description: 'No tienes permisos suficientes para acceder a esta página',
          variant: 'destructive',
        });
        return;
      }

      // Tiene acceso
      setHasAccess(true);
    };

    checkAccess();
  }, [requiredPermissions, requireAuth, toast]);

  // Mientras verifica acceso, no renderizar nada (o podrías mostrar un loader)
  if (hasAccess === null) {
    return null;
  }

  // Si no tiene acceso, redirigir
  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  // Tiene acceso, renderizar children
  return children;
};

export default ProtectedRoute;
