# 📦 Gestock Frontend

**Gestock** es un sistema de gestión de inventario (MVP) construido con React, JavaScript y Vite.  La aplicación permite a los usuarios gestionar negocios, almacenes y productos con autenticación JWT.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)

---

## 🌟 Características

- ✅ **Autenticación JWT** con Spring Boot backend
- 🏢 **Gestión de Negocios** (registro y configuración)
- 🏪 **Gestión de Almacenes** (CRUD completo)
- 📦 **Gestión de Productos** (inventario y precios)
- 👥 **Gestión de Usuarios** con roles (ADMIN, MANAGER, EMPLOYEE)
- 🎨 **Interfaz moderna** con shadcn/ui y Tailwind CSS
- 🔄 **Estado del servidor** gestionado con TanStack React Query
- 📱 **Diseño responsive** y accesible

---

## 🛠️ Tech Stack

| Categoría | Tecnologías |
|-----------|------------|
| **Frontend** | React 18 con JavaScript (JSX) |
| **Build Tool** | Vite |
| **Backend API** | Spring Boot REST API |
| **Autenticación** | JWT tokens (localStorage) |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Estilos** | Tailwind CSS |
| **Routing** | React Router v6 |
| **Estado** | TanStack React Query |
| **Formularios** | React Hook Form + Zod validation |
| **HTTP Client** | Axios con interceptores |

---

## 📂 Estructura del Proyecto

```
src/
├── config/
│   └── axios.config.js      # Configuración de Axios con interceptores JWT
├── services/                # Capa de servicios API (Spring Boot)
│   ├── api. service.js       # Servicio base con métodos HTTP
│   ├── auth.service.js      # Autenticación (login, register, logout)
│   ├── warehouse.service. js # Operaciones CRUD de almacenes
│   ├── product.service.js   # Operaciones CRUD de productos
│   ├── business.service.js  # Operaciones de negocio
│   ├── user.service.js      # Gestión de usuarios
│   └── index.js             # Exportaciones de servicios
├── hooks/                   # Custom React Hooks
│   ├── useAuth.js           # Autenticación con React Query
│   ├── useWarehouses.js     # Queries y mutations de almacenes
│   ├── useProducts.js       # Queries y mutations de productos
│   ├── useBusiness.js       # Datos del negocio
│   ├── useUsers.js          # Gestión de usuarios
│   └── use-toast.ts         # Notificaciones toast
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── Layout.jsx           # Layout principal con navegación
│   ├── ProtectedRoute.jsx   # HOC para rutas protegidas
│   └── GestockLogo.jsx      # Componente de logo
├── pages/                   # Páginas de rutas
│   ├── Dashboard.jsx        # Dashboard principal con estadísticas
│   ├── Auth.jsx             # Página de autenticación
│   ├── Almacenes.jsx        # Gestión de almacenes
│   ├── AlmacenProductos.jsx # Productos por almacén
│   ├── Productos.jsx        # Gestión de productos
│   ├── Negocios.jsx         # Gestión de negocios
│   ├── Usuarios.jsx         # Gestión de usuarios (ADMIN)
│   └── NotFound.jsx         # Página 404
├── utils/
│   └── rbac.js              # Role-Based Access Control
├── lib/
│   └── utils. ts             # Funciones utilitarias
└── App.jsx                  # Componente raíz con routing
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ o Bun
- Backend Spring Boot corriendo en `http://localhost:8080/gestock`

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/JhormanSalazar/GestockFrontend.git
cd GestockFrontend
```

### Paso 2: Instalar dependencias

```bash
# Con npm
npm install

# O con bun
bun install
```

### Paso 3: Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
# URL del backend API
VITE_API_URL=http://localhost:8080/gestock

# Puerto del servidor de desarrollo (opcional)
# VITE_PORT=3000
```

### Paso 4: Ejecutar en desarrollo

```bash
# Con npm
npm run dev

# O con bun
bun run dev
```

La aplicación estará disponible en `http://localhost:8080` (o el puerto configurado).

---

## 📜 Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Build de producción
npm run build:dev    # Build de desarrollo
npm run preview      # Preview del build de producción
npm run lint         # Ejecuta ESLint
```

---

## 🔐 Autenticación y Roles

### Roles disponibles:
- **ADMIN**: Acceso completo a todo el sistema
- **MANAGER**:  Gestión de almacenes y productos
- **EMPLOYEE**: Acceso de solo lectura

### Flujo de autenticación:
1. Registro de nuevo negocio (crea usuario ADMIN automáticamente)
2. Login con email y password
3. JWT almacenado en `localStorage`
4. Interceptores Axios añaden el token automáticamente
5. Redirección automática al expirar la sesión

---

## 🎨 Componentes UI

Este proyecto utiliza **shadcn/ui**, una colección de componentes reutilizables construidos con: 
- Radix UI (primitivos accesibles)
- Tailwind CSS (estilos)
- Class Variance Authority (variantes)

### Componentes disponibles:

- Accordion, Alert Dialog, Avatar
- Button, Card, Checkbox
- Dialog, Dropdown Menu, Form
- Input, Label, Select
- Table, Tabs, Toast
- Y muchos más...

---

## 🔄 Gestión de Estado

### Estado del Servidor (TanStack React Query)
- Queries para obtener datos (GET)
- Mutations para modificar datos (POST, PUT, DELETE)
- Cache automático e invalidación
- Loading y error states

### Estado de Autenticación
- JWT token en `localStorage`
- Gestionado por `authService`
- Validación automática en cada request

### Ejemplo de uso:

```jsx
import { useProducts } from '@/hooks/useProducts';

function ProductsPage() {
  const { products, createProduct, isLoading } = useProducts();

  const handleCreate = (data) => {
    createProduct. mutate(data);
  };

  if (isLoading) return <div>Cargando... </div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## 📡 Servicios API

Todos los servicios heredan de `ApiService` y proporcionan: 

- **AuthService**: `login()`, `register()`, `logout()`, `getCurrentUser()`
- **WarehouseService**: `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **ProductService**: `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **BusinessService**: `getCurrent()`, `update()`
- **UserService**: `getAll()`, `create()`, `update()`, `delete()` (ADMIN)

---

## 🗺️ Rutas

| Ruta | Componente | Permisos |
|------|-----------|----------|
| `/auth` | Auth | Público |
| `/` | Dashboard | Autenticado |
| `/almacenes` | Almacenes | ADMIN, MANAGER |
| `/almacenes/:id` | AlmacenProductos | ADMIN, MANAGER |
| `/productos` | Productos | ADMIN, MANAGER |
| `/negocios` | Negocios | ADMIN |
| `/usuarios` | Usuarios | ADMIN |

---

## 🤝 Contribución

Las contribuciones son bienvenidas.  Por favor: 

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 👤 Autor

**Jhorman Salazar**

- GitHub: [@JhormanSalazar](https://github.com/JhormanSalazar)

---

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Radix UI](https://www.radix-ui.com/) - Primitivos accesibles
- [Tailwind CSS](https://tailwindcss.com/) - Framework de estilos
- [TanStack Query](https://tanstack.com/query) - Gestión de estado del servidor
- [Vite](https://vitejs.dev/) - Build tool ultrarrápido
