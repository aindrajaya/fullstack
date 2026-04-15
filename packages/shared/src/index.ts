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

// Product DTO
export interface ProductDTO {
    id: number;
    name: string;
    price: number;
    tax: number;
    stock: number;
}

// Order DTO
export interface CreateOrderItemDTO {
    productId: number;
    quantity: number;
}

export interface CreateOrderDTO {
    userId: string;
    items: CreateOrderItemDTO[];
}

export interface OrderItemsResponseDTO {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    tax: number;
    subtotal: number;
    taxAmount: number;
    total: number;
}

export interface OrderDTO {
    id: number;
    userId: string;
    subtotal: number;
    totalTax: number;
    totalPrice: number;
    status: string;
    createdAt: Date;
    items: OrderItemsResponseDTO[];
}