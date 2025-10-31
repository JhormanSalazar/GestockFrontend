import { useEffect, useState } from "react";
import { warehouseService, warehouseProductService, productService } from "@/services";
import { Card } from "@/components/ui/card";
import { Package, Warehouse, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Dashboard() {
  const [stats, setStats] = useState({
    almacenes: 0,
    productos: 0,
    valorTotal: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [almacenesRes, warehouseProductsRes, productosRes] = await Promise.all([
        warehouseService.getByBusinessId(),
        warehouseProductService.getByBusiness(),
        productService.getByBusinessId(),
      ]);

      const almacenesList = almacenesRes || [];
      const warehouseProductsList = warehouseProductsRes || [];
      const productosList = productosRes || [];

      // Crear un mapa de productos por ID para acceso rápido al precio
      const productosMap = new Map(
        productosList.map(p => [p.id, p])
      );

      // Calcular valor total: suma de (quantity * precio) para todos los productos en almacenes
      const valorTotal = warehouseProductsList.reduce((sum, wp) => {
        const quantity = wp.quantity ?? 0;
        const producto = productosMap.get(wp.productId);
        const precio = Number(producto?.price ?? 0) || 0;
        return sum + quantity * precio;
      }, 0);

      setStats({
        almacenes: almacenesList.length || 0,
        productos: warehouseProductsList.length || 0,
        valorTotal,
      });
    } catch (error) {
      // en caso de error, dejar todo en 0 y opcionalmente loguear
      console.error('Error cargando estadísticas:', error);
      setStats({ almacenes: 0, productos: 0, valorTotal: 0 });
    }
  };

  const statCards = [
    {
      title: "Almacenes",
      value: stats.almacenes,
      icon: Warehouse,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Productos",
      value: stats.productos,
      icon: Package,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Valor Total",
      value: `$${stats.valorTotal.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general de tu sistema de inventario
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="glass-card p-8 border-border/50">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Bienvenido a gestock</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tu sistema de gestión de inventarios está listo. Comienza agregando
              almacenes y registra tus productos para mantener un control completo
              de tu inventario.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="font-semibold mb-1">1. Agrega almacenes</h3>
                <p className="text-sm text-muted-foreground">
                  Organiza tus ubicaciones de almacenamiento
                </p>
              </div>
              <div className="flex-1 p-4 rounded-lg bg-accent/10 border border-accent/20">
                <h3 className="font-semibold mb-1">2. Registra productos</h3>
                <p className="text-sm text-muted-foreground">
                  Mantén control de tu inventario
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
