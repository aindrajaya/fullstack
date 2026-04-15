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

export interface ProductsDTO {
    id: number;
    title: string;
    description: string;
}