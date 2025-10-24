import { useState } from "react";
import { useWarehouses } from "@/hooks/useWarehouses";
import { authService } from "@/services";
import { canManageWarehouses } from "@/utils/rbac";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Warehouse, MapPin } from "lucide-react";

export default function Almacenes() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    maxCapacity: "",
  });

  const { warehouses, isLoading, createWarehouse } = useWarehouses();
  const userRole = authService.getUserRole();
  const userBusinessId = authService.getBusinessId();
  const canManage = canManageWarehouses(userRole);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: usuario debe tener permisos
    if (!canManage) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para crear almacenes",
        variant: "destructive",
      });
      return;
    }

    // Preparar datos para enviar al backend
    const warehouseData = {
      name: formData.name,
      address: formData.address || null,
      maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null,
      businessId: userBusinessId, // Usar businessId del usuario autenticado
    };

    createWarehouse.mutate(warehouseData, {
      onSuccess: () => {
        toast({
          title: "Almacén creado",
          description: "El almacén ha sido creado exitosamente",
        });
        setOpen(false);
        setFormData({ name: "", address: "", maxCapacity: "" });
      },
      onError: (error) => {
        toast({
          title: "Error al crear almacén",
          description: error.message || "No se pudo crear el almacén",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Almacenes</h1>
            <p className="text-muted-foreground">Gestiona tus ubicaciones de almacenamiento</p>
          </div>

          {canManage && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Almacén
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Crear nuevo almacén</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del almacén</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background/50"
                      placeholder="Ej: Almacén Central"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Ubicación</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-background/50"
                      placeholder="Ej: Calle 123, Ciudad"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Capacidad máxima</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                      className="bg-background/50"
                      placeholder="Ej: 1000"
                      min="0"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent"
                    disabled={createWarehouse.isPending}
                  >
                    {createWarehouse.isPending ? "Creando..." : "Crear Almacén"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoading ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <p className="text-muted-foreground">Cargando almacenes...</p>
          </Card>
        ) : !warehouses || warehouses.length === 0 ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <Warehouse className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay almacenes registrados</h3>
            <p className="text-muted-foreground mb-4">
              {canManage
                ? "Comienza creando tu primer almacén para organizar tu inventario"
                : "No tienes acceso a almacenes en este momento"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {warehouses.map((warehouse) => (
              <Card
                key={warehouse.id}
                className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Warehouse className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{warehouse.name}</h3>
                {warehouse.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {warehouse.address}
                  </div>
                )}
                {warehouse.maxCapacity && (
                  <div className="text-sm text-muted-foreground">
                    Capacidad: {warehouse.maxCapacity} unidades
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
