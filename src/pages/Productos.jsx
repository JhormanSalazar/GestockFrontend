import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { authService } from "@/services";
import { canManageProducts } from "@/utils/rbac";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Package } from "lucide-react";

export default function Productos() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    description: "",
  });

  const { products, isLoading, createProduct } = useProducts();
  const userRole = authService.getUserRole();
  const canManage = canManageProducts(userRole);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: usuario debe tener permisos
    if (!canManage) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para crear productos",
        variant: "destructive",
      });
      return;
    }

    // Preparar datos para enviar al backend
    const productData = {
      name: formData.name,
      sku: formData.sku || null,
      price: formData.price ? parseFloat(formData.price) : 0,
      description: formData.description || null,
    };

    createProduct.mutate(productData, {
      onSuccess: () => {
        toast({
          title: "Producto creado",
          description: "El producto ha sido registrado en el catálogo",
        });
        setOpen(false);
        setFormData({ name: "", sku: "", price: "", description: "" });
      },
      onError: (error) => {
        toast({
          title: "Error al crear producto",
          description: error.message || "No se pudo crear el producto",
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
            <h1 className="text-4xl font-bold gradient-text mb-2">Productos</h1>
            <p className="text-muted-foreground">Control completo de tu inventario</p>
          </div>

          {canManage && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Registrar nuevo producto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del producto</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-background/50"
                        placeholder="Ej: Laptop HP"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="bg-background/50"
                        placeholder="Ej: LAP-HP-001"
                      />
                      <p className="text-xs text-muted-foreground">Código único del producto</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="bg-background/50"
                      placeholder="0.00"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-background/50"
                      placeholder="Descripción del producto..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent"
                    disabled={createProduct.isPending}
                  >
                    {createProduct.isPending ? "Registrando..." : "Registrar Producto"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoading ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <p className="text-muted-foreground">Cargando productos...</p>
          </Card>
        ) : !products || products.length === 0 ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay productos registrados</h3>
            <p className="text-muted-foreground mb-4">
              {canManage
                ? "Comienza registrando tus primeros productos en el catálogo"
                : "No hay productos disponibles en este momento"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                {product.sku && (
                  <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
                )}
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="font-semibold">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Gestión de stock disponible en la sección de almacenes
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
