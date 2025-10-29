import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useProducts } from "@/hooks/useProducts";
import {
  useWarehouseProducts,
  useCreateWarehouseProduct,
  useUpdateWarehouseProduct,
  useDeleteWarehouseProduct
} from "@/hooks/useWarehouseProducts";
import { authService } from "@/services";
import { canManageProducts } from "@/utils/rbac";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Plus, Search, Edit, Trash2, PackagePlus } from "lucide-react";

export default function AlmacenProductos() {
  const { id: warehouseId } = useParams();
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
  });

  const { warehouses, isLoading: warehousesLoading } = useWarehouses();
  const { products, isLoading: productsLoading } = useProducts();
  const { data: warehouseProducts, isLoading: wpLoading } = useWarehouseProducts(parseInt(warehouseId));
  const createMutation = useCreateWarehouseProduct();
  const updateMutation = useUpdateWarehouseProduct();
  const deleteMutation = useDeleteWarehouseProduct();

  const userRole = authService.getUserRole();
  const canManage = canManageProducts(userRole);

  // Encontrar el almacén actual
  const currentWarehouse = warehouses?.find(w => w.id === parseInt(warehouseId));

  // Combinar datos de productos con warehouse_products
  const enrichedProducts = warehouseProducts?.map(wp => {
    const product = products?.find(p => p.id === wp.productId);
    return {
      ...wp,
      productName: product?.name || 'Producto desconocido',
      productSku: product?.sku,
      productPrice: product?.price,
      productDescription: product?.description,
    };
  }) || [];

  // Filtrar productos por búsqueda
  const filteredProducts = enrichedProducts.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productSku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Productos disponibles para agregar (que no estén ya en el almacén)
  const availableProducts = products?.filter(p =>
    !warehouseProducts?.some(wp => wp.productId === p.id)
  ) || [];

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!canManage) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para agregar productos al almacén",
        variant: "destructive",
      });
      return;
    }

    const data = {
      productId: parseInt(formData.productId),
      warehouseId: parseInt(warehouseId),
      quantity: parseInt(formData.quantity),
    };

    createMutation.mutate(data, {
      onSuccess: () => {
        setAddDialogOpen(false);
        setFormData({ productId: "", quantity: "" });
      },
    });
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      productId: product.productId.toString(),
      quantity: product.quantity.toString(),
    });
    setEditDialogOpen(true);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();

    if (!canManage || !selectedProduct) {
      toast({
        title: "Permiso denegado",
        description: "No tienes permisos para actualizar el stock",
        variant: "destructive",
      });
      return;
    }

    const data = {
      productId: selectedProduct.productId,
      warehouseId: parseInt(warehouseId),
      data: {
        productId: selectedProduct.productId,
        warehouseId: parseInt(warehouseId),
        quantity: parseInt(formData.quantity),
      },
    };

    updateMutation.mutate(data, {
      onSuccess: () => {
        setEditDialogOpen(false);
        setSelectedProduct(null);
        setFormData({ productId: "", quantity: "" });
      },
    });
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!canManage || !selectedProduct) {
      return;
    }

    deleteMutation.mutate(
      {
        productId: selectedProduct.productId,
        warehouseId: parseInt(warehouseId),
      },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedProduct(null);
        },
      }
    );
  };

  if (warehousesLoading) {
    return (
      <Layout>
        <Card className="glass-card p-12 border-border/50 text-center">
          <p className="text-muted-foreground">Cargando almacén...</p>
        </Card>
      </Layout>
    );
  }

  if (!currentWarehouse) {
    return (
      <Layout>
        <Card className="glass-card p-12 border-border/50 text-center">
          <h3 className="text-xl font-semibold mb-2">Almacén no encontrado</h3>
          <p className="text-muted-foreground mb-4">
            El almacén que buscas no existe o no tienes acceso a él
          </p>
          <Button onClick={() => navigate("/almacenes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Almacenes
          </Button>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="glass-card p-6 border-border/50">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <Button
                  variant="ghost"
                  className="mb-2 -ml-2"
                  onClick={() => navigate("/almacenes")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Almacenes
                </Button>
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  {currentWarehouse.name}
                </h1>
                <div className="flex flex-col gap-1 text-muted-foreground">
                  {currentWarehouse.address && (
                    <p className="text-sm">Ubicación: {currentWarehouse.address}</p>
                  )}
                  {currentWarehouse.maxCapacity && (
                    <p className="text-sm">Capacidad: {currentWarehouse.maxCapacity} unidades</p>
                  )}
                  <p className="text-sm font-semibold text-primary">
                    Productos en inventario: {enrichedProducts.length}
                  </p>
                </div>
              </div>

              {canManage && (
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-border/50">
                    <DialogHeader>
                      <DialogTitle>Agregar producto al almacén</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="productId">Producto</Label>
                        <select
                          id="productId"
                          value={formData.productId}
                          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Selecciona un producto</option>
                          {availableProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} {product.sku && `(${product.sku})`}
                            </option>
                          ))}
                        </select>
                        {availableProducts.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            Todos los productos ya están en este almacén
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Cantidad inicial</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          required
                          className="bg-background/50"
                          placeholder="0"
                          min="0"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-accent"
                        disabled={createMutation.isPending || availableProducts.length === 0}
                      >
                        {createMutation.isPending ? "Agregando..." : "Agregar al Inventario"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Search Bar */}
            <div className="pt-4 border-t border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar productos en este almacén..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Stock Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle>Actualizar stock</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div className="space-y-2">
                <Label>Producto</Label>
                <Input
                  value={selectedProduct?.productName || ""}
                  disabled
                  className="bg-background/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Nueva cantidad</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="bg-background/50"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Stock actual: {selectedProduct?.quantity || 0} unidades
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setSelectedProduct(null);
                    setFormData({ productId: "", quantity: "" });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Actualizando..." : "Actualizar Stock"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar "{selectedProduct?.productName}" de este almacén?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedProduct(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Products Grid */}
        {wpLoading || productsLoading ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <p className="text-muted-foreground">Cargando productos...</p>
          </Card>
        ) : !filteredProducts || filteredProducts.length === 0 ? (
          <Card className="glass-card p-12 border-border/50 text-center">
            <PackagePlus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? "No se encontraron productos" : "No hay productos en este almacén"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Intenta con otro término de búsqueda"
                : canManage
                ? "Comienza agregando productos al inventario de este almacén"
                : "No hay productos disponibles en este momento"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card
                key={`${product.productId}-${product.warehouseId}`}
                className="glass-card p-6 border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  {canManage && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{product.productName}</h3>
                {product.productSku && (
                  <p className="text-sm text-muted-foreground mb-2">SKU: {product.productSku}</p>
                )}
                {product.productDescription && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.productDescription}
                  </p>
                )}

                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio unitario:</span>
                    <span className="font-semibold">
                      ${Number(product.productPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock disponible:</span>
                    <span className={`font-bold text-lg ${
                      product.quantity === 0
                        ? 'text-destructive'
                        : product.quantity < 10
                        ? 'text-yellow-500'
                        : 'text-primary'
                    }`}>
                      {product.quantity} unidades
                    </span>
                  </div>
                  {product.quantity === 0 && (
                    <p className="text-xs text-destructive font-semibold">
                      Sin stock disponible
                    </p>
                  )}
                  {product.quantity > 0 && product.quantity < 10 && (
                    <p className="text-xs text-yellow-600 font-semibold">
                      Stock bajo
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
