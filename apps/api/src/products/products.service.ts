import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {ProductDTO} from "@repo/shared";

@Injectable()
export class ProductsService {
    constructor(@Inject(PrismaService) private prisma: PrismaService){}

    async findAll(): Promise<ProductDTO[]>{
        return this.prisma.client.product.findMany();
    }

    async findById(id: number): Promise<ProductDTO>{
        return this.prisma.client.product.findUniqueOrThrow({
            where: {id}
        })
    }
}
