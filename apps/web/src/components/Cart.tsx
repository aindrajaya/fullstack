import { Dispatch, SetStateAction } from "react";
import type {ProductDTO, CreateOrderDTO} from "@repo/shared"
import { useCreateOrder } from "../lib/queries";

interface CartItem {
    product: ProductDTO,
    quantity: number;
}

interface CartProps {
    userId: string;
    cartItems: CartItem[];
    setCartItems: Dispatch<SetStateAction<CartItem[]>>;
}

export function Cart({userId, cartItems, setCartItems}: CartProps){
    const createOrder = useCreateOrder();

    const removeFromCart = (productId: number) => {
        setCartItems(cartItems.filter(item => item.product.id !== productId));
    }

    const calculateTotals = () => {
        let subtotal = 0;
        let totalTax = 0;

        cartItems.forEach(item => {
            const itemSubtotal = item.product.price * item.quantity;
            const itemTax = itemSubtotal * item.product.tax;
            subtotal += itemSubtotal;
            totalTax += itemTax;
        });

        return {subtotal, totalTax, totalPrice: subtotal + totalTax}
    };

    const handleCheckout = async () => {
        if (!userId) {
            alert("User belum tersedia. Coba lagi sebentar.");
            return;
        }

        const dto: CreateOrderDTO = {
            userId,
            items: cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }))
        };

        try {
            const result = await createOrder.mutateAsync(dto);
            console.log("Order created:", result)
            setCartItems([])
            alert("Order Brahasil dibuat")
        } catch (error){
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`Error: ${message}`)
        }
    }

    const {subtotal, totalTax, totalPrice} = calculateTotals();

    return (
        <div className="border p-4 rounded">
            <h2>Cart</h2>
            {cartItems.length === 0 ?(
                <p>Cart kosong</p>
            ): (
                <>
                    {cartItems.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center mb-2 pb-2 border-b">
                            <div>
                                <p>{item.product.name}</p>
                                <p>QTY: {item.quantity} x Rp. {item.product.price.toLocaleString()}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.product.id)}>
                                Remove
                            </button>
                        </div>
                    ))}

                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal: </span>
                            <span>Rp {subtotal}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Total Tax:</span>
                            <span>Rp {totalTax}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Total Price:</span>
                            <span>Rp {totalPrice}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={createOrder.isPending || !userId}
                        >
                            {createOrder.isPending ? "Processing..." : !userId ? "Loading user..." : "Checkout"}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}