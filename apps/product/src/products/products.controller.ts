import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './products.dto';
import { ApiTags } from '@nestjs/swagger';
import { Product } from './product.entity';

@Controller('/products')
	@ApiTags('products')
export class ProductsController {
	constructor(private service: ProductsService) {}

	@Post('/')
	@HttpCode(HttpStatus.OK)
	create(@Body() body: CreateProductDto): Promise<Product> {
		return this.service.create(body);
	}
}
