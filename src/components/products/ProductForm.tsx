import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../ui/Modal";
// import type { ProductFormType } from "../../types/productForm";
import { productFormSchema } from "../../schemas/productFormSchema";
import { useProduct } from "../../hooks/useProduct";
import type { ProductFormData } from "../../types/products";

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductForm({ isOpen, onClose }: ProductFormProps) {
   
  const { createProduct } = useProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
  });

  const onSubmit = (data: ProductFormData) => {
    createProduct(data);
    reset();
    onClose();
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Añadir Nuevo Producto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre del Producto */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre del Producto
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={3}
            className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                id="price"
                {...register("price")}
                placeholder="00.0"
                className="pl-7 p-2 border block w-full rounded-md border-gray-300"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="text"
              id="stock"
              {...register("stock")}
              placeholder="0"
              className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
            )}
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            {...register("category")}
            className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Seleccionar categoría</option>
            <option value="electronics">Electrónicos</option>
            <option value="clothing">Ropa</option>
            <option value="food">Alimentos</option>
            <option value="other">Otros</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Imagen del Producto */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Imagen del Producto (URL)
          </label>
          <input
            type="text"
            id="image"
            {...register("image")}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Guardar Producto
          </button>
        </div>
      </form>
    </Modal>
  );
}
