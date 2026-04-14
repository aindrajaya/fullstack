import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {ProductDTO} from "@repo/shared"

@Injectable()
export class ProductsService {
    private prisma: PrismaService;

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        this.prisma = prisma;
    }
    
    async getAllProducts(): Promise<ProductDTO[]> {
        return this.prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    async getProductById(id: string): Promise<ProductDTO | null> {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }
    
    async checkStock(productId: string, quantity: number): Promise<boolean> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        return product ? product.stock >= quantity : false;
    }
}