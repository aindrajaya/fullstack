import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ProductsService } from "../products/products.service";
import { CreateOrderDTO, OrderDTO, CreateOrderItemDTO } from "@repo/shared";
import { Prisma } from "@repo/database";

@Injectable()
export class OrdersService {
    private prisma: PrismaService;
    private productsService: ProductsService;

    constructor(
        @Inject(PrismaService) prisma: PrismaService,
        @Inject(ProductsService) productsService: ProductsService
    ) {
        this.prisma = prisma;
        this.productsService = productsService;
    }

    // 🎯 Helper: Convert Decimal to number
    private toNumber(value: Prisma.Decimal | number): number {
        return typeof value === "number" ? value : value.toNumber();
    }

    // 🎯 Helper: Hitung subtotal, tax, dan total untuk 1 item
    private calculateItemTotal(price: number, quantity: number, taxRate: number) {
        const subtotal = price * quantity;
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount;
        
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        };
    }

    // 📋 Get all orders user
    async findAll(userId: string): Promise<OrderDTO[]> {
        return this.prisma.client.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: "desc" }
        }) as Promise<OrderDTO[]>;
    }

    // 📝 Get one order by ID
    async findOne(id: string): Promise<OrderDTO | null> {
        return this.prisma.client.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: { product: true }
                }
            }
        }) as Promise<OrderDTO | null>;
    }

    // 🛒 CREATE ORDER - KALKULASI PAJAK OTOMATIS
    async createOrder(createOrderDTO: CreateOrderDTO): Promise<OrderDTO> {
        const { userId, items } = createOrderDTO;

        // Validasi user exist
        const user = await this.prisma.client.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new BadRequestException("User tidak ditemukan");
        }

        // Validasi items tidak kosong
        if (!items || items.length === 0) {
            throw new BadRequestException("Order harus memiliki minimal 1 item");
        }

        // Validasi stok dan ambil data produk
        const orderItemsData: Array<{
            productId: string;
            quantity: number;
            price: number;
            tax: number;
        }> = [];

        for (const item of items) {
            const product = await this.productsService.findOne(item.productId);
            
            if (!product) {
                throw new BadRequestException(`Produk ${item.productId} tidak ditemukan`);
            }

            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Stok ${product.name} tidak cukup. Tersedia: ${product.stock}`
                );
            }

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                tax: product.tax
            });
        }

        // Hitung total order (dengan pajak)
        let totalSubtotal = 0;
        let totalTax = 0;

        // Persiapkan order items untuk dibuat
        const orderItemsToCreate = orderItemsData.map(item => {
            const calc = this.calculateItemTotal(item.price, item.quantity, item.tax);
            totalSubtotal += calc.subtotal;
            totalTax += calc.taxAmount;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: new Prisma.Decimal(item.price.toFixed(2)),
                tax: new Prisma.Decimal(item.tax.toFixed(3)),
                subtotal: new Prisma.Decimal(calc.subtotal.toFixed(2)),
                taxAmount: new Prisma.Decimal(calc.taxAmount.toFixed(2)),
                total: new Prisma.Decimal(calc.total.toFixed(2))
            };
        });

        const totalPrice = totalSubtotal + totalTax;

        // 💾 Buat order dengan transaction (atomicity)
        const order = await this.prisma.client.order.create({
            data: {
                userId,
                subtotal: new Prisma.Decimal(totalSubtotal.toFixed(2)),
                totalTax: new Prisma.Decimal(totalTax.toFixed(2)),
                totalPrice: new Prisma.Decimal(totalPrice.toFixed(2)),
                status: "PENDING",
                orderItems: {
                    create: orderItemsToCreate
                }
            },
            include: {
                orderItems: {
                    include: { product: true }
                }
            }
        });

        // ⚠️ Kurangi stok produk
        for (const item of orderItemsData) {
            await this.prisma.client.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: items.find(i => i.productId === item.productId)?.quantity || 0
                    }
                }
            });
        }

        return order as OrderDTO;
    }

    // ✅ Update status order
    async updateOrderStatus(id: string, status: string): Promise<OrderDTO> {
        const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
        
        if (!validStatuses.includes(status)) {
            throw new BadRequestException(`Status ${status} tidak valid`);
        }

        return this.prisma.client.order.update({
            where: { id },
            data: { status },
            include: {
                orderItems: {
                    include: { product: true }
                }
            }
        }) as Promise<OrderDTO>;
    }

    // 🗑️ Cancel order (kembalikan stok)
    async cancelOrder(id: string): Promise<OrderDTO> {
        const order = await this.findOne(id);
        
        if (!order) {
            throw new BadRequestException("Order tidak ditemukan");
        }

        if (order.status !== "PENDING") {
            throw new BadRequestException("Hanya order PENDING yang bisa dibatalkan");
        }

        // Kembalikan stok
        for (const item of order.orderItems) {
            await this.prisma.client.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        increment: item.quantity
                    }
                }
            });
        }

        return this.updateOrderStatus(id, "CANCELLED");
    }
}