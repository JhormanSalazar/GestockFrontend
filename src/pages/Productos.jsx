import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Package, AlertCircle } from "lucide-react";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    sku: "",
    cantidad: "",
    precio_unitario: "",
    stock_minimo: "",
    almacen_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productosRes, almacenesRes] = await Promise.all([
      supabase.from("productos").select("*").order("created_at", { ascending: false }),
      supabase.from("almacenes").select("id, nombre"),
    ]);

    if (productosRes.data) setProductos(productosRes.data);
    if (almacenesRes.data) setAlmacenes(almacenesRes.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("productos").insert({
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      sku: formData.sku || null,
      cantidad: parseInt(formData.cantidad),
      precio_unitario: formData.precio_unitario ? parseFloat(formData.precio_unitario) : null,
      stock_minimo: formData.stock_minimo ? parseInt(formData.stock_minimo) : 0,
      almacen_id: formData.almacen_id,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Producto creado",
      description: "El producto ha sido registrado exitosamente",
    });

    setOpen(false);
    setFormData({
      nombre: "",
      descripcion: "",
      sku: "",
      cantidad: "",
      precio_unitario: "",
      stock_minimo: "",
      almacen_id: "",
    });
    loadData();
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Productos</h1>
            <p className="text-muted-foreground">Control completo de tu inventario</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar nuevo producto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="almacen">Almacén</Label>
                  <Select
                    value={formData.almacen_id}
                    onValueChange={(value) => setFormData({ ...formData, almacen_id: value })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecciona un almacén" />
                    </SelectTrigger>
                    <SelectContent>
                      {almacenes.map((almacen) => (
                        <SelectItem key={almacen.id} value={almacen.id}>
                          {almacen.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del producto</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio unitario</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={formData.precio_unitario}
                      onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_min">Stock mínimo</Label>
                    <Input
                      id="stock_min"
                      type="number"
                      value={formData.stock_minimo}
                      onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  Registrar Producto
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {productos.length === 0 ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay productos registrados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza registrando tus primeros productos en el inventario
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => {
              const stockBajo = producto.cantidad <= producto.stock_minimo;
              return (
                <Card
                  key={producto.id}
                  className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    {stockBajo && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Stock bajo
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{producto.nombre}</h3>
                  {producto.sku && (
                    <p className="text-sm text-muted-foreground mb-2">SKU: {producto.sku}</p>
                  )}
                  {producto.descripcion && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {producto.descripcion}
                    </p>
                  )}

                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cantidad:</span>
                      <span className="font-semibold">{producto.cantidad}</span>
                    </div>
                    {producto.precio_unitario && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Precio unitario:</span>
                        <span className="font-semibold">
                          ${Number(producto.precio_unitario).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock mínimo:</span>
                      <span className="font-semibold">{producto.stock_minimo}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
