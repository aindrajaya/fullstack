import {Controller, Get, Param, Inject} from "@nestjs/common";
import {ProductsService} from "./products.service";

@Controller("products")
export class ProductsController {
    private productsService: ProductsService;

    constructor(@Inject(ProductsService) productsService: ProductsService) {
        this.productsService = productsService;
    }

    @Get()
    async getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Get(":id")
    async getProductById(@Param("id") id: string) {
        return this.productsService.getProductById(id);
    }
}