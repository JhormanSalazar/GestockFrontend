# 📋 Guía de Migración: Supabase → Spring Boot API

Este documento explica cómo completar la migración del frontend de Supabase al backend Spring Boot.

## ✅ COMPLETADO

La arquitectura de servicios y hooks ya está implementada:

### 1. Configuración de Axios ✅
- **Archivo**: `src/config/axios.config.js`
- Interceptores JWT configurados
- Manejo automático de errores 401, 403, 500
- Redirección automática en caso de sesión expirada

### 2. Servicios API ✅
Todos los servicios están en `src/services/`:
- `api.service.js` - Clase base con métodos HTTP genéricos
- `auth.service.js` - Login, register, logout, validaciones
- `warehouse.service.js` - CRUD completo de bodegas
- `product.service.js` - CRUD completo de productos
- `business.service.js` - Operaciones de negocio
- `user.service.js` - Gestión de usuarios

### 3. Custom Hooks con React Query ✅
Todos los hooks están en `src/hooks/`:
- `useAuth.js` - Autenticación y estado de sesión
- `useWarehouses.js` - Gestión de bodegas con queries y mutations
- `useProducts.js` - Gestión de productos con queries y mutations
- `useBusiness.js` - Datos del negocio actual
- `useUsers.js` - Gestión de usuarios (ADMIN)

---

## 🔧 PASOS PARA COMPLETAR LA MIGRACIÓN

### PASO 1: Configurar Variables de Entorno

1. Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Editar `.env` y configurar la URL del backend:
```env
VITE_API_URL=http://localhost:8080/gestock
```

### PASO 2: Eliminar/Comentar Código de Supabase

**Archivos a modificar:**

1. **`src/integrations/supabase/client.ts`**
   - Comentar o eliminar (ya no se necesita)

2. **`src/pages/Auth.jsx`**
   - Reemplazar llamadas a Supabase por `useAuth` hook
   - Ejemplo:
   ```jsx
   import { useAuth } from '@/hooks/useAuth';

   function Auth() {
     const { loginMutation, registerMutation } = useAuth();

     const handleLogin = (data) => {
       loginMutation.mutate({
         email: data.email,
         password: data.password
       });
     };

     const handleRegister = (data) => {
       registerMutation.mutate({
         businessName: data.businessName,
         email: data.email,
         password: data.password
       });
     };

     return (
       // Tu formulario aquí
       // Usar handleLogin y handleRegister en los forms
     );
   }
   ```

3. **`src/pages/Dashboard.jsx`**
   - Reemplazar queries de Supabase por hooks:
   ```jsx
   import { useWarehouses } from '@/hooks/useWarehouses';
   import { useProducts } from '@/hooks/useProducts';
   import { useCurrentBusiness } from '@/hooks/useBusiness';

   function Dashboard() {
     const { business, isLoading: loadingBusiness } = useCurrentBusiness();
     const { warehouses, isLoading: loadingWarehouses } = useWarehouses();
     const { products, isLoading: loadingProducts } = useProducts();

     if (loadingBusiness || loadingWarehouses || loadingProducts) {
       return <div>Loading...</div>;
     }

     return (
       // Tu dashboard aquí con los datos
     );
   }
   ```

4. **`src/pages/Almacenes.jsx`**
   - Reemplazar por `useWarehouses`:
   ```jsx
   import { useWarehouses } from '@/hooks/useWarehouses';

   function Almacenes() {
     const {
       warehouses,
       createWarehouse,
       updateWarehouse,
       deleteWarehouse,
       isLoading
     } = useWarehouses();

     const handleCreate = (formData) => {
       createWarehouse.mutate({
         name: formData.name,
         address: formData.address
       });
     };

     const handleUpdate = (id, formData) => {
       updateWarehouse.mutate({
         id,
         data: formData
       });
     };

     const handleDelete = (id) => {
       deleteWarehouse.mutate(id);
     };

     return (
       // Tu UI aquí
     );
   }
   ```

5. **`src/pages/Productos.jsx`**
   - Reemplazar por `useProducts`:
   ```jsx
   import { useProducts } from '@/hooks/useProducts';

   function Productos() {
     const {
       products,
       createProduct,
       updateProduct,
       deleteProduct,
       formatPrice,
       isLoading
     } = useProducts();

     const handleCreate = (formData) => {
       createProduct.mutate({
         name: formData.name,
         price: parseFloat(formData.price),
         description: formData.description
       });
     };

     return (
       // Tu UI aquí
     );
   }
   ```

### PASO 3: Actualizar Layout y Navegación

**`src/components/Layout.jsx`**:
```jsx
import { useAuth } from '@/hooks/useAuth';
import { useCurrentBusiness } from '@/hooks/useBusiness';

function Layout({ children }) {
  const { logout, currentUser, isAuthenticated } = useAuth();
  const { business } = useCurrentBusiness();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <div>
      <header>
        <h1>{business?.name || 'Gestock'}</h1>
        <p>Usuario: {currentUser?.email}</p>
        <button onClick={logout}>Cerrar Sesión</button>
      </header>

      <nav>
        {/* Tu navegación */}
      </nav>

      <main>{children}</main>
    </div>
  );
}
```

### PASO 4: Proteger Rutas

**`src/App.jsx`**:
```jsx
import { authService } from '@/services';
import { Navigate } from 'react-router-dom';

// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

// En tus rutas
<Routes>
  <Route path="/auth" element={<Auth />} />
  <Route path="/" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  {/* Resto de rutas protegidas */}
</Routes>
```

### PASO 5: Actualizar package.json

Asegurar que las dependencias estén actualizadas:
```bash
npm install @tanstack/react-query axios
```

### PASO 6: Configurar Puerto del Frontend

**Opción A: Cambiar puerto de Vite a 3000** (Recomendado)

Editar `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  // ... resto de config
});
```

**Opción B: Mantener puerto 8080 de Vite**

Cambiar el puerto del backend Spring Boot en `application.properties`:
```properties
server.port=8081
```

Y actualizar `.env`:
```env
VITE_API_URL=http://localhost:8081/gestock
```

---

## 🧪 TESTING

### 1. Probar Autenticación
```javascript
// En la consola del navegador
import { authService } from '@/services';

// Registrar
await authService.register({
  businessName: 'Test Business',
  email: 'test@test.com',
  password: 'Test123'
});

// Login
const user = await authService.login({
  email: 'test@test.com',
  password: 'Test123'
});

console.log(user); // Debe mostrar { id, email, jwt, businessId, role }
```

### 2. Probar Servicios
```javascript
import { warehouseService, productService } from '@/services';

// Crear bodega
const warehouse = await warehouseService.create({
  name: 'Bodega Principal',
  address: 'Calle 123'
});

// Crear producto
const product = await productService.create({
  name: 'Laptop HP',
  price: 1500000,
  description: 'Laptop HP 15.6"'
});
```

---

## ⚠️ ISSUES CONOCIDOS DEL BACKEND

Los siguientes problemas fueron detectados en el backend y deben corregirse:

1. **WarehouseController.java línea 44**: Falta `@PathVariable` en método `updateWarehouse`
2. **BusinessResponseDto**: Campo `name` definido como `Long` en lugar de `String`
3. **WarehouseResponseDto**: Campo `businessName` definido como `Long` en lugar de `String`
4. **ProductController**: Método `createProduct` retorna `Product` entity en lugar de `ProductResponseDto`
5. **UserController**: Método `createUser` retorna `User` entity en lugar de `UserResponseDto`

---

## 📚 EJEMPLOS DE USO

### Formulario de Login
```jsx
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { loginMutation, isLoggingIn } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" required />
      <input {...register('password')} type="password" required />
      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### Lista de Bodegas con Acciones
```jsx
import { useWarehouses } from '@/hooks/useWarehouses';

function WarehousesList() {
  const { warehouses, deleteWarehouse, isLoading } = useWarehouses();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      {warehouses.map(warehouse => (
        <div key={warehouse.id}>
          <h3>{warehouse.name}</h3>
          <p>{warehouse.address}</p>
          <button onClick={() => deleteWarehouse.mutate(warehouse.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 VENTAJAS DE LA NUEVA ARQUITECTURA

1. **Centralización**: Toda la lógica de API en servicios reutilizables
2. **Type Safety**: Mejor autocompletado y documentación con JSDoc
3. **Caché Inteligente**: React Query maneja el caché automáticamente
4. **Optimistic Updates**: Posibilidad de actualizar UI antes de confirmar con servidor
5. **Error Handling**: Manejo consistente de errores en toda la app
6. **Testability**: Servicios fáciles de testear de forma aislada
7. **Separation of Concerns**: Lógica de negocio separada de componentes UI

---

## 📞 SOPORTE

Si encuentras problemas durante la migración:
1. Revisa la consola del navegador para errores
2. Verifica que el backend esté corriendo en el puerto correcto
3. Confirma que las variables de entorno estén configuradas
4. Revisa la documentación de los hooks y servicios (JSDoc)

