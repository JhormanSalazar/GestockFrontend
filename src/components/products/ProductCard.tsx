import type { Products } from "../../types/products"

type ProductCardProps = {
  product: Products
}

export default function ProductCard({ product } : ProductCardProps) {

  const IMAGE = product.image
  const PRODUCT_NAME = product.name
  const PRICE = product.price
  const DESCRIPTION = product.description
  const CATEGORY = product.category
  const STOCK = product.stock
  const CREATED_AT = product.createdAt
  const UPDATED_AT = product.updatedAt

  return (
    <div className="shadow-xl">
      <div className="overflow-hidden">
        <figure>
          <img
            src={IMAGE}
            alt={`Image of ${PRODUCT_NAME}`}
            className=" hover:cursor-pointer hover:scale-105 transition-transform"
          />
        </figure>
      </div>

      <div className=" p-5">
        <h2 className="text-xl truncate font-semibold">{PRODUCT_NAME} - ${PRICE}</h2>
        <p className="text-sm text-gray-500">{DESCRIPTION}</p>
        <p className="text-sm text-gray-500">Categoría: {CATEGORY}</p>
        <p className="text-sm text-gray-500">Stock: {STOCK}</p>
        <p className="text-sm text-gray-500">Creado el: {CREATED_AT}</p>
        <p className="text-sm text-gray-500">Actualizado el: {UPDATED_AT}</p>
      </div>
    </div>
  );
}
