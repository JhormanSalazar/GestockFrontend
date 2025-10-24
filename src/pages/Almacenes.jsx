import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Warehouse, MapPin } from "lucide-react";

export default function Almacenes() {
  const [almacenes, setAlmacenes] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    capacidad_maxima: "",
    negocio_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [almacenesRes, negociosRes] = await Promise.all([
      supabase.from("almacenes").select("*").order("created_at", { ascending: false }),
      supabase.from("negocios").select("id, nombre"),
    ]);

    if (almacenesRes.data) setAlmacenes(almacenesRes.data);
    if (negociosRes.data) setNegocios(negociosRes.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("almacenes").insert({
      nombre: formData.nombre,
      ubicacion: formData.ubicacion || null,
      capacidad_maxima: formData.capacidad_maxima ? parseInt(formData.capacidad_maxima) : null,
      negocio_id: formData.negocio_id,
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
      title: "Almacén creado",
      description: "El almacén ha sido creado exitosamente",
    });

    setOpen(false);
    setFormData({ nombre: "", ubicacion: "", capacidad_maxima: "", negocio_id: "" });
    loadData();
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Almacenes</h1>
            <p className="text-muted-foreground">Gestiona tus ubicaciones de almacenamiento</p>
          </div>

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
                  <Label htmlFor="negocio">Negocio</Label>
                  <Select
                    value={formData.negocio_id}
                    onValueChange={(value) => setFormData({ ...formData, negocio_id: value })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecciona un negocio" />
                    </SelectTrigger>
                    <SelectContent>
                      {negocios.map((negocio) => (
                        <SelectItem key={negocio.id} value={negocio.id}>
                          {negocio.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del almacén</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidad">Capacidad máxima</Label>
                  <Input
                    id="capacidad"
                    type="number"
                    value={formData.capacidad_maxima}
                    onChange={(e) => setFormData({ ...formData, capacidad_maxima: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  Crear Almacén
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {almacenes.length === 0 ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <Warehouse className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay almacenes registrados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza creando tu primer almacén para organizar tu inventario
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {almacenes.map((almacen) => (
              <Card
                key={almacen.id}
                className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Warehouse className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{almacen.nombre}</h3>
                {almacen.ubicacion && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {almacen.ubicacion}
                  </div>
                )}
                {almacen.capacidad_maxima && (
                  <div className="text-sm text-muted-foreground">
                    Capacidad: {almacen.capacidad_maxima} unidades
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
