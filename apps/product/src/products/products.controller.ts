import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './products.dto';

@Controller('/products')
export class ProductsController {
	constructor(private service: ProductsService) {}

	@Post('/')
	@HttpCode(HttpStatus.OK)
	create(@Body() body: CreateProductDto) {
		return this.service.create(body);
	}
}
