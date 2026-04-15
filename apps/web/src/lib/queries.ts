import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {ProductDTO, OrderDTO, CreateOrderDTO, UserDTO} from "@repo/shared"

const API_URL = "/api"

export const useProducts = () => {
    return useQuery<ProductDTO[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/products`);
            if(!res.ok) throw new Error("Failed to getch products")
            return res.json()
        }
    })
}

export const useUsers = () => {
    return useQuery<UserDTO[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/users`);
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
        }
    });
}

export const useProduct = (id: number) => {
    return useQuery<ProductDTO>({
        queryKey: ['product', id],
        queryFn: async() => {
            const res = await fetch(`${API_URL}/products/${id}`);
            if(!res.ok) throw new Error("Failed to fetch product");
            return res.json()
        },
        enabled: !!id
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(dto: CreateOrderDTO): Promise<OrderDTO> => {
            const res = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dto)
            });

            if(!res.ok){
                const error = await res.json();
                throw new Error(error.message || 'Failed to create order')
            }

            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['orders']})
        }
    })
}