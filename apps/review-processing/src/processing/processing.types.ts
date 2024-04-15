// TODO: move to shared package?
export interface ReviewCreated {
	productId: number
	rating: number
}

export interface ReviewDeleted {
	productId: number
	rating: number
}

export interface ReviewUpdated {
	productId: number
	newRating: number
	oldRating: number
}

export type ReviewEvent = ReviewCreated | ReviewDeleted | ReviewUpdated

export enum EventType {
	ReviewCreated = 'review.created',
	ReviewDeleted = 'review.deleted',
	ReviewUpdated = 'review.updated',
}
