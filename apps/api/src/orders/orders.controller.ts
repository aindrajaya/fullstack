import { Controller, Get, Post, Patch, Param, Body, Inject } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDTO } from "@repo/shared";

@Controller("orders")
export class OrdersController {
    private ordersService: OrdersService;

    constructor(@Inject(OrdersService) ordersService: OrdersService) {
        this.ordersService = ordersService;
    }

    // GET /orders?userId=xxx
    @Get()
    async findAll(@Param("userId") userId: string) {
        return this.ordersService.findAll(userId);
    }

    // GET /orders/:id
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.ordersService.findOne(id);
    }

    // POST /orders (create order)
    @Post()
    async create(@Body() createOrderDTO: CreateOrderDTO) {
        return this.ordersService.createOrder(createOrderDTO);
    }

    // PATCH /orders/:id/status
    @Patch(":id/status")
    async updateStatus(
        @Param("id") id: string,
        @Body() { status }: { status: string }
    ) {
        return this.ordersService.updateOrderStatus(id, status);
    }

    // PATCH /orders/:id/cancel
    @Patch(":id/cancel")
    async cancel(@Param("id") id: string) {
        return this.ordersService.cancelOrder(id);
    }
}