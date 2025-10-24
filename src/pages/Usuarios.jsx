import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { authService } from "@/services";
import { canManageUsers, getRoleLabel, isAdmin } from "@/utils/rbac";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Users, Trash2, Shield, Building } from "lucide-react";

// Roles disponibles (IDs del backend)
const ROLES = [
  { id: 1, name: "ADMIN", label: "Administrador" },
  { id: 2, name: "BUSINESS_OWNER", label: "Dueño de Negocio" },
  { id: 3, name: "COLLABORATOR", label: "Colaborador" },
];

export default function Usuarios() {
  const [openCreate, setOpenCreate] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roleId: "3", // COLLABORATOR por defecto
  });

  const { users, isLoading, refetch, createUser, deleteUser, isCreating, isDeleting } = useUsers();
  const userRole = authService.getUserRole();
  const userBusinessId = authService.getBusinessId();
  const canManage = canManageUsers(userRole);
  const isUserAdmin = isAdmin(userRole);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (canManage) {
      refetch();
    }
  }, [canManage, refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canManage) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para crear usuarios",
        variant: "destructive",
      });
      return;
    }

    // Preparar datos para enviar al backend
    const userData = {
      email: formData.email,
      password: formData.password,
      businessId: userBusinessId, // Usuario pertenece al negocio del creador
      roleId: parseInt(formData.roleId),
    };

    createUser.mutate(userData, {
      onSuccess: () => {
        setOpenCreate(false);
        setFormData({ email: "", password: "", roleId: "3" });
      },
      onError: (error) => {
        // El toast ya se muestra en el hook, pero podemos agregar lógica adicional
        console.error("Error al crear usuario:", error);
      },
    });
  };

  const handleDelete = () => {
    if (!userToDelete) return;

    deleteUser.mutate(userToDelete.id, {
      onSuccess: () => {
        setUserToDelete(null);
      },
      onError: (error) => {
        console.error("Error al eliminar usuario:", error);
      },
    });
  };

  const getRoleBadgeVariant = (roleName) => {
    switch (roleName) {
      case "ADMIN":
        return "destructive";
      case "BUSINESS_OWNER":
        return "default";
      case "COLLABORATOR":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Filtrar usuarios según el rol del usuario autenticado
  const filteredUsers = isUserAdmin
    ? users // ADMIN ve todos los usuarios
    : users.filter((user) => user.businessId === userBusinessId); // BUSINESS_OWNER solo ve usuarios de su negocio

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Usuarios</h1>
            <p className="text-muted-foreground">Gestiona los usuarios de tu organización</p>
          </div>

          {canManage && (
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Crear nuevo usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background/50"
                      placeholder="usuario@ejemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="bg-background/50"
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={formData.roleId}
                      onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Define los permisos del usuario
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creando..." : "Crear Usuario"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoading ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <p className="text-muted-foreground">Cargando usuarios...</p>
          </Card>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay usuarios registrados</h3>
            <p className="text-muted-foreground mb-4">
              {canManage
                ? "Comienza creando usuarios para tu equipo"
                : "No tienes acceso a la gestión de usuarios"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant={getRoleBadgeVariant(user.roleName)}>
                    {getRoleLabel(user.roleName)}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold mb-2 truncate">{user.email}</h3>

                <div className="space-y-2">
                  {user.businessName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span className="truncate">{user.businessName}</span>
                    </div>
                  )}

                  {canManage && (
                    <div className="pt-4 border-t border-border/50">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => setUserToDelete(user)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Diálogo de confirmación para eliminar */}
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent className="glass-card border-border/50">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El usuario{" "}
                <span className="font-semibold">{userToDelete?.email}</span> será eliminado
                permanentemente del sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
