import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface'
import { DataSourceOptions } from 'typeorm'

export type Config = {
	postgres: {
		host: string
		port: number
		username: string
		password: string
		database: string
		type: DataSourceOptions['type']
	}
	redis: {
		host: string
		port: number
		database: number
	}
	amqp: RmqUrl
}

export default (): Config => {
	const config: Config = {
		postgres: {
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT, 10) || 3006,
			username: process.env.DB_USERNAME || 'postgres',
			password: process.env.DB_PASSWORD || 'postgres',
			database: process.env.DB_DATABASE || 'postgres',
			type: 'postgres',
		},
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
		config.postgres.database = 'test'
		config.redis.database = 6
	}
	return config
}
