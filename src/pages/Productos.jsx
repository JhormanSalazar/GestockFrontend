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
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Package, Trash2, Edit, Search } from "lucide-react";

export default function Productos() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    description: "",
  });

  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const userRole = authService.getUserRole();
  const canManage = canManageProducts(userRole);

  // Filtrar productos por búsqueda
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funciones para manejo de selección
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts?.map(p => p.id) || []);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!canManage) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para eliminar productos",
        variant: "destructive",
      });
      return;
    }

    if (selectedIds.length === 0) {
      toast({
        title: "No hay selección",
        description: "Selecciona al menos un producto para eliminar",
        variant: "destructive",
      });
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      try {
        await deleteProduct.mutateAsync(id);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: "Productos eliminados",
        description: `${successCount} producto(s) eliminado(s) exitosamente`,
      });
    }

    if (errorCount > 0) {
      toast({
        title: "Errores al eliminar",
        description: `${errorCount} producto(s) no pudieron ser eliminados`,
        variant: "destructive",
      });
    }

    setSelectedIds([]);
    setDeleteDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canManage) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para crear productos",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name: formData.name,
      sku: formData.sku || null,
      price: formData.price ? parseFloat(formData.price) : 0,
      description: formData.description || null,
    };

    createProduct.mutate(productData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ name: "", sku: "", price: "", description: "" });
      },
    });
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku || "",
      price: product.price.toString(),
      description: product.description || "",
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!canManage || !editingProduct) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para editar productos",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name: formData.name,
      sku: formData.sku || null,
      price: formData.price ? parseFloat(formData.price) : 0,
      description: formData.description || null,
    };

    updateProduct.mutate(
      { id: editingProduct.id, data: productData },
      {
        onSuccess: () => {
          setEditOpen(false);
          setEditingProduct(null);
          setFormData({ name: "", sku: "", price: "", description: "" });
        },
      }
    );
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="glass-card p-6 border-border/50">
          <div className="flex flex-col gap-4">
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

            {/* Search and Actions Row */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, SKU o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>

              {/* Selection Actions */}
              {canManage && filteredProducts && filteredProducts.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedIds.length === filteredProducts.length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedIds.length > 0
                        ? `${selectedIds.length} seleccionado(s)`
                        : "Seleccionar todos"}
                    </span>
                  </div>

                  {selectedIds.length > 0 && (
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          Eliminar ({selectedIds.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-border/50">
                        <DialogHeader>
                          <DialogTitle>Confirmar eliminación</DialogTitle>
                          <DialogDescription>
                            ¿Estás seguro de que deseas eliminar {selectedIds.length} producto(s)?
                            Esta acción no se puede deshacer.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteSelected}
                            disabled={deleteProduct.isPending}
                          >
                            {deleteProduct.isPending ? "Eliminando..." : "Eliminar"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle>Editar producto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre del producto</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background/50"
                    placeholder="Ej: Laptop HP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="bg-background/50"
                    placeholder="Ej: LAP-HP-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Precio</Label>
                <Input
                  id="edit-price"
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
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-background/50"
                  placeholder="Descripción del producto..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditOpen(false);
                    setEditingProduct(null);
                    setFormData({ name: "", sku: "", price: "", description: "" });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                  disabled={updateProduct.isPending}
                >
                  {updateProduct.isPending ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Products Grid */}
        {isLoading ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <p className="text-muted-foreground">Cargando productos...</p>
          </Card>
        ) : !filteredProducts || filteredProducts.length === 0 ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Intenta con otro término de búsqueda"
                : canManage
                ? "Comienza registrando tus primeros productos en el catálogo"
                : "No hay productos disponibles en este momento"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300 ${
                  selectedIds.includes(product.id) ? "border-primary ring-2 ring-primary/20" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    {canManage && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Checkbox
                          checked={selectedIds.includes(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                        />
                      </>
                    )}
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
