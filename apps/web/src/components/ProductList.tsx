import {useProducts} from "../lib/queries"
import type {ProductDTO} from "@repo/shared"

interface ProductListProps {
    onAddToCart: (product: ProductDTO, quantity: number) => void;
}

export function ProductList({onAddToCart}: ProductListProps){
    const {data: products, isLoading, error} = useProducts();

    if(isLoading) return <div>Loading products...</div>
    if(error) return <div>Error loading products</div>

    return(
        <div className="grid grid-cols-3 gap-4">
            {products?.map(product => (
                <div key={product.id} className="border p-4 rounded">
                    <h3 className="font-bold">{product.name}</h3>
                    <p>{product.price.toLocaleString()}</p>
                    <p>{(product.tax * 100)}%</p>
                    <p>Stock: {product.stock}</p>

                    <button
                        onClick={()=> onAddToCart(product, 1)}
                        disabled={product.stock === 0}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                    >
                        Add to cart
                    </button>
                </div>
                
            ))}
        </div>
    )
}