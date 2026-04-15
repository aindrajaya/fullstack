import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {CreateOrderDTO, OrderDTO} from "@repo/shared"

@Injectable()
export class OrdersService {
    constructor(@Inject(PrismaService) private prisma: PrismaService){}

    async create(dto: CreateOrderDTO): Promise<OrderDTO>{
        const userId = String(dto.userId).trim();

        const user = await this.prisma.client.user.findUnique({
            where: {id: userId}
        });
        if(!user) throw new NotFoundException("User not found")

        const productsIds = dto.items.map(i => i.productId);
        const products = await this.prisma.client.product.findMany({
            where: {id: {in:productsIds}}
        });

        // Calculate the total and validation
        let orderSubtotal = 0;
        let orderTotalTax = 0;
        const orderItems: Array<{
            productId: string;
            quantity: number;
            price: number;
            tax: number;
            subtotal: number;
            taxAmount: number;
            total: number;
        }> = [];

        for (const item of dto.items){
            const product = products.find(p => p.id === item.productId);

            if(!product) throw new NotFoundException(`Product with id ${item.productId} not found`);

            if(item.quantity > product.stock){
                throw new BadRequestException(
                    "Insufficient stock for product"
                )
            }

            const itemSubTotal = product.price * item.quantity;
            const itemTaxAmount = itemSubTotal * product.tax;
            const itemTotal = itemSubTotal + itemTaxAmount;

            orderSubtotal += itemSubTotal;
            orderTotalTax += itemTaxAmount;

            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
                tax: product.tax,
                subtotal: itemSubTotal,
                taxAmount: itemTaxAmount,
                total: itemTotal
            });
        }

        // Create order and item order transacitonal
        const order = await this.prisma.client.order.create({
            data: {
                userId,
                subtotal: orderSubtotal,
                totalTax: orderTotalTax,
                totalPrice: orderSubtotal + orderTotalTax,
                status: "PENDING",
                orderItems: {
                    create: orderItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        tax: item.tax,
                        subtotal: item.subtotal,
                        taxAmount: item.taxAmount,
                        total: item.total
                    }))
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        // Format response
        return {
            id: order.id,
            userId: order.userId,
            subtotal: order.subtotal,
            totalTax: order.totalTax,
            totalPrice: order.totalPrice,
            status: order.status,
            createdAt: order.createdAt,
            items: order.orderItems.map(item => ({
                id: item.id,
                productId: item.productId,
                productName: item.product.name,
                price: item.price,
                quantity: item.quantity,
                tax: item.tax,
                subtotal: item.subtotal,
                taxAmount: item.taxAmount,
                total: item.total
            }))
        }
    }
}
