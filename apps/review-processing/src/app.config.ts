import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface'

export type Config = {
	redis: {
		host: string
		port: number
		database: number
	}
	amqp: RmqUrl
}

export default (): Config => {
	const config: Config = {
		redis: {
			host: process.env.REDIS_HOST || 'localhost',
			port: parseInt(process.env.REDIS_PORT, 10) || 3005,
			database: parseInt(process.env.REDIS_DATABASE, 10) || 0,
		},
		amqp: {
			hostname: process.env.AMQP_HOST,
			port: parseInt(process.env.AMQP_PORT, 10) || 3007,
			username: process.env.AMQP_USERNAME,
			password: process.env.AMQP_PASSWORD,
		},
	}
	if (process.env.NODE_ENV === 'test') {
		config.redis.database = 6
	}
	return config
}
