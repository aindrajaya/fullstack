import { Controller, Post, Body, Inject } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from '@repo/shared';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(OrdersService) private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDTO){
    return this.ordersService.create(dto)
  }
}
