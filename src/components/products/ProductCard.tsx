import { useState } from "react"
import { useAppStore } from "../../stores/useAppStore"
import type { Products } from "../../types/products"
import ProductForm from "./ProductForm"

type ProductCardProps = {
  product: Products
}

export default function ProductCard({ product } : ProductCardProps) {

  const [showProductForm, setShowProductForm] = useState(false)

  const getProductById = useAppStore(state => state.getProductById)

  const IMAGE = product.image
  const PRODUCT_NAME = product.name
  const PRICE = product.price
  const DESCRIPTION = product.description
  const CATEGORY = product.category
  const STOCK = product.stock
  const CREATED_AT = product.createdAt
  const UPDATED_AT = product.updatedAt

  return (
    <div className="shadow-xl h-[600px] flex flex-col">
      <ProductForm
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
      />
      <div className="overflow-hidden h-[250px]">
        <figure className="w-full h-full">
          <img
            src={IMAGE}
            alt={`Image of ${PRODUCT_NAME}`}
            className="w-full h-full object-cover hover:cursor-pointer hover:scale-105 transition-transform"
          />
        </figure>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-xl truncate font-semibold mb-2">
            {PRODUCT_NAME} - ${PRICE}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{DESCRIPTION}</p>
          <p className="text-sm text-gray-500">Categoría: {CATEGORY}</p>
          <p className="text-sm text-gray-500">Stock: {STOCK}</p>
          <p className="text-sm text-gray-500">Creado el: {CREATED_AT}</p>
          <p className="text-sm text-gray-500">Actualizado el: {UPDATED_AT}</p>
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer w-full h-12 font-medium text-white text-lg rounded mt-4"
          onClick={() => {
            getProductById(product.id)
            setShowProductForm(true)
          }}
        >
          Editar
        </button>
      </div>
    </div>
  );
}
