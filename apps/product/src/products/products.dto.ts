import { PartialType } from '@nestjs/swagger'
import { IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateProductRequest {
	@IsString()
	@MaxLength(128)
	name: string

	@IsString()
	@MaxLength(256)
	description: string

	@IsNumber()
	price: number
}

export class DeleteProductResponse {
	deleted: boolean
}

export class UpdateProductRequest extends PartialType(CreateProductRequest) {}
