import {
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from 'class-validator'

export class CreateReviewRequest {
	@IsNumber()
	productId: number

	@IsOptional()
	@IsString()
	@MaxLength(128)
	firstName: string

	@IsOptional()
	@IsString()
	@MaxLength(128)
	lastName: string

	@IsOptional()
	@IsString()
	@MaxLength(1024)
	text: string

	@IsNumber()
	@Max(5)
	@Min(1)
	rating: number
}

export class UpdateReviewRequest {
	@IsOptional()
	@IsString()
	@MaxLength(128)
	firstName: string

	@IsOptional()
	@IsString()
	@MaxLength(128)
	lastName: string

	@IsOptional()
	@IsString()
	@MaxLength(1024)
	text: string

	@IsOptional()
	@Max(5)
	@Min(1)
	rating: number
}
