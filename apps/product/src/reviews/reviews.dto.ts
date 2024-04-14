import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator'

export class CreateReviewRequest {
	@IsString()
	@MaxLength(128)
	firstName?: string

	@IsString()
	@MaxLength(128)
	lastName?: string

	@IsString()
	@MaxLength(1024)
	text?: string

	@IsNumber()
	@Max(5)
	@Min(1)
	rating: number
}
