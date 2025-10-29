import { useAllBusinesses } from "@/hooks/useBusiness";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Briefcase, MapPin, Users } from "lucide-react";

export default function Negocios() {
  const { data: businesses, isLoading, isError, error } = useAllBusinesses();

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Negocios</h1>
            <p className="text-muted-foreground">Vista de todos los negocios registrados en el sistema</p>
          </div>
        </div>

        {isLoading ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <p className="text-muted-foreground">Cargando negocios...</p>
          </Card>
        ) : isError ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h3 className="text-xl font-semibold mb-2">Error al cargar negocios</h3>
            <p className="text-muted-foreground">{error?.message || "No se pudieron cargar los negocios"}</p>
          </Card>
        ) : !businesses || businesses.length === 0 ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay negocios registrados</h3>
            <p className="text-muted-foreground">
              Aún no hay negocios en el sistema
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <Card
                key={business.id}
                className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {business.id}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{business.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Usuarios: {business.users?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Almacenes: {business.warehouses?.length || 0}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
