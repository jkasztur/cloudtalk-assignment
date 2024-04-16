import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface'

export type Config = {
	redis: {
		host: string
		port: number
		db: number
	}
	amqp: RmqUrl
	product: {
		host: string
	}
}

export default (): Config => {
	const config: Config = {
		redis: {
			host: process.env.REDIS_HOST || 'localhost',
			port: parseInt(process.env.REDIS_PORT, 10) || 3005,
			db: parseInt(process.env.REDIS_DATABASE, 10) || 0,
		},
		amqp: {
			hostname: process.env.AMQP_HOST,
			port: parseInt(process.env.AMQP_PORT, 10) || 3007,
			username: process.env.AMQP_USERNAME,
			password: process.env.AMQP_PASSWORD,
		},
		product: {
			host: process.env.PRODUCT_HOST || 'localhost',
		},
	}
	if (process.env.NODE_ENV === 'test') {
		config.redis.db = 6
	}
	return config
}
