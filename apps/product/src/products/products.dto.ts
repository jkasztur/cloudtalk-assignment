import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
	@IsString()
	@MaxLength(128)
	name: string;

	@IsString()
	@MaxLength(256)
	description: string;

	@IsNumber()
	price: number;
}
