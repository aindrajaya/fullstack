import { Controller, Get, Inject } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsDTO } from '@repo/shared';

@Controller('products')
export class ProductsController {
  constructor(@Inject(ProductsService) private readonly productsService: ProductsService) {}

  @Get()
  showAll(): Promise<ProductsDTO[]>{
    return this.productsService.showAll();
  }
}
