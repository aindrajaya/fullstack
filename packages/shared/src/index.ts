// DTO for the response API (server -> client)
export interface UserDTO {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

// DTO for the request to create new user (client -> server)
export interface CreateUserDTO {
    email: string;
    name: string; 
}

// DTO Product
export interface ProductDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    tax: number;
    stock: number;
    createdAt: string;
}

// DTO ORder item (in order)
export interface OrderItemDTO {
    id: string;
    productId: string;
    product: ProductDTO;
    quantity: number;
    price: number;
    tax: number;
    subtotal: number;
    taxAmount: number;
    total: number;
}

// DTO Order
export interface OrderDTO {
    id: string;
    userId: string;
    orderItems: OrderItemDTO[];
    subtotal: number;
    totalTax: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderItemDTO {
    productId: string;
    quantity: number;
}

export interface CreateOrderDTO {
    userItems: string; // user email
    orderItems: CreateOrderItemDTO[];
}
